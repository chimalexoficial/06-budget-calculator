// Vars
const form = document.querySelector('#add-expense');

const expenseList = document.querySelector('#expenses ul');

// Events
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);
    form.addEventListener('submit', addExpense);
}


// Classes
class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    newExpense(newExpense) {
        this.expenses = [...this.expenses, newExpense];
        this.calculateRemaining();
    };

    calculateRemaining() {
        const spent = this.expenses.reduce((total, expense) => total + expense.quantity, 0);
        this.remaining = this.budget - spent;
        console.log(this.remaining);
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
        console.log(this.expenses);
    }
}

class UI {
    insertBudget(quantity) {
        // Values
        const {budget, remaining} = quantity;

        // Adding HTML
        document.querySelector('#total').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;
    }

    showAlert(message, type) {
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');

        if(type === 'error') {
            divMessage.classList.add('alert-danger');
        } else {
            divMessage.classList.add('alert-success');
        }

        divMessage.textContent = message;

        document.querySelector('.primary').insertBefore(divMessage, form);

        setTimeout(() => {
            divMessage.remove();
        }, 2500)
    }

    showExpenses(expenses) {
        this.cleanHTML();

        expenses.forEach(expense => {
            const {quantity, name, id} = expense;

            // creating li element
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id;

            console.log(li);
            // adding html expense
            li.innerHTML = `
            ${name} <span class="badge badge-primary badge-pill"> $${quantity}</span>
            `;

            // delete expense
            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Delete X';
            btnDelete.classList.add('btn', 'btn-danger', 'delete-expense');
            btnDelete.onclick = () => {
                deleteExpense(id);
            }

            li.appendChild(btnDelete);

            expenseList.appendChild(li);
        });
    };

    cleanHTML() {
        while(expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
    }

    updateRemaining(remaining) {
        document.querySelector('#remaining').textContent = remaining;
    }

}

const ui = new UI();

let budget;


// Functions
function askBudget() {
    const budgetUser = prompt('Enter your budget');
   

    if(budgetUser === '' || budgetUser === null || isNaN(budgetUser) || budgetUser <= 0) {
        // Ask again || use while()
        window.location.reload();
    }
    budget = new Budget(budgetUser);
    console.log(budget);
    console.log(budgetUser);

    ui.insertBudget(budget);
}

function addExpense(e) {
    e.preventDefault();
    
    const name = document.querySelector('#expense').value;
    const quantity = Number(document.querySelector('#quantity').value);

    if(name === '' || quantity === '') {
        ui.showAlert('Please check the fields', 'error');
    } else if(quantity <= 0 || isNaN(quantity)) {
        ui.showAlert('Invalid quantity, please check the field', 'error');
        return;
    }

    console.log('Adding expense');
    const expenseUser = { name, quantity, id: Date.now() }

    budget.newExpense(expenseUser);
    ui.showAlert('Expense added!', 'success');

    // Print expenses
    const {expenses, remaining} = budget; // destructuring expenses array
    console.log(budget);
    ui.showExpenses(expenses);
    ui.updateRemaining(remaining);

    form.reset();
}

function deleteExpense(id) {
    console.log(id);
    budget.deleteExpense(id);
    const {expenses, remaining} = budget;
    ui.showExpenses(expenses);
    ui.updateRemaining(remaining);

}
