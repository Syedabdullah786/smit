import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all invoices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, customerId, startDate, endDate } = req.query;

    let where: any = {};

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                partNumber: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invoice by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        },
        payments: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create invoice
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      customerId,
      items,
      dueDate,
      notes,
      discount = 0,
      taxRate = 18
    } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer and items are required' });
    }

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { invoiceNumber: true }
    });

    let invoiceNumber = 'INV-001';
    if (lastInvoice?.invoiceNumber) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Calculate totals
    let subtotal = 0;
    const invoiceItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = item.quantity * item.price;
      subtotal += itemTotal;

      invoiceItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0
      });
    }

    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;

    // Create invoice in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          customerId,
          subtotal,
          discount: discountAmount,
          taxRate,
          taxAmount,
          total,
          dueDate: dueDate ? new Date(dueDate) : null,
          notes,
          items: {
            create: invoiceItems
          }
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product quantities
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return invoice;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update invoice status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(invoice);
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add payment to invoice
router.post('/:id/payments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentDate, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = invoice.total - totalPaid;

    if (amount > remainingAmount) {
      return res.status(400).json({ error: 'Payment amount exceeds remaining balance' });
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceId: id,
        amount,
        paymentMethod,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        notes
      }
    });

    // Update invoice paid amount and status
    const newTotalPaid = totalPaid + amount;
    let newStatus = invoice.status;

    if (newTotalPaid >= invoice.total) {
      newStatus = 'PAID';
    } else if (newStatus === 'PAID') {
      newStatus = 'PARTIALLY_PAID';
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        paidAmount: newTotalPaid,
        status: newStatus
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete invoice
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.payments.length > 0) {
      return res.status(400).json({ error: 'Cannot delete invoice with payments' });
    }

    // Restore product quantities
    await prisma.$transaction(async (tx) => {
      for (const item of invoice.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        });
      }

      await tx.invoice.delete({
        where: { id }
      });
    });

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invoice statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const totalInvoices = await prisma.invoice.count();
    const paidInvoices = await prisma.invoice.count({ where: { status: 'PAID' } });
    const pendingInvoices = await prisma.invoice.count({ where: { status: 'PENDING' } });
    const overdueInvoices = await prisma.invoice.count({ where: { status: 'OVERDUE' } });

    const totalRevenue = await prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { total: true }
    });

    const pendingRevenue = await prisma.invoice.aggregate({
      where: { status: { in: ['PENDING', 'OVERDUE'] } },
      _sum: { total: true }
    });

    res.json({
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingRevenue: pendingRevenue._sum.total || 0
    });
  } catch (error) {
    console.error('Get invoice stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;