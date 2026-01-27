import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'USER' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;