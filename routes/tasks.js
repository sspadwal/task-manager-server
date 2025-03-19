import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

router.post('/', async(req, res) => {
    const { title, description, priority } = req.body;
    try {
        const task = new Task({ title, description, priority, user: req.userId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
});

router.put('/:id', async(req, res) => {
    const { title, description, priority, completed } = req.body;
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { title, description, priority, completed }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

export default router;