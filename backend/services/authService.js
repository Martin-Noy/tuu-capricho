import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, email, password: hashedPassword, role: 'client' });
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid password');
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return { token, user: { id: user.id, email: user.email, role: user.role } };
};