const container = document.getElementById('container');
const text = document.getElementById('text');
const totalTime = 7500;
const breatheTime = (totalTime / 5) * 2;  // 3
const holdTime = totalTime / 5;  // 1.5
breathAnimation();
function breathAnimation() {
    text.innerText = 'Breathe In!';
    container.className = 'container grow';
    setTimeout(() => {
        text.innerText = 'Hold';
        setTimeout(() => {
            text.innerText = 'Breathe Out!';
            container.className = 'container shrink';
        }, holdTime);  // 注意时间的细节
    }, breatheTime);
}
setInterval(breathAnimation, totalTime);