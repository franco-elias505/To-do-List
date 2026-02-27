
const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todos.controller');
router.get('/todos', todosController.getAll);      
router.post('/todos', todosController.create);     
router.patch('/todos/complete-all', todosController.completeAll);
router.delete('/todos/delete-all', todosController.deleteAll);
router.put('/todos/:id', todosController.update);  
router.patch('/todos/:id',  todosController.patch);          
router.delete('/todos/completed', todosController.deleteCompleted);
router.delete('/todos/:id', todosController.deleteTask);
module.exports = router;