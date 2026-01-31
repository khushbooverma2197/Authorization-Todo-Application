const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} = require('../controllers/todo.controller');

/**
 * All routes in this file are protected by authMiddleware
 */

/**
 * @route   POST /todos
 * @desc    Create a new todo
 * @access  Private
 */
router.post('/', authMiddleware, createTodo);

/**
 * @route   GET /todos
 * @desc    Get all todos for authenticated user
 * @access  Private
 */
router.get('/', authMiddleware, getTodos);

/**
 * @route   PUT /todos/:id
 * @desc    Update a specific todo
 * @access  Private
 */
router.put('/:id', authMiddleware, updateTodo);

/**
 * @route   DELETE /todos/:id
 * @desc    Delete a specific todo
 * @access  Private
 */
router.delete('/:id', authMiddleware, deleteTodo);

module.exports = router;
