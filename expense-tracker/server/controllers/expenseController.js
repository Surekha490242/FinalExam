const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
    try {
        const { name, description, category, amount, type } = req.body;
        const expense = new Expense({ name, description, category, amount, type });
        await expense.save();
        res.status(201).json({ success: true, expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({});
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        res.status(200).json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
