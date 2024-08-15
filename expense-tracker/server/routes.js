const express = require('express');
const router = express.Router();
const expenseController = require('./controllers/expenseController');
const userController = require('./controllers/userController');

// Expense Routes
router.post('/expense', expenseController.addExpense);
router.get('/expenses', expenseController.getExpenses);
router.delete('/expense/:id', expenseController.deleteExpense); // New route for deleting an expense

// User Routes
router.post('/register', userController.registerUser);

module.exports = router;
