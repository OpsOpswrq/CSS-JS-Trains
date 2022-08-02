const balance = $("#balance")[0]
const money_plus = $('#money-plus')[0]
const money_minus = $('#money-minus')[0]
const list = $('#list')[0]
// const form = document.getElementById('form')
const submit_btn = $('#submit_btn')
const text = $('#text')[0]
const amount = $('#amount')[0]
const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
)
let transactions = localStorage.getItem('transactions') != null ? localStorageTransactions : [] /*防止为空，爆出错误*/
function addTransaction() {
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a transaction')
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: parseFloat(amount.value) // 直接转为数字形式的
        }
        transactions.push(transaction)
        updateLocalStorage()
        updateValues()
        addTransactionDOM(transaction)
        text.value = ''
        amount.value = '' // 重置信息
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000)
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id)
    updateLocalStorage()
    init()
}

function addTransactionDOM(transaction) {
    const sign = transaction < 0 ? '-' : '+'
    const item = document.createElement('li')
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus')
    item.innerHTML = `${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`
    list.appendChild(item)
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

function init() {
    list.innerHTML = "" // 这一点就不是很好，每次都要进行更新DOM元素，有点耗内存
    transactions.forEach((transaction) => {
        addTransactionDOM(transaction)
    })
    updateValues()
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount)  /*遍历每个元素将amount的元素返回到，成为一个新的数组*/
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2) /*指定两位小数*/
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2)
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2)
    balance.innerHTML = `$${total}`
    money_minus.innerHTML = `$${expense}`
    money_plus.innerHTML = `$${income}`
}
init()
submit_btn.click(() => {
    addTransaction()
})