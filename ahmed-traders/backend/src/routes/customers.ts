import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        invoices: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        invoices: {
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create customer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      gstNumber,
      creditLimit = 0,
      paymentTerms = 'Net 30'
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        gstNumber,
        creditLimit,
        paymentTerms
      }
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      gstNumber,
      creditLimit,
      paymentTerms
    } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        gstNumber,
        creditLimit,
        paymentTerms
      }
    });

    res.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer has invoices
    const invoiceCount = await prisma.invoice.count({
      where: { customerId: id }
    });

    if (invoiceCount > 0) {
      return res.status(400).json({ error: 'Cannot delete customer with existing invoices' });
    }

    await prisma.customer.delete({
      where: { id }
    });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer balance
router.get('/:id/balance', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        invoices: {
          where: {
            status: {
              in: ['PENDING', 'OVERDUE']
            }
          },
          select: {
            total: true,
            paidAmount: true
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const totalOutstanding = customer.invoices.reduce((sum, invoice) => {
      return sum + (invoice.total - invoice.paidAmount);
    }, 0);

    res.json({
      customerId: id,
      customerName: customer.name,
      totalOutstanding,
      creditLimit: customer.creditLimit,
      availableCredit: customer.creditLimit - totalOutstanding
    });
  } catch (error) {
    console.error('Get customer balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;