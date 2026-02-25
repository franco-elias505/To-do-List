// todos.routes.js
const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todos.controller');
router.get('/todos', todosController.getAll);      // GET  /api/todos
router.post('/todos', todosController.create);     // POST /api/todos
router.put('/todos/:id', todosController.update);  // PUT  /api/todos/1
router.delete('/todos/:id', todosController.deleteTask); // DELETE /api/todos/1
module.exports = router;