import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.js';
import { requireAdmin } from '../middleware/permissions.js';
import crypto from 'crypto';
import { sendEmail, createPasswordResetEmail } from '../utils/mailer.js';

const router = express.Router();

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Login fehlgeschlagen.' });
    }
    await user.update({ lastLogin: new Date() });
    const token = jwt.sign({ userId: user.id, id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  }
);

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'active', 'createdAt', 'lastLogin']
    });

    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Get all users (admin only)
router.get('/users', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'active', 'createdAt', 'lastLogin'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Create new user (admin only)
router.post('/users', auth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'redakteur', active = true } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, E-Mail und Passwort erforderlich' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Benutzer mit dieser E-Mail existiert bereits' });
    }

    // Validate role
    if (!['admin', 'redakteur'].includes(role)) {
      return res.status(400).json({ error: 'Ungültige Rolle. Erlaubt: admin, redakteur' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      active
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update user (admin only)
router.put('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, active } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const updateData = { name, email, role, active };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    await user.update(updateData);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Sie können sich nicht selbst löschen' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    await user.destroy();
    res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Update own profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const updateData = {};

    // Update name if provided
    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'E-Mail wird bereits verwendet' });
      }
      updateData.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isValidPassword = await user.checkPassword(currentPassword);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Aktuelles Passwort ist falsch' });
      }
      updateData.password = newPassword;
    }

    // Update user
    await user.update(updateData);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Profil erfolgreich aktualisiert'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Request password reset
router.post('/forgot-password',
  body('email').isEmail(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: 'Wenn die E-Mail-Adresse existiert, wurde eine E-Mail mit Anweisungen gesendet.' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      await user.update({
        resetToken,
        resetTokenExpiry
      });

      // Send reset email
      const resetEmail = createPasswordResetEmail(user, resetToken);
      const emailResult = await sendEmail(resetEmail);

      if (emailResult.success) {
        res.json({ message: 'Wenn die E-Mail-Adresse existiert, wurde eine E-Mail mit Anweisungen gesendet.' });
      } else {
        console.error('Password reset email error:', emailResult.error);
        res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden.' });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Server-Fehler' });
    }
  }
);

// Verify reset token
router.post('/verify-reset-token',
  body('token').exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      
      const { token } = req.body;
      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Ungültiger oder abgelaufener Reset-Token.' });
      }

      res.json({ message: 'Token ist gültig.' });
    } catch (error) {
      console.error('Verify reset token error:', error);
      res.status(500).json({ error: 'Server-Fehler' });
    }
  }
);

// Reset password
router.post('/reset-password',
  body('token').exists(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      
      const { token, password } = req.body;
      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiry: { [require('sequelize').Op.gt]: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Ungültiger oder abgelaufener Reset-Token.' });
      }

      // Update password and clear reset token
      await user.update({
        password,
        resetToken: null,
        resetTokenExpiry: null
      });

      res.json({ message: 'Passwort wurde erfolgreich zurückgesetzt.' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Server-Fehler' });
    }
  }
);

export default router; 