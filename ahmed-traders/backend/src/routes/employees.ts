import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireManager } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all employees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get employee by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create employee
router.post('/', authenticateToken, requireManager, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      position,
      department,
      salary,
      hireDate,
      status = 'ACTIVE'
    } = req.body;

    if (!name || !email || !position) {
      return res.status(400).json({ error: 'Name, email, and position are required' });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        position,
        department,
        salary,
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        status
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update employee
router.put('/:id', authenticateToken, requireManager, async (req, res) => {
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
      position,
      department,
      salary,
      hireDate,
      status
    } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        position,
        department,
        salary,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        status
      }
    });

    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee
router.delete('/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { id }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get employee statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count();
    const activeEmployees = await prisma.employee.count({
      where: { status: 'ACTIVE' }
    });
    const inactiveEmployees = await prisma.employee.count({
      where: { status: 'INACTIVE' }
    });

    const departmentStats = await prisma.employee.groupBy({
      by: ['department'],
      _count: {
        id: true
      },
      where: {
        department: {
          not: null
        }
      }
    });

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departmentStats
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;