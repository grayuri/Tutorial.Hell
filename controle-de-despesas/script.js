const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null 
  ? localStorageTransactions
  : []
//

const removeTransaction = id => {
  transactions = transactions.filter(transaction => transaction.id !== id)
  init()
  updateLocalStorage()
}

const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+'
  const cssClass = transaction.amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(transaction.amount)
  const li = document.createElement('li')
  
  li.classList.add(cssClass)
  li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
      x
    </button>
  `
  transactionsUl.append(li)
}

const getTotalOfAmounts = transactionsAmounts => {
  return transactionsAmounts.reduce((accum, transaction) => accum + transaction, 0).toFixed(2)
}

const getIncome = transactionsAmounts => {
  return transactionsAmounts
    .filter(value => value > 0)
    .reduce((accum, value) => accum + value, 0)
    .toFixed(2)
}

const getExpenses = transactionsAmounts => {
  return Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accum, value) => accum + value, 0))
    .toFixed(2)
}

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(transaction => transaction.amount)
  const total = getTotalOfAmounts(transactionsAmounts)
  const income = getIncome(transactionsAmounts)
  const expense = getExpenses(transactionsAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateId = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateId(), 
    name: transactionName, 
    amount: Number(transactionAmount)
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handleFormSubmit = (e) => {
  e.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()

  if (transactionName === '' || transactionAmount === '') {
    alert('Por favor, preencha tanto o nome quanto o valor.')
    return
  }

  addToTransactionsArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()
  cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)