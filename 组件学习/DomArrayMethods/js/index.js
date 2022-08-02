window.onload = ()=>{
    const main = document.getElementById('main')
    const addUserBtn = document.getElementById('add-user')
    const doubleBtn = document.getElementById('double')
    const sortBtn = document.getElementById('sort')
    const showMillionairesBtn = document.getElementById('show-millionaires')
    const calculateWealthBtn = document.getElementById('calculate-wealth')
    let data = []
    let isCalculated = false
    async function getRandomUser() {
        const res = await fetch('https://randomuser.me/api');
        const data = await res.json();
        const user = data.results[0];
        const newUser = {
            name: `${user.name.first} ${user.name.last}`,
            money: Math.floor(Math.random() * 1000000)
        };
        addData(newUser);
    }
    function doubleMoney(){
        data = data.map(user=>{
            return {...user,money: user.money*2} // 对象的解体，之后更新值
        })
        updateDom()
    }
    function sortRichest(){
        data.sort((a, b) => b.money - a.money);
        updateDom()
    }
    function showMillionaires(){
        data = data.filter(user => user.money > 1000000); // 数组的方法
        updateDom()
    }
    // Calculate the total wealth
    function calculateWealth() {
        const wealth = data.reduce((acc, user) => (acc += user.money), 0); /*callback initial*/
        const wealthEl = document.createElement('div');
        wealthEl.innerHTML = `<h3 id="h_inner">Total Wealth: <strong>${formatMoney(wealth)}</strong></h3>`;
        if(!isCalculated){
            main.appendChild(wealthEl)
            isCalculated = true
        }else{
            const h3 = document.getElementById("h_inner")
            h3.innerHTML = `Total Wealth: <strong>${formatMoney(wealth)}</strong>`
        }
    }
    function addData(obj){
        data.push(obj)
        updateDom()
    }
    function updateDom(){
        previousData = data
        main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>'
        previousData.forEach(item=>{ // 直接更新全部的节点信息
            const element = document.createElement('div');
            element.classList.add('person');
            element.innerHTML = `<strong>${item.name}</strong> ${formatMoney(item.money)}`;
            main.appendChild(element);
        })
        if(isCalculated){
            isCalculated = false
            calculateWealth()
        }
    }
    function formatMoney(number) {
        return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    getRandomUser()
    addUserBtn.addEventListener('click', getRandomUser);
    doubleBtn.addEventListener('click', doubleMoney);
    sortBtn.addEventListener('click', sortRichest);
    showMillionairesBtn.addEventListener('click', showMillionaires);
    calculateWealthBtn.addEventListener('click', calculateWealth);
}