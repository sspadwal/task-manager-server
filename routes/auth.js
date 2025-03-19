import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async(req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        if (await User.findOne({ username })) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // Log error
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    try {
        console.log('Login request received for username:', username); // Debugging
        if (!username || !password) {
            console.log('Username or password missing'); // Debugging
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username); // Debugging
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('Incorrect password for user:', username); // Debugging
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
        console.log('Login successful for user:', username); // Debugging
        res.json({ token, username });
    } catch (error) {
        console.error('Login error:', error); // Debugging
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

export default router;