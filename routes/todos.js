const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos (with optional filter)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    let query = {};
    if (filter === 'active') query.completed = false;
    if (filter === 'completed') query.completed = true;

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    const totalCount = await Todo.countDocuments();
    const activeCount = await Todo.countDocuments({ completed: false });
    const completedCount = await Todo.countDocuments({ completed: true });

    res.render('index', { todos, filter, totalCount, activeCount, completedCount });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// POST create todo
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    await Todo.create({
      title,
      description,
      priority,
      dueDate: dueDate || null
    });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error creating todo: ' + err.message);
  }
});

// GET edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send('Todo not found');
    res.render('edit', { todo });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// PUT update todo
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    await Todo.findByIdAndUpdate(req.params.id, {
      title,
      description,
      priority,
      dueDate: dueDate || null
    });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error updating: ' + err.message);
  }
});

// PATCH toggle complete
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.redirect('back');
  } catch (err) {
    res.status(500).send('Error toggling: ' + err.message);
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting: ' + err.message);
  }
});

// DELETE all completed
router.delete('/', async (req, res) => {
  try {
    await Todo.deleteMany({ completed: true });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

module.exports = router;
