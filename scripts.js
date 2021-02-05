const Modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close() {
        document.querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) ||
        []
    },

    set(transactions) {
        localStorage.setItem("dev.finance:transactions", JSON.stringify
        (transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        //pegar todas as transações 
        transactions.all.forEach(transaction => {
            //se ela transação é maior que zero
            if (transaction.amount > 0) {
                //somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }
        })
        return income
    },

    expenses() {
        let expense = 0;
        //pegar todas as transações 
        transactions.all.forEach(transaction => {
            //se ela transação é menor que zero
            if (transaction.amount < 0) {
                //somar a uma variavel e retornar a variavel
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {
        return Transaction.all.income() + Transaction.expenses();
    }
}


const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appenChild(tr)

    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" :
            "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src"./assents/minus.svg" alt="Remover transação">
        </td>
        `
        return html
    },

    updateBalance() {
        document
            .getElementeById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementeById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementeById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        //value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        valeu = String(value).replace(/\D/g, "")

        valeu = Number(valeu) / 100

        valeu = valeu.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })

        return signal + valeu
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatData(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.valeu = ""
        Form.date.valeu = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.formatValues()
            const transaction = Form.formatValues()
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        transactions.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

