const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.get('/', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/', async (req, res) => {
    const { title } = req.body;
    const newTodo = new Todo({ title });
    try {
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Todo.findByIdAndDelete(id);
      res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

module.exports = router;