const msgEl = document.getElementById('msg');
const randomNum = getRandomNumber();
console.log('Number:', randomNum);
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;   // 调用语言功能
let recognition = new window.SpeechRecognition();
// Start recognition and game
recognition.start();
// Capture user speak
function onSpeak(e) {
    console.log(e.results)
    const msg = e.results[0][0].transcript;
    writeMessage(msg);
    checkNumber(msg);
}
// Write what user speaks
function writeMessage(msg) {
    msgEl.innerHTML = `
    <p>You said: </p>
    <span class="box">${msg}</span>
  `;
}
// Check msg against number
function checkNumber(msg) {
    const num = +msg;   // 字符串转数字
    // console.log(num)
    // Check if valid number
    if (Number.isNaN(num)) {
        msgEl.innerHTML += '<div>That is not a valid number</div>';
        return;
    }
    // Check in range
    if (num > 100 || num < 1) {
        msgEl.innerHTML += '<div>Number must be between 1 and 100</div>';
        return;
    }
    // Check number
    if (num === randomNum) {// 整体覆盖
        document.body.innerHTML = `   
      <h2>Congrats! You have guessed the number! <br><br>
      It was ${num}</h2>
      <button class="play-again" id="play-again">Play Again</button>
    `;
    } else if (num > randomNum) {
        msgEl.innerHTML += '<p>GO LOWER</p>';
    } else {
        msgEl.innerHTML += '<p>GO HIGHER</p>';
    }
}
// Generate random number
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}
// Speak result
recognition.addEventListener('result', onSpeak);
// End SR service
recognition.addEventListener('end', () => recognition.start());
document.body.addEventListener('click', e => {
    if (e.target.id == 'play-again') {
        window.location.reload();
    }
});
