document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    app.innerHTML = renderRegistrationPage();

    document.getElementById('register').addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        try {
            const response = await registerUser(name, email);

            if (response.success) {
                app.innerHTML = renderDashboard();
                handleExpenseForm();
                loadExpenseHistory();
            } else {
                alert(response.message || "Registration failed! Please try again.");
            }
        } catch (error) {
            alert("An error occurred during registration. Please check the console for details.");
            console.error("Error during registration:", error);
        }
    });
});

function renderRegistrationPage() {
    return `
        <h1>Register</h1>
        <input id="name" type="text" placeholder="Enter your name" />
        <input id="email" type="email" placeholder="Enter your email" />
        <button id="register">Register</button>
    `;
}

function renderDashboard() {
    return `
        <h1>Expense Tracker Dashboard</h1>
        <div class="flex">
            <div class="flex-1">
                <h2>Add Expense</h2>
                <input id="expense-name" type="text" placeholder="Expense Name" />
                <input id="expense-descr" type="text" placeholder="Description" />
                <select id="expense-category">
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Salary">Salary</option>
                </select>
                <input id="expense-amount" type="number" placeholder="Amount $" />
                <select id="expense-type">
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                </select>
                <button id="add-expense">Submit</button>
            </div>
            <div class="flex-2">
                <h2>Expense History</h2>
                <div id="expenses-list"></div>
                <p id="total">Total: $0</p>
            </div>
        </div>
        <div class="modal-overlay" id="modal-overlay"></div>
        <div class="modal" id="expense-modal">
            <span class="modal-close" id="modal-close">&times;</span>
            <div id="modal-content"></div>
        </div>
    `;
}

function handleExpenseForm() {
    document.getElementById('add-expense').addEventListener('click', () => {
        const name = document.getElementById('expense-name').value;
        const description = document.getElementById('expense-descr').value;
        const category = document.getElementById('expense-category').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const type = document.getElementById('expense-type').value;

        addExpense(name, description, category, amount, type).then(() => {
            loadExpenseHistory();
        });
    });
}

function loadExpenseHistory() {
    fetchExpenses().then(expenses => {
        const expenseHistory = document.getElementById('expenses-list');
        expenseHistory.innerHTML = '';
        let total = 0;

        expenses.forEach(expense => {
            const amount = parseFloat(expense.amount);
            total += (expense.type === 'Credit' ? amount : -amount);

            const amountColorClass = expense.type === 'Credit' ? 'text-green-500' : 'text-red-500';
            const sign = expense.type === 'Credit' ? '+' : '-';

            const expenseItem = document.createElement('div');
            expenseItem.className = 'flex justify-between items-center mb-2';

            expenseItem.innerHTML = `
                <p>${expense.name} - <span class="${amountColorClass}">${sign}$${amount}</span> (${expense.type})</p>
                <button class="delete-expense small-button">Delete</button>
            `;

            expenseHistory.appendChild(expenseItem);

            // Add delete functionality
            expenseItem.querySelector('.delete-expense').addEventListener('click', (event) => {
                event.stopPropagation();
                deleteExpense(expense._id).then(() => {
                    loadExpenseHistory();
                }).catch(error => {
                    console.error("Error deleting expense:", error);
                });
            });

            // Add click functionality to show full expense details
            expenseItem.addEventListener('click', () => {
                showExpenseDetails(expense);
            });
        });

        document.getElementById('total').textContent = `Total: $${total}`;
    });
}

function showExpenseDetails(expense) {
    const modal = document.getElementById('expense-modal');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <div class="modal-header">${expense.name}</div>
        <p><strong>Description:</strong> ${expense.description}</p>
        <p><strong>Category:</strong> ${expense.category}</p>
        <p><strong>Amount:</strong> ${expense.type === 'Credit' ? '+' : '-'}$${expense.amount}</p>
        <p><strong>Type:</strong> ${expense.type}</p>
        <p><strong>Date:</strong> ${new Date(expense.createdAt).toLocaleString()}</p>
    `;

    modal.style.display = 'block';
    overlay.style.display = 'block';

    document.getElementById('modal-close').addEventListener('click', closeExpenseDetails);
    overlay.addEventListener('click', closeExpenseDetails);
}

function closeExpenseDetails() {
    document.getElementById('expense-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
}
