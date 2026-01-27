import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    // Get current date and start of month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Revenue metrics
    const monthlyRevenue = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        total: true
      }
    });

    const yearlyRevenue = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startOfYear
        }
      },
      _sum: {
        total: true
      }
    });

    // Invoice counts
    const totalInvoices = await prisma.invoice.count();
    const paidInvoices = await prisma.invoice.count({ where: { status: 'PAID' } });
    const pendingInvoices = await prisma.invoice.count({ where: { status: 'PENDING' } });
    const overdueInvoices = await prisma.invoice.count({ where: { status: 'OVERDUE' } });

    // Customer metrics
    const totalCustomers = await prisma.customer.count();
    const activeCustomers = await prisma.customer.count({
      where: {
        invoices: {
          some: {
            createdAt: {
              gte: startOfMonth
            }
          }
        }
      }
    });

    // Product metrics
    const totalProducts = await prisma.product.count();
    const lowStockProducts = await prisma.product.count({
      where: {
        quantity: {
          lte: 10
        }
      }
    });

    // Employee metrics
    const totalEmployees = await prisma.employee.count();
    const activeEmployees = await prisma.employee.count({
      where: { status: 'ACTIVE' }
    });

    // Today's recovery (payments received today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRecovery = await prisma.payment.aggregate({
      where: {
        paymentDate: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        amount: true
      }
    });

    // Outstanding amounts
    const outstandingInvoices = await prisma.invoice.findMany({
      where: {
        status: {
          in: ['PENDING', 'OVERDUE']
        }
      },
      select: {
        total: true,
        paidAmount: true
      }
    });

    const totalOutstanding = outstandingInvoices.reduce((sum, invoice) => {
      return sum + (invoice.total - invoice.paidAmount);
    }, 0);

    // Recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            name: true
          }
        }
      }
    });

    // Low stock products
    const lowStockItems = await prisma.product.findMany({
      where: {
        quantity: {
          lte: 10
        }
      },
      take: 5,
      orderBy: {
        quantity: 'asc'
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        minQuantity: true
      }
    });

    res.json({
      revenue: {
        monthly: monthlyRevenue._sum.total || 0,
        yearly: yearlyRevenue._sum.total || 0
      },
      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
        pending: pendingInvoices,
        overdue: overdueInvoices
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts
      },
      employees: {
        total: totalEmployees,
        active: activeEmployees
      },
      recovery: {
        today: todayRecovery._sum.amount || 0
      },
      outstanding: totalOutstanding,
      recentInvoices,
      lowStockItems
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales chart data
router.get('/charts/sales', authenticateToken, async (req, res) => {
  try {
    const { period = 'monthly', year = new Date().getFullYear() } = req.query;

    let groupBy;
    let dateFormat;

    if (period === 'monthly') {
      groupBy = 'month';
      dateFormat = 'YYYY-MM';
    } else if (period === 'weekly') {
      groupBy = 'week';
      dateFormat = 'YYYY-WW';
    } else {
      groupBy = 'day';
      dateFormat = 'YYYY-MM-DD';
    }

    // This would require raw SQL for complex date grouping
    // For now, return mock data structure
    const salesData = [];

    res.json({
      period,
      year,
      data: salesData
    });
  } catch (error) {
    console.error('Get sales chart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get revenue trends
router.get('/charts/revenue-trends', authenticateToken, async (req, res) => {
  try {
    const last12Months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const revenue = await prisma.invoice.aggregate({
        where: {
          status: 'PAID',
          createdAt: {
            gte: date,
            lte: endDate
          }
        },
        _sum: {
          total: true
        }
      });

      last12Months.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: revenue._sum.total || 0
      });
    }

    res.json(last12Months);
  } catch (error) {
    console.error('Get revenue trends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer balance summary
router.get('/customer-balances', authenticateToken, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
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

    const customerBalances = customers.map(customer => {
      const outstanding = customer.invoices.reduce((sum, invoice) => {
        return sum + (invoice.total - invoice.paidAmount);
      }, 0);

      return {
        id: customer.id,
        name: customer.name,
        outstanding,
        creditLimit: customer.creditLimit,
        availableCredit: customer.creditLimit - outstanding
      };
    }).filter(customer => customer.outstanding > 0)
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 10); // Top 10 customers with outstanding balances

    res.json(customerBalances);
  } catch (error) {
    console.error('Get customer balances error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendor balance summary (if vendors are implemented)
router.get('/vendor-balances', authenticateToken, async (req, res) => {
  try {
    // For now, return empty array as vendors might not be fully implemented
    res.json([]);
  } catch (error) {
    console.error('Get vendor balances error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get expense breakdown
router.get('/expense-breakdown', authenticateToken, async (req, res) => {
  try {
    const expenses = await prisma.expense.groupBy({
      by: ['category'],
      _sum: {
        amount: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    res.json(expenses.map(expense => ({
      category: expense.category,
      amount: expense._sum.amount || 0
    })));
  } catch (error) {
    console.error('Get expense breakdown error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;