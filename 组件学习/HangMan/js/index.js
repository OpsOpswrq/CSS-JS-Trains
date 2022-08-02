const wordEL = document.getElementById('word')
const wrongLetterEl = document.getElementById('wrong-letters')
const playAgain = document.getElementById('play-button')
const popup = document.getElementById('popup-container')
const notification = document.getElementById('notification-container')
const finalMessage = document.getElementById('final-message')
const finaleMessageRevealedWord = document.getElementById('final-message-reveal-word')
const figureParts = document.querySelectorAll('.figure-part')  // 通过选择器选择全部的元素
const words = ['feng','ACM']
let selectedWord = words[Math.floor(Math.random()*words.length)]  // 随机选择单词
let playable = true  // 是否可玩
let correctLetters = []
let wrongLetters = []
function displayWord(){
    wordEL.innerHTML = `${selectedWord.split('').map(
        letter=>{
            return `<span class="letter">${correctLetters.includes(letter.toLowerCase())?letter:''}</span>` // 进行单词之间的比较
        }
    ).join('')}`
    const innerWord = wordEL.innerText.replace(/[\n]/g,'') //正则表达式后的"g"是一个表示全局搜索选项或标记，将在整个字符串查找并返回所有匹配结果。
    if(innerWord===selectedWord){
        finalMessage.innerText = 'Congratulations! You won! 😃';
        finaleMessageRevealedWord.innerText = '';
        popup.style.display = 'flex';
        playable = false; //设置重新开始
    }
}
function updateWrongLetterEl(){
    wrongLetterEl.innerHTML = `
        ${wrongLetters.length>0 ? '<p>Wrong</p>':''}
        ${wrongLetters.map(letter=>{return `<span>${letter}</span>`})}
    `
    figureParts.forEach((part,index)=>{
        const errors = wrongLetters.length
        if(index < errors){ // 显示人的部件
            part.style.display='block'
        }else{
            part.style.display = 'none'
        }
    })
    if(wrongLetters.length >= figureParts.length){  //如果出现错误的次数超过人部件的数量的话，停止游戏
        finalMessage.innerText = 'Unfortunately you lost. 😕';
        finaleMessageRevealedWord.innerText = `...the word was: ${selectedWord}`;
        popup.style.display = 'flex';
        playable = false;
    }
}
function showNotification(){
    notification.classList.add('show')
    setTimeout(()=>{
        notification.classList.remove('show')
    },2000)  // 设置两秒时间
}
window.addEventListener('keydown',e=>{ // 全局按键事件
    // console.log(e.key)
    if(playable){ // 正在玩游戏
        if((e.keyCode>=65 && e.keyCode <= 90)||(e.keyCode>=97 && e.keyCode <= 122)){  // 按键的ASCII  大写的A-Z的ascii码
            // console.log(e.key)
            selectedWord_copy = selectedWord.toLowerCase()  // 拯救大小写问题
            const letter = e.key.toLowerCase()  // 按键的字母
            if(selectedWord_copy.includes(letter)){
                if(!correctLetters.includes(letter)){ // 如果正确的单词集中没有这个字母的话，直接加入到单词集中
                    correctLetters.push(letter)
                    displayWord()
                }else{
                    showNotification()
                }
            }else{
                if(!wrongLetters.includes(letter)){
                    wrongLetters.push(letter)
                    updateWrongLetterEl()
                }else{
                    showNotification()  // 展示警告
                }
            }
        }
    }
})
playAgain.addEventListener('click',e=>{
    playable = true
    correctLetters = []
    wrongLetters = []
    selectedWord = words[Math.floor(Math.random()*words.length)]
    displayWord()
    updateWrongLetterEl()
    popup.style.display = 'none'
})
displayWord()