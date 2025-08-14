import { register, login } from '../services/authService.js';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await register({ name, email, password });
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Si coincide con admin del .env, devolver usuario admin
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generar token admin
      const jwt = await import('jsonwebtoken');
      const token = jwt.default.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      return res.json({
        token,
        user: { email, name: 'Admin', role: 'admin', isAdmin: true }
      });
    }
    // Login normal
    const { token, user } = await login({ email, password });
    res.json({ token, user: { ...user, isAdmin: user.role === 'admin' } });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
