const draggable_list = document.getElementById('draggable-list');
const check = document.getElementById('check');
const richestPeople = [    // 这里排名已经确定了
    'Jeff Bezos',
    'Bill Gates',
    'Warren Buffett',
    'Bernard Arnault',
    'Carlos Slim Helu',
    'Amancio Ortega',
    'Larry Ellison',
    'Mark Zuckerberg',
    'Michael Bloomberg',
    'Larry Page'
];
const listItems = []
let dragStartIndex;
function createList(){
    [...richestPeople]
        .map(a=>({value:a,sort:Math.random()}))   // 对象形式
        .sort((a,b)=>a.sort-b.sort)   // 排序
        .map(a=>a.value)
        .forEach((people,index)=>{
            const listItem = document.createElement('li')
            listItem.setAttribute('data-index',index)
            listItem.innerHTML = `
                <span class="number">${index + 1}</span>
                <div class="draggable" draggable="true">
                    <p class="person-name">${people}</p>
                    <i class="fas fa-grip-lines"></i>
                </div>
                `;
            listItems.push(listItem)
            draggable_list.appendChild(listItem)
        })
    addEventListeners()
}
createList()
function dragStart(){
    // 这里的this指的是当前移动的html元素
    // console.log('start',this)
    dragStartIndex = +this.closest('li').getAttribute('data-index')
}
function dragEnter(){
    // console.log('over',this)
    this.classList.add('over')
}
function dragLeave(){
    this.classList.remove('over')
}
function dragOver(e){
    // console.log(e)
    e.preventDefault()
}
function dragDrop(){
    const dragEndIndex = +this.getAttribute('data-index');
    swapItems(dragStartIndex, dragEndIndex);
    this.classList.remove('over');
}
function swapItems(fromIndex,toIndex){
    const itemOne = listItems[fromIndex].querySelector('.draggable')
    const itemTwo = listItems[toIndex].querySelector('.draggable')
    console.log(itemTwo,'two',itemOne,'one')
    console.log(listItems[toIndex])
    listItems[fromIndex].appendChild(itemTwo)
    listItems[toIndex].appendChild(itemOne)
    console.log(listItems[toIndex])
}
function checkOrder(){
    listItems.forEach((listItem,index)=>{
        const personName = listItem.querySelector('.draggable').innerText.trim()
        if(personName!==richestPeople[index]){
            listItem.classList.add('wrong')
        }else{
            listItem.classList.remove('wrong')
            listItem.classList.add('right')
        }
    })
}
// draggable的用法
function addEventListeners(){
    const draggables = document.querySelectorAll('.draggable')
    const dragListItems = document.querySelectorAll('.draggable-list li')
    draggables.forEach(draggable=>{
        draggable.addEventListener('dragstart',dragStart)
    })
    dragListItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    });
}
check.addEventListener('click',checkOrder)