const API_URL = 'http://localhost:3000';

// Register User
async function registerUser(name, email) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

// Add Expense
async function addExpense(name, description, category, amount, type) {
    const response = await fetch(`${API_URL}/expense`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, category, amount, type })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

// Fetch Expenses
async function fetchExpenses() {
    const response = await fetch(`${API_URL}/expenses`);
    return response.json();
}

// Delete Expense
async function deleteExpense(id) {
    const response = await fetch(`${API_URL}/expense/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}
