# CSS+JS练习

[各种组件的使用](https://www.w3schools.com/howto/howto_css_icon_bar.asp)

## 1.BreakOut

整个的布局

![image-20220714221359360](https://img2022.cnblogs.com/blog/2849002/202208/2849002-20220802170522210-10034438.png)

HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="./css/index.css">
    <title>BreakOut!</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>    <!--cdn加速-->
<!--    <script type="text/javascript" src="./js/jQuery.js"></script>-->   <!--开发的时候，使用自己本机的jQuery-->
    <script type="text/javascript" src="./js/index.js"></script>
</head>
<body>
    <h1>BreakOut!</h1>
    <button id="rules-btn" class="btn rules-btn">Show rules</button>
    <div id="rules" class="rules">
        <h2>How To Play:</h2>
        <p>
            Use your right and left keys to move the paddle to bounce the ball up
            and break the blocks.
        </p>
        <p>If you miss your ball,your score and the blocks will reset.</p>
        <button id="close-btn" class="btn">Close</button>
    </div>
    <canvas id="canvas" width="800px" height="600px"></canvas>
</body>
</html>
```

JS(jQuery编写)

```js
$(document).ready(function(){
    const open = $("#rules-btn")
    const rules = $("#rules")
    const close = $("#close-btn")
    const canvas = $("#canvas")[0]
    const ctx = canvas.getContext('2d')  // 建立一个二维画面进行渲染
    let score = 0
    const briskRowCount = 9
    const briskColumnCount = 5
    const delay = 500  // 重置游戏的时间
    const ball = { // 建立对象
        x:parseInt(canvas.getAttribute('width'))/2, // 原生为str，要转为int
        y:parseInt(canvas.getAttribute('height'))/2, // 定位
        size:10,
        speed:4,
        dx:4, // 距离的变化，位移的变化
        dy:-4,
        visible:true
    }
    const paddle = { // 建立对象
        x:parseInt(canvas.getAttribute('width'))/2-40,
        y:parseInt(canvas.getAttribute('height'))-40,
        w:80,
        h:10,
        speed: 8,
        dx:0,
        visible: true
    }
    const briskInfo = {
        w:70,
        h:20,
        padding:10, // 内边框
        offsetX:45,
        offsetY:60,
        visible:true
    }
    const brisks = []
    for(let i = 0;i<briskRowCount;i++){
        brisks[i] = []
        for(let j = 0;j<briskColumnCount;j++){
            const x = i*(briskInfo.w+briskInfo.padding)+briskInfo.offsetX
            const y = j*(briskInfo.h+briskInfo.padding)+briskInfo.offsetY
            brisks[i][j] = {x,y,...briskInfo} // 对象解构
        }
    }
    function drawBall(){
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle(){
        ctx.beginPath()
        ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
        ctx.fillStyle = paddle.visible ? '#0095dd': 'transparent'
        ctx.fill()
        ctx.closePath()
    }
    function drawScore(){
        ctx.font = '20px Arial'
        ctx.fillText(`Score:${score}`,parseInt(canvas.getAttribute('width'))-100,30)
    }
    function drawBricks(){
        brisks.forEach(column=>{
            column.forEach(brick=>{
                ctx.beginPath()
                ctx.rect(brick.x, brick.y, brick.w, brick.h)
                ctx.fillStyle = brick.visible ? '#0095dd':'transparent'
                ctx.fill()
                ctx.closePath()
            })
        })
    }
    function movePaddle(){
        paddle.x += paddle.dx
        if(paddle.x+paddle.w>parseInt(canvas.getAttribute('width'))){
            paddle.x = parseInt(canvas.getAttribute('width')) - paddle.w
        }
        if(paddle.x<0){
            paddle.x = 0
        }
    }
    function moveBall(){
        ball.x += ball.dx
        ball.y += ball.dy
        if(ball.x+ball.size>parseInt(canvas.getAttribute('width'))||ball.x-ball.size<0){
            ball.dx *= -1 // 碰壁了，直接转向
        }
        if(ball.y+ball.size>parseInt(canvas.getAttribute('height'))||ball.y-ball.size<0){
            ball.dy *= -1
        }
        if(ball.x-ball.size>paddle.x&&ball.x+ball.size<paddle.x+paddle.w&&ball.y+ball.size>paddle.y){ // 碰撞检测
            ball.dy = -ball.speed
        }
        brisks.forEach(column=>{
            column.forEach(brisk=>{
                if(brisk.visible){
                    if(ball.x-ball.size>brisk.x&&ball.x+ball.size<brisk.x+brisk.w&&ball.y+ball.size>brisk.y&&ball.y-ball.size<brisk.y+brisk.h){
                        ball.dy *= -1
                        brisk.visible = false
                        increaseScore()
                    }
                }
            })
        })
        if(ball.y+ball.size>parseInt(canvas.getAttribute("height"))){
            showAllBrisks()
            score = 0
        }
    }
    function showAllBrisks(){
        brisks.forEach(column=>{
            column.forEach(brisk=>{
                brisk.visible = true
            })
        })
    }
    function increaseScore(){
        score+=1
        if(score%(briskColumnCount*briskRowCount)===0){
            ball.visible = false
            paddle.visible = false
            setTimeout(()=>{
                showAllBrisks()
                score = 0
                paddle.x = parseInt(canvas.getAttribute('width'))/2-40
                paddle.y = parseInt(canvas.getAttribute('height'))-40
                ball.x = parseInt(canvas.getAttribute('width'))/2
                ball.y = parseInt(canvas.getAttribute('height'))/2
                ball.visible = true
                paddle.visible = true
            },delay)
        }
    }
    function draw(){
        ctx.clearRect(0,0,parseInt(canvas.getAttribute('width')),parseInt(canvas.getAttribute('height')))
        drawBricks()
        drawBall()
        drawPaddle()
        drawScore()
    }
    function update(){
        moveBall()
        movePaddle()
        draw()
        requestAnimationFrame(update)
    }
    update()
    $(document).keydown((e)=>{
        if(e.key==='ArrowRight'){
            paddle.dx = paddle.speed
        }
        if (e.key==='ArrowLeft'){
            paddle.dx = -paddle.speed
        }
    })
    $(document).keyup((e)=>{
        if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
            paddle.dx = 0
        }
    })
    open.click(()=>{
        rules.addClass('show')
    })
    close.click(()=>{
        rules.removeClass('show')
    })
})
```

CSS

```css
* {
    box-sizing: border-box;
}
/*全局的样式设置*/
body{
    background-color: skyblue;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
    min-height: 100vh; /*视口定高度*/
    margin:0px;  /*外边框为0*/
}
h1{
    font-size:45px;
    color: white;
}
canvas{
    background-color: #f0f0f0;
    display: block;  /*块状元素*/
    border-radius: 5px; /*设置圆角*/ 
}
.btn{
    cursor: pointer;  /*设置该区域下的鼠标的样式为pointer*/
    border:0px;  /*让边框的宽度为0*/
    padding:10px 20px;  /*左右 上下*/
    background-color: black;
    color: white;
    border-radius: 5px;
}
.btn:hover{
    background-color: #222;
}
.btn:active{
    transform: scale(0.95); /*激活的时候会将整个组件变小*/
}
.rules-btn{
    position: absolute;
    top:5%;
    left:5%;
}
.rules{
    position: absolute;
    top:0px;
    left:0px;
    background-color: #333; /*设置背景的颜色*/
    color: white; /*设置字体的颜色*/
    min-height: 100vh;
    width:400px;
    padding: 20px;
    line-height: 1.5rem;
    transform: translateX(-400px);  /*先让他先消失，不会使页面元素变化*/
    transition-duration: 1s;
    transition-timing-function: ease-in-out;  /*先快后慢*/
    transition-property: transform; /*控制属性transform*/
}
.show{ /*通过动态添加class属性实现效果*/
    transform: translateX(0px); /*进行平移操作*/
}
```

## 2.发送弹幕

注意这里没有去除掉之前的弹幕信息

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>弹幕功能</title>
</head>
<body>
<div id="box" class="box"></div>
<input type="text" id="txt" />
<button onclick="send()">发送弹幕</button>
</body>
<script>
    function $(str) {
        return document.getElementById(str);
    }
    function send() {
        var word = $('txt').value;
        var span = document.createElement('span');
        var top = parseInt(Math.random() * 500) - 20;
        var color1 = parseInt(Math.random() * 256); // 随机实现
        var color2 = parseInt(Math.random() * 256);
        var color3 = parseInt(Math.random() * 256);
        var color = "rgb(" + color1 + "," + color2 + "," + color3 + ")";
        top = top < 0 ? 0 : top;
        span.style.position = 'absolute';
        span.style.top = top + "px";
        span.style.color = color;
        span.style.left = '500px';
        span.style.whiteSpace = 'nowrap';
        var nub = (Math.random() * 10) + 1;
        span.setAttribute('speed', nub);
        span.speed = nub;
        span.innerHTML = word;
        $('box').appendChild(span); // 最重要的一句话
        $('txt').value = "";
    }
    setInterval(move, 200);
    function move() {
        var spanArray = $('box').children;
        for (var i = 0; i < spanArray.length; i++) {
            console.log(spanArray[i].style.left)
            spanArray[i].style.left = parseInt(spanArray[i].style.left) - spanArray[i].speed + 'px';
            if(parseInt(spanArray[i].style.left)<0){ // 循环弹幕效果
                spanArray[i].style.left = '500px'
            }
        }
    }
</script>
```

## 3.Custom Video Player

html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VideoPlayer</title>
    <script type="text/javascript" src="../BreakOut!/js/jQuery.js"></script>
    <script type="text/javascript" src="./js/index.js"></script>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/progress.css">
</head>
<body>
    <h1>Custom video player</h1>
    <video
        src="./video/test.mp4"
        id="video"
        class="screen"
        poster="./img/poster.png"
    ></video> <!--poster 属性描述了在视频加载时或在用户点击播放按钮前显示的图片-->
    <div class="controls">
        <button class="btn" id="play">
            <img src="./img/start.png" class="start">
        </button>
        <button class="btn" id="stop">
            <img src="img/clear.png" class="stop">
        </button>
        <input
            type="range"
            id="progress"
            class="progress"
            min="0"
            max="100"
            step="0.1"
            value="0"
        >
        <span class="timestamp" id="timestamp">00:00</span>
    </div>
</body>
</html>
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    font-family: Arial, Helvetica, sans-serif;
    background-color: #666;
    display: flex;
    flex-direction: column;  /*竖着摆放*/
    align-items: center;  /*在弹性容器中放置在中间*/
    justify-content: center; /*在column中放置中间*/
    max-height: 100vh; /*定义窗口的大小*/
    margin: 0;
}
h1{
    color: skyblue;
}
.screen{
    cursor: pointer;
    width: 60%;
    background-color: black !important;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
}
.controls{
    background:#333;
    color: white;
    width: 60%;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px; /*内边距*/
}
.controls .start{
    width: 50px;
    height: 50px;
}
.controls .btn{
    border: 0px;
    background: transparent;
    cursor: pointer;
}
.controls .stop{
    width: 50px;
    height: 50px;
}
.controls .clear{
    width: 50px;
    height: 50px;
}
.controls .timestamp{
    color: white;
    font-weight: bold;
    margin-left: 10px;  /*左边的距离*/
}
.btn:focus{
    outline: None;  /*在点击的时候，边框消失*/
}
```

progress.css

这个直接在官网下载，开抄

```css
/* SOURCE: https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ */

input[type='range'] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
}

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
}

input[type='range']:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type='range']::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
}

/* Special styling for WebKit/Blink */
input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
}

/* All the same stuff for Firefox */
input[type='range']::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
}

/* All the same stuff for IE */
input[type='range']::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
}

input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
}

input[type='range']:focus::-webkit-slider-runnable-track {
    background: #367ebd;
}

input[type='range']::-moz-range-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
}

input[type='range']::-ms-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
}
input[type='range']::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range']:focus::-ms-fill-lower {
    background: #3071a9;
}
input[type='range']::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type='range']:focus::-ms-fill-upper {
    background: #367ebd;
}
```

index.js

[video的属性和方法](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)

[jQuery绑定事件的方式](https://blog.csdn.net/Fancy_vae/article/details/109435678)

```js
$(document).ready(()=>{
    const video = $("#video")[0]
    const play = $("#play")
    const stop = $("#stop")
    const progress = $("#progress")[0]
    const timestamp = $("#timestamp")[0]
    function toggleVideoStatus(){
        if(video.paused){
            video.play()
        }else{
            video.pause()
        }
    }
    function updatePlayImg(){
        if(video.paused){
            play[0].innerHTML = '<img src="./img/start.png" class="start">'
        }else{
            play[0].innerHTML = '<img src="./img/stop.png" class="stop">'
        }
    }
    function updateProgress() {
        progress.value = (video.currentTime / video.duration) * 100  /*所占百分比*/
        let mins = Math.floor(video.currentTime / 60);
        if(mins<10){
            mins = '0'+mins
        }
        let secs = Math.floor(video.currentTime%60);
        if(secs<10){
            secs = '0'+secs
        }
        timestamp.innerHTML = `${mins}:${secs}`
    }
    function setVideoProgress(){
        video.currentTime = (progress.value*video.duration)/100 /*现在的时间占比*/
    }
    function stopVideo(){
        video.currentTime = 0
        video.pause()
    }
    video.addEventListener('click',toggleVideoStatus)  // 原生的dom操作
    video.addEventListener('pause',updatePlayImg)
    video.addEventListener('play',updatePlayImg)
    video.addEventListener('timeupdate',updateProgress)
    video.addEventListener('click', toggleVideoStatus);
    video.addEventListener('pause', updatePlayImg);
    video.addEventListener('play', updatePlayImg);
    video.addEventListener('timeupdate', updateProgress);
    play.on('click', toggleVideoStatus);
    stop.on('click', stopVideo); // jQuery操作，与dom的操作不同
    progress.addEventListener('change', setVideoProgress);
})
```

## 4.Dom Arrays  Method

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DomArrayMethods</title>
    <link rel="stylesheet" href="./css/index.css">
    <script src="./js/index.js"></script>
</head>
<body>
    <h1>Dom Array Methods</h1>  <!--这次是直接操作dom元素-->
    <div class="container">
        <aside><!--aside表示一个和其余页面内容几乎无关的部分-->
            <button id="add-user">Add User 👱‍♂️</button>
            <button id="double">Double Money 💰</button>
            <button id="show-millionaires">Show Only Millionaires 💵</button>
            <button id="sort">Sort by Richest ↓</button>
            <button id="calculate-wealth">Calculate entire Wealth 🧮</button>
        </aside>
        <main id="main">  <!--主体部分由与文档直接相关，或者扩展于文档的中心主题、应用的主要功能部分的内容组成。-->
            <h2><strong>Person</strong> Wealth</h2>
        </main>
    </div>
</body>
</html>
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-color: skyblue;
    font-family: Arial, Helvetica, sans-serif;
    display: flex; /*使用较多的框架*/
    flex-direction: column;  /*以列的形式摆放*/
    align-items: center;
    min-height: 100vh;
    margin: 0; /*外边界没有宽度*/
}
.container{
    display: flex;
    padding: 20px;
    margin: 0 auto; /*上下 左右*/
    max-width: 100%;
    width: 800px;
}
aside{
    padding: 10px 20px;
    width: 250px;
    border-right: 1px solid black; /*width,style,color*/
}
button{
    cursor: pointer;
    background-color: white;
    border: 1px solid black;
    border-radius: 5px;
    display: block;   /*声明为块元素*/
    width: 100%;
    padding: 10px;
    margin-bottom: 20px; /*外边框的底部为20px*/
    font-weight: bold; /*黑体的*/
    font-size: 14px;
}
main{
    flex: 1;
    padding: 10px 20px; /*内边框*/
}
h2{
    border-bottom: 1px solid black;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between; /*调整其中字的位置*/
    font-weight: 300;
    margin: 0 0 20px; /**/
}
h3{
    background-color: white;
    border-bottom: 1px solid black;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    font-weight: 300;
    margin: 20px 0 0;
}
.person{
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    margin-bottom: 10px;
}
```

index.js

````js
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
        data = data.filter(user => user.money > 1000000); // 数组的过滤方法
        updateDom()
    }
    // Calculate the total wealth
    function calculateWealth() {
        const wealth = data.reduce((acc, user) => (acc += user.money), 0); /*callback initial*/
        const wealthEl = document.createElement('div');
        wealthEl.innerHTML = `<h3 id="h_inner">Total Wealth: <strong>${formatMoney(wealth)}</strong></h3>`;
        if(!isCalculated){ // 这里逻辑进行了修改
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
        if(isCalculated){  // 这里的逻辑进行了改变
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
````

## 5.Exchange Rate Calculator

[input事件](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/input_event)

index.html

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Exchange Rate Calculator</title>
        <link rel="stylesheet" href="./css/index.css">
        <script src="./js/index.js"></script>
    </head>
    <body>
    <img src="./img/money.png" alt="" class="money-img" />
    <h1>Exchange Rate Calculator</h1>
    <p>Choose the currency and the amounts to get the exchange rate</p>

    <div class="container">
        <div class="currency">
            <select id="currency-one"> <!--通过id操作dom，直接获取值-->
                <option value="AED">AED</option>
                <option value="ARS">ARS</option>
                <option value="AUD">AUD</option>
                <option value="BGN">BGN</option>
                <option value="BRL">BRL</option>
                <option value="BSD">BSD</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="CLP">CLP</option>
                <option value="CNY">CNY</option>
                <option value="COP">COP</option>
                <option value="CZK">CZK</option>
                <option value="DKK">DKK</option>
                <option value="DOP">DOP</option>
                <option value="EGP">EGP</option>
                <option value="EUR">EUR</option>
                <option value="FJD">FJD</option>
                <option value="GBP">GBP</option>
                <option value="GTQ">GTQ</option>
                <option value="HKD">HKD</option>
                <option value="HRK">HRK</option>
                <option value="HUF">HUF</option>
                <option value="IDR">IDR</option>
                <option value="ILS">ILS</option>
                <option value="INR">INR</option>
                <option value="ISK">ISK</option>
                <option value="JPY">JPY</option>
                <option value="KRW">KRW</option>
                <option value="KZT">KZT</option>
                <option value="MXN">MXN</option>
                <option value="MYR">MYR</option>
                <option value="NOK">NOK</option>
                <option value="NZD">NZD</option>
                <option value="PAB">PAB</option>
                <option value="PEN">PEN</option>
                <option value="PHP">PHP</option>
                <option value="PKR">PKR</option>
                <option value="PLN">PLN</option>
                <option value="PYG">PYG</option>
                <option value="RON">RON</option>
                <option value="RUB">RUB</option>
                <option value="SAR">SAR</option>
                <option value="SEK">SEK</option>
                <option value="SGD">SGD</option>
                <option value="THB">THB</option>
                <option value="TRY">TRY</option>
                <option value="TWD">TWD</option>
                <option value="UAH">UAH</option>
                <option value="USD" selected>USD</option>
                <option value="UYU">UYU</option>
                <option value="VND">VND</option>
                <option value="ZAR">ZAR</option>
            </select>
            <input type="number" id="amount-one" placeholder="0" value="1" />
        </div>

        <div class="swap-rate-container">
            <button class="btn" id="swap">
                Swap
            </button>
            <div class="rate" id="rate"></div>
        </div>

        <div class="currency">
            <select id="currency-two">
                <option value="AED">AED</option>
                <option value="ARS">ARS</option>
                <option value="AUD">AUD</option>
                <option value="BGN">BGN</option>
                <option value="BRL">BRL</option>
                <option value="BSD">BSD</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="CLP">CLP</option>
                <option value="CNY">CNY</option>
                <option value="COP">COP</option>
                <option value="CZK">CZK</option>
                <option value="DKK">DKK</option>
                <option value="DOP">DOP</option>
                <option value="EGP">EGP</option>
                <option value="EUR" selected>EUR</option>
                <option value="FJD">FJD</option>
                <option value="GBP">GBP</option>
                <option value="GTQ">GTQ</option>
                <option value="HKD">HKD</option>
                <option value="HRK">HRK</option>
                <option value="HUF">HUF</option>
                <option value="IDR">IDR</option>
                <option value="ILS">ILS</option>
                <option value="INR">INR</option>
                <option value="ISK">ISK</option>
                <option value="JPY">JPY</option>
                <option value="KRW">KRW</option>
                <option value="KZT">KZT</option>
                <option value="MXN">MXN</option>
                <option value="MYR">MYR</option>
                <option value="NOK">NOK</option>
                <option value="NZD">NZD</option>
                <option value="PAB">PAB</option>
                <option value="PEN">PEN</option>
                <option value="PHP">PHP</option>
                <option value="PKR">PKR</option>
                <option value="PLN">PLN</option>
                <option value="PYG">PYG</option>
                <option value="RON">RON</option>
                <option value="RUB">RUB</option>
                <option value="SAR">SAR</option>
                <option value="SEK">SEK</option>
                <option value="SGD">SGD</option>
                <option value="THB">THB</option>
                <option value="TRY">TRY</option>
                <option value="TWD">TWD</option>
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="UYU">UYU</option>
                <option value="VND">VND</option>
                <option value="ZAR">ZAR</option>
            </select>
            <input type="number" id="amount-two" placeholder="0" /><!--input的类型为number，限制为数字类型-->
        </div>
    </div>
    </body>
</html>
```

index.js

```js
window.onload = ()=>{
    const currencyEl_one = document.getElementById('currency-one');
    const amountEl_one = document.getElementById('amount-one');
    const currencyEl_two = document.getElementById('currency-two');
    const amountEl_two = document.getElementById('amount-two');
    const rateEl = document.getElementById('rate');
    const swap = document.getElementById('swap');

    function calculate() {
        const currency_one = currencyEl_one.value;
        const currency_two = currencyEl_two.value;
        fetch("https://open.exchangerate-api.com/v6/latest")  // Fetch的使用，原生函数的使用
            .then(res => {return res.json()})
            .then(data => {
                 // console.log(data);
                const rate = data.rates[currency_two] / data.rates[currency_one];
                rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
                amountEl_two.value = (amountEl_one.value * (rate)).toFixed(2);
            });
    }


// Event Listener
    currencyEl_one.addEventListener('change', calculate); // input事件监控
    amountEl_one.addEventListener('input', calculate);
    currencyEl_two.addEventListener('change', calculate);
    amountEl_two.addEventListener('input', calculate);

    swap.addEventListener('click', () => {
        const temp = currencyEl_one.value;
        currencyEl_one.value = currencyEl_two.value;
        currencyEl_two.value = temp;
        calculate();
    });

    calculate();
}
```

index.css

````css
:root {  /*这个 CSS 伪类匹配文档树的根元素。*/
    --primary-color: #5fbaa7;  /*设置公共的颜色属性*/
}
*{
    box-sizing: border-box;
}
body{
    background-color: white;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    padding: 20px;
}
h1{
    color: var(--primary-color); /*动态改变颜色*/
}
p{
    text-align: center;
}
.btn{
    color: white;
    background-color: var(--primary-color);
    cursor: pointer;
    border-radius: 5px;
    font-size: 12px;
    padding: 5px 12px;
}
.money-img{
    width: 150px;
}
.currency{
    padding: 40px 0; /*上下 左右*/
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.currency select{
    padding: 10px 20px 10px 10px;
    -moz-appearance: none; /*用于控制基于操作系统主题的 UI 控件的本机外观。*/
    -webkit-appearance: none;
    appearance: none;
    border: 1px solid #dedede;
    font-size: 16px;
}
.currency input {
    border: 0;
    background: transparent;
    font-size: 30px;
    text-align: right;
}
.swap-rate-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.rate {
    color: var(--primary-color);
    font-size: 14px;
    padding: 0 10px;
}
select:focus, /*伪类选择器*/
input:focus,
button:focus {
    outline: 0;
}
@media (max-width: 600px) { /*媒体查询，最大宽度为600px*/
    .currency input {
        width: 200px;
    }
}
````

mony.img

![money](https://img2022.cnblogs.com/blog/2849002/202208/2849002-20220802170521881-1170623684.png)

## 6.Expense Tracker

**注意js文件的引入位置**

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Expense Tracker</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<h2>Expense Tracker</h2>
<div class="container">
    <h4>Your Balance</h4>
    <h1 id="balance">$0.00</h1>
    <div class="inc-exp-container">
        <div>
            <h4>Income</h4>
            <p id="money-plus" class="money plus">+$0.00</p>
        </div>
        <div>
            <h4>Expense</h4>
            <p id="money-minus" class="money minus">-$0.00</p>
        </div>
    </div>
    <h3>History</h3>
    <ul id="list" class="list">
        <!-- <li class="minus">
             Cash <span>-$400</span><button class="delete-btn">x</button>
           </li> -->
    </ul>
    <h3>Add New Transaction</h3>
    <div id="form">
        <div class="form-control">
            <label for="text">Text</label> <!--for对应于id-->
            <input type="text" id="text" placeholder="Enter text...">
        </div>
        <div class="form-control">
            <label for="amount">
                Amount<br/>
                (negative - expense, positive - income)
            </label>
            <input type="number" id="amount" placeholder="Enter amount...">
        </div>
        <button class="btn" id="submit_btn">Add Transaction</button>
    </div>
</div>
<script src="../BreakOut!/js/jQuery.js"></script>
<script src="./js/index.js"></script>  <!--以后还是这样引入js文件把-->
</body>
</html>
```

index.css

```css
:root{
    --box-shadow: 0 1px 3px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.24);
}
*{
    box-sizing: border-box;
}
body{
    background-color: white;
    display: flex;  /*将整个元素变成flex，在调整至中间位置*/
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;  /*视口高度*/
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
}
.container{
    margin: 30px auto;
    width: 350px;
}
h1{
    letter-spacing: 1px;  /*每个字符之间的宽度*/
    margin: 0;
}
h3{
    border-bottom: 1px solid black;  /*width style color*/
    padding-bottom: 10px;
    margin: 40px 0 10px; /*上 左右 下*/
}
h4{
    margin: 0;
    text-transform: uppercase;  /*指定字符的大小写*/
}
.inc-exp-container{
    background-color: white;
    box-shadow: var(--box-shadow);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
}
.inc-exp-container > div{  /*子类选择器*/
    flex: 1px;
    text-align: center;
}
.inc-exp-container > div:first-of-type{ /*子类选择器中选择第一个元素*/
    border-right: 1px solid white;
}
.money{
    font-size: 20px;
    letter-spacing: 1px;
    margin: 5px 0;
}
.money.plus{  /*组合选择器*/
    color: #2ecc71;
}
.money.minus{
    color: #c0392b;
}
label{
    display: inline-block;  /*综合了block和inline的特点*/
    margin: 10px 0;
}
input[type='text'],
input[type='number']{
    border: 1px solid black;
    border-radius: 2px; /*圆角的设置*/
    display: block;
    font-size: 16px;
    padding: 10px;
    width: 100%;
}
.btn{
    cursor: pointer;
    background-color: #9c88ff;
    box-shadow: var(--box-shadow);
    color: white;
    border: 0;
    font-size: 16px;
    margin: 10px 0 30px;
    padding: 10px;
    width: 100%;
}
.btn:focus,
.delete-btn:focus{
    outline: 0;
}
.list{
    list-style-type: none;  /*消除掉之前li的样式*/
    padding: 0;
    margin-bottom: 40px;
}
.list li{
    background-color: white;
    box-shadow: var(--box-shadow);
    color: #333;
    display: flex;
    justify-content: space-between; /*更加合理地排布*/
    position: relative;
    padding: 10px;
    margin: 10px 0;
}
.list li.plus{
    border-right: 5px solid #2ecc71;
}
.list li.minus{
    border-right: 5px solid #c0392b;
}
.delete-btn{
    cursor: pointer;
    background-color: red;
    border: 0;
    color: white;
    font-size: 20px;
    line-height: 20px;
    padding: 2px 5px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-100%,-50%); /*平移*/
    opacity: 0;
    transition: opacity 0.3s ease;  /*变换的样式的变形*/
}
.list li:hover .delete-btn{ /*块元素选择*/
    opacity: 1; /*随着上面定义的样式进行变换*/
}
```

index.js

```js
const balance = $("#balance")[0]
const money_plus = $('#money-plus')[0]
const money_minus = $('#money-minus')[0]
const list = $('#list')[0]
// const form = document.getElementById('form')
const submit_btn = $('#submit_btn')
const text = $('#text')[0] // 注意区分加[0]和不加[0]的区别
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
    item.innerHTML = `${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>` // 注意这个removeTransaction事件，有剧毒😤
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
```

## 7.Form Validator

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form Validator</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
    <div class="container">
        <form id="form" class="form">
            <h2>Register With Us</h2>
            <div class="form-control">
                <label for="username">Username</label>
                <input id="username" type="text" placeholder="Enter username">
                <small>Error Message</small>
            </div>
            <div class="form-control">
                <label for="email">Email</label>
                <input id="email" type="email" placeholder="Enter email">
                <small>Error Message</small>
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Enter Password">
                <small>Error Message</small>
            </div>
            <div class="form-control">
                <label for="password2">Confirm Password</label>
                <input id="password2" type="password" placeholder="Enter Password Again">
                <small>Error Message</small>
            </div>
            <input type="submit" id="submit"> <!--在这个Button中可以改变按键中的值-->
        </form>
    </div>
    <script src="./js/index.js" type="text/javascript"></script>
</body>
</html>
```

index.js

```js
const form = document.getElementById('form')
const username = document.getElementById('username')
const password = document.getElementById('password')
const email = document.getElementById('email')
const password2 = document.getElementById('password2')

function showError(input,message){
    const formControl = input.parentElement
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small') // 在总的标签下查找标签
    small.innerText = message
}
function showSuccess(input){
    const formControl = input.parentElement
    formControl.className = 'form-control success'
}
function checkEmail(input){
    const re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    if(re.test(input.value.trim())){
        showSuccess(input)
    }
    else{
        showError(input,'Email is not valid')
    }
}
function checkRequired(inputArr){
    let isRequired = false
    inputArr.forEach((input)=>{
        if(input.value.trim()===''){
            showError(input,`${getFieldName(input)} is required`)
            isRequired = true
        }else{
            showSuccess(input)
        }
    })
    return isRequired
}
function getFieldName(input){
    return input.id.charAt(0).toUpperCase()+input.id.slice(1) // slice是切片，这里是字符串的切片，将开头字母大写后链接后面的单词
}
function checkLength(input,min,max){
    if(input.value.length<min){
        showError(input,`${getFieldName(input)} must be at least ${min} characters`)
    }else if(input.value.length > max){
        showError(input,`${getFieldName(input)} must be at most ${min} characters`)
    }else{
    showSuccess(input)
    }
}
function checkPassword(input1,input2){
    if(input1.value !== input2.value){
        showError(input2,'Passwords do not match')
    }
}
form.addEventListener('submit',(e)=>{
    e.preventDefault() // 阻止默认事件的发生
    if(!checkRequired([username,email,password,password2])){
        checkLength(username,3,15)
        checkLength(password,6,15)
        checkEmail(email)
        checkPassword(password,password2)
    }
})
```

index.css

```css
:root{
    --success-color:green;  /*定义全局变量*/
    --error-color:red;
}
*{
    box-sizing: border-box;
}
body{
    background-color: white;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
}
.container{
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    width:400px;
}
h2{
    text-align: center;
    margin: 0 0 20px;
}
.form{
    padding: 30px 40px;
}
.form-control{
    margin-bottom: 10px;
    padding-bottom: 20px;
    position: relative;  /*直接顺应排布布局*/
}
.form-control label{
    color: #777;
    display: block;
    margin-bottom: 5px;
}
.form-control input{
    border: 2px solid white;
    border-radius: 4px;
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 14px;
}
.form-control input:focus{
    outline: 0;  /*设置轮廓的样式*/
    border-color: #777777;
}
.form-control.success input{
    border-color: var(--success-color);
}
.form-control.error input{
    border-color: var(--error-color);
}
.form-control small{
    color: var(--error-color);
    position: absolute;
    bottom: 0;  /*通过设置bottom属性的值将位置固定*/
    left: 0;
    visibility: hidden;
}
.form-control.error small{
    visibility: visible;
}
.form #submit{
    cursor: pointer;
    background-color: skyblue;
    border: 2px solid skyblue;
    border-radius: 4px;
    color: white;
    display: block;
    font-size: 16px;
    padding: 10px;
    margin-top: 20px;
    width: 100%;
}
```

## 8.HangMan

[SVG的参考资料](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element)     [SVG ](https://www.w3school.com.cn/svg/svg_line.asp)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HangMan</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<h1>HangMan</h1>
<p>Find the hidden word - Enter a word</p>
<div class="game-container">
    <svg height="250" width="200" class="figure-container">  <!--相当于是一个画布，和canvas差不多-->
        <line x1="60" y1="20" x2="140" y2="20"/>  <!--两点定直线，闭标签-->
        <line x1="140" y1="20" x2="140" y2="50"/>
        <line x1="60" y1="20" x2="60" y2="230"/>
        <line x1="20" y1="230" x2="100" y2="230"/>
        <circle cx="140" cy="70" r="20" class="figure-part"/>  <!--head-->
        <line x1="140" y1="90" x2="140" y2="150" class="figure-part"/>
        <line x1="140" y1="120" x2="120" y2="100" class="figure-part"/>
        <line x1="140" y1="120" x2="160" y2="100" class="figure-part"/>
        <line x1="140" y1="150" x2="120" y2="180" class="figure-part"/>
        <line x1="140" y1="150" x2="160" y2="180" class="figure-part"/>
    </svg>
    <div class="wrong-letters-container">
        <div id="wrong-letters"></div>
    </div>
    <div class="word" id="word"></div>
</div>
<div class="popup-container" id="popup-container">
    <div class="popup">
        <h2 id="final-message"></h2>
        <h3 id="final-message-reveal-word"></h3> <!--reveal 揭露-->
        <button id="play-button">Play Again</button>
    </div>
</div>
<div class="notification-container" id="notification-container">
    <p>You Have Already Entered This Letter</p>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-color: #34495e;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    margin: 0;
    overflow: hidden;
}
h1{
    margin: 20px 0 0; /*外边框*/
}
.game-container{
    padding: 20px 30px; /*内边框*/
    position: relative;
    margin: auto;
    height: 350px;
    width: 450px;
}
.figure-container{
    fill: transparent; /*设置对象内部的颜色透明效果*/
    stroke: white;  /*stroke 属性设置绘制对象的线条的颜色*/
    stroke-width: 4px; /*设置线宽*/
    stroke-linecap: round;  /*用于开放自路径两端的形状。*/
}
.figure-part{
    display: none;  /*游戏规则*/
}
.wrong-letters-container{
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;  /*列排布*/
    text-align: right;
}
.wrong-letters-container p{
    margin: 0 0 5px;
}
.wrong-letters-container span{
    font-size: 24px;
}
.word{
   display: flex;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%); /*设置动画效果*/
}
.letter{
    border-bottom: 3px solid skyblue;  /*下划线的由来*/
    display: inline-flex;
    font-size: 30px;
    align-items: center;
    justify-content: center;
    margin: 0 3px;
    height: 50px;
    width: 20px;
}
.popup-container{
    background-color: rgba(0,0,0,0.3); /*朦胧感*/
    position: fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    display: none;   /*待会会改成flex，下面的属性就会有效*/
    align-items: center; /*直接中间出现*/
    justify-content: center;
}
.popup{
    background: skyblue;
    border-radius: 5px;
    box-shadow: 0 15px 10px 3px rgba(0,0,0,0.1);
    padding:20px;
    text-align: center;
}
.popup button{
    cursor: pointer;
    background-color: white;
    color: skyblue;
    border:0;
    margin-top: 20px;
    padding:12px 20px;
    font-size:16px;
}
.popup button:active{
    transform: scale(0.98); /*按钮点击效果*/
}
.popup button:focus{
    outline: 0; /*获取焦点的时候外框会消失*/
}
.notification-container{
    background-color: rgba(0,0,0,0.3);
    border-radius: 10px 10px 0 0;
    padding:15px 20px;
    position: absolute;
    bottom: -50px;   /*设置底部距离*/
    transition: transform 0.3s ease-in-out;  /*设置属性的变化*/
}
.notification-container p{
    margin:0;
}
.notification-container.show{
    transform: translateY(-50px); /*这里和上面的transition有关*/
}
```

index.js

```js
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
            part.style.display='block'  // 改变这些属性的值实现动态显示
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
    notification.classList.add('show')  // class动态添加className
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
```

## 9.Infinite_Scroll_Blog

vw:在css中，vw是一个长度单位，一个视口单位，是指相对于视口的宽度；视口会被均分为100单位的vw，则1vw等于视口宽度的1%，比如浏览器的宽度为1920px，则“1vw=1920px/100=19.2px”。   ==可以根据设备的大小来视情况而来进行显示==

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Blog</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<h1>My Blog</h1>
<div class="filter-container">
    <input type="text" id="filter" class="filter" placeholder="Filter posts..."/>
</div>
<div id="posts-container"></div>
<div class="loader">
    <div class="circle"></div>  <!--加载动画-->
    <div class="circle"></div>
    <div class="circle"></div>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.js

```js
const postsContainer = document.getElementById('posts-container')
const loading = document.querySelector('.loader') // class的选择器
const filter = document.getElementById('filter')
let limit = 5  // 分页的功能
let page = 1
async function getPosts(){
    const res = await fetch( // fetch的语法
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    )
    const data = await res.json()
    return data;
}
async function showPosts(){
    const posts = await getPosts()
    posts.forEach(post=>{
        const postEl = document.createElement('div') // 创造节点
        postEl.classList.add('post') // 直接堆砌元素
        postEl.innerHTML = `
            <div class="number">${post.id}</div>
            <div class="post-info">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-body">${post.body}</p>
            </div>
        `
        postsContainer.appendChild(postEl)
    })
}
function showLoading(){
    loading.classList.add('show')
    setTimeout(()=>{  // 在指定的毫秒数后调用函数或计算表达式。
        loading.classList.remove('show')
        setTimeout(()=>{
            page++
            showPosts()
        },300);
    },1000)  // 1秒后移除，这就是效果
}
function filterPosts(e){
    const term = e.target.value.toUpperCase()   // 可以有用
    const posts = document.querySelectorAll('.post')
    posts.forEach(post=>{
        const title = post.querySelector('.post-title').innerText.toUpperCase()
        const body = post.querySelector('.post-body').innerText.toUpperCase()
        if(title.indexOf(term)>-1 || body.indexOf(term)>-1){
            post.style.display = 'flex'
        }else{
            post.style.display = 'none'  // none直接不显示了
        }
    })
}
showPosts()
window.addEventListener('scroll',()=>{
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;   // 对象解构，这个doc对象
    if (scrollHeight - scrollTop === clientHeight) {
        showLoading();
    }
})
filter.addEventListener('input',filterPosts)
```

index.css

这里有个点无法理解，动画😣

```css
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap'); /*无法理解*/
*{
    box-sizing: border-box;
}
body{
    background-color: deepskyblue;
    color: white;
    font-family: 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    padding-bottom: 100px;  /*元素之间间距*/
}
h1{
    margin-bottom: 0;
    text-align: center;
}
.filter-container{
    margin-top: 20px;
    width: 80vw;
    max-width: 800px;
}
.filter{
    width: 100%;
    padding:12px;
    font-size: 16px;
}
.post{
    position: relative;
    background-color: deepskyblue;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);  /*阴影的效果*/
    border-radius: 3px;
    padding: 20px;
    margin: 40px 0;
    display: flex;
    width: 80vw;
    max-width: 800px;
}
.post .post-title{
    margin: 0;
}
.post .post-body{
    margin: 15px 0 0;
    line-height: 1.3;  /*行距*/
}
.post .post-info{
    margin-left: 20px;
}
.post .number{
    position: absolute;
    top: -15px;
    left: -15px;
    font-size: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;  /*参照物是这个元素自身的尺寸*/
    background-color: white;
    color: deepskyblue;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
}
.loader {
    opacity: 0;
    display: flex;
    position: fixed;
    bottom: 50px;
    transition: opacity 0.3s ease-in;
}

.loader.show {
    opacity: 1;
}
.circle {
    background-color: white;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 5px;
    animation: bounce 0.5s ease-in infinite;
}

.circle:nth-of-type(2) {
    animation-delay: 0.1s;
}

.circle:nth-of-type(3) {
    animation-delay: 0.2s;
}

@keyframes bounce {  /*抖动的效果*/
    0%,
    100%{  /*帧动画的时间节点，就相当于from和to*/
        transform: translateY(0);
    }
    50%{
        transform: translateY(-10px);
    }
}
```

## 10.Meal Finders

[css的grid的用法](https://www.w3schools.cn/css/css_grid.asp)    [css的fr单位的解答](https://www.jianshu.com/p/72f4c09a341b)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Meal Finder</title>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css">
</head>
<body>
<div class="container">
    <h1>Meal Finder</h1>
    <div class="flex">
        <form class="flex" id="submit">
            <input type="text" id="search" placeholder="Search for meals or keywords"/>
            <button class="search-btn" type="submit"><i class="fas fa-search"></i></button>
        </form>
        <button class="random-btn" id="random"><i class="fas fa-random"></i></button>
    </div>
    <div id="result-heading"></div>
    <div id="meals" class="meals"></div>
    <div id="single-meal"></div>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.js

```js
const search = document.getElementById('search')
const submit = document.getElementById('submit')
const random = document.getElementById('random')
const mealsEl = document.getElementById('meals')
const resultHeading = document.getElementById('result-heading')
const single_mealEl = document.getElementById('single-meal')
function searchMeal(e){
    e.preventDefault()  // 停止事件本来要发生的事
    single_mealEl.innerHTML = ''
    const term = search.value
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                resultHeading.innerHTML = `<h2>Search results for ${term}:</h2>`
                if(data.meals === null){
                    resultHeading.innerHTML =  `<p>There are no search results. Try again!<p>`
                }else{
                    mealsEl.innerHTML = data.meals.map(meal=>{
                        return `<div class="meal">
                                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                    <div class="meal-info" data-mealID="${meal.idMeal}">
                                        <h3>${meal.strMeal}</h3>
                                    </div>
                                </div>`
                    }).join('')
                }
            })
        search.value = ''
    }else{
        alert('Please Enter A Search Word')
    }
}
function getMealByID(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res=>res.json())
        .then(data=>{
            const meal = data.meals[0]
            addMealToDom(meal)
        })
}
function getRandomMeal(){
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDom(meal);
        });
}
function addMealToDom(meal){
    const ingredients = []
    for(let i = 1;i<=20;i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            )
        } else {
            break;
        }
    }
    single_mealEl.innerHTML = `
       <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info"> 
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div> 
    `
}
submit.addEventListener('submit',searchMeal)
random.addEventListener('click',getRandomMeal)
mealsEl.addEventListener('click',e=>{
    console.log(e.path)
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            console.log(item.classList.contains('meal-info'))
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    console.log(mealInfo)
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealByID(mealID);
    }
})
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-color: #2d2013;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
}
.container{
    margin: auto;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.flex{
    display: flex;
}
input,
button{
    border:1px solid lightyellow;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    font-size: 14px;
    padding: 8px 10px;
    margin: 0;
}
input[type='text']{
    width: 300px;
}
.search-btn{
    cursor: pointer;
    border-left: 0;
    border-radius: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.random-btn{
    cursor: pointer;
    margin-left: 10px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
.meals{
    display: grid;
    grid-template-columns: repeat(4,1fr);  /*均分区域*/
    grid-gap: 20px;
    margin-top: 20px;
}
.meal{
    cursor: pointer;
    position: relative;
    height: 180px;
    width: 180px;
    text-align: center;
}
.meal img{
    width: 100%;
    height: 100%;
    border: 4px solid white;
    border-radius: 2px;
}
.meal-info{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease-in;
    opacity: 0;
}
.meal:hover .meal-info{
    opacity: 1;
}
.single-meal{
    margin:30px auto;
    width: 70%;
}
.single-meal img{
    width: 300px;
    margin: 15px;
    border: 4px solid white;
    border-radius: 2px;
}
.single-meal-info{
    margin:20px;
    padding: 10px;
    border: 2px dashed orange;
    border-radius: 5px;
}
.single-meal p{
    margin: 0;
    letter-spacing: 0.5px;
    line-height: 1.5;
}
.single-meal ul{
    padding-left: 0;
    list-style-type: none;   /*去掉列表的样式*/
}
.single-meal ul li{
    border: 1px solid whitesmoke;
    border-radius: 5px;
    background-color: white;
    display: inline-block;
    color: black;
    font-size: 12px;
    font-weight: bold; /*加粗的*/
    padding: 5px;
    margin: 0 5px 5px 0;
}
/*媒体查询，重点*/
@media (max-width: 800px) {
    .meals{
        grid-template-columns: repeat(3,1fr);
    }
}
@media (max-width: 700px) {
    .meals{
        grid-template-columns: repeat(2,1fr);
    }
    .meal{
        height: 200px;
        width: 200px;
    }
}
@media (max-width: 500px){
    input[type='text']{
        width: 100%;
    }
    .meals{
        grid-template-columns: 1fr;
    }
    .meal{
        height: 300px;
        width: 300px;
     }
}
```

## 11.Memory Cards(重点)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Memory Cards</title>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css">
</head>
<body>
<button id="clear" class="clear btn">
    <i class="fas fa-trash"></i>Clear Cards
</button>
<h1>
    Memory Cards
    <button id="show" class="btn btn-small">
        <i class="fas fa-plus"></i>Add New Card
    </button>
</h1>
<div id="cards-container" class="cards">

</div>
<div class="navigation">
    <button id="prev" class="nav-button">
        <i class="fas fa-arrow-left"></i>
    </button>
    <p id="current"></p>
    <button id="next" class="nav-button">
        <i class="fas fa-arrow-right"></i>
    </button>
</div>
<div id="add-container" class="add-container">
    <h1>
        Add New Card
        <button id="hide" class="btn btn-small btn-ghost">   <!--style是按照顺序生效的-->
            <i class="fas fa-times"></i>
        </button>  <!--取消按钮-->
    </h1>
    <div class="form-group">
        <label for="question">Question</label>
        <textarea id="question" placeholder="Enter Question..."></textarea>
    </div>
    <div class="form-group">
        <label for="answer">Answer</label>
        <textarea id="answer" placeholder="Enter Answer..."></textarea>
    </div>
    <button id="add-card" class="btn">
        <i class="fas fa-plus"></i>Add Cards
    </button>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.js

```js
const cardsContainer = document.getElementById('cards-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const currentEl = document.getElementById('current');
const showBtn = document.getElementById('show');
const hideBtn = document.getElementById('hide');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const addCardBtn = document.getElementById('add-card');
const clearBtn = document.getElementById('clear');
const addContainer = document.getElementById('add-container');
let currentActiveCard = 0
const cardsEl = []
const cardsData = getCardsData()
function getCardsData(){
    const cards = JSON.parse(localStorage.getItem('cards'))
    return cards===null?[]:cards;
}
function createCards(){
    cardsData.forEach((data,index)=>{createCard(data,index)})
}
function createCard(data,index=0){
    const card = document.createElement('div')
    card.classList.add('card')
    if(index===0){
        card.classList.add('active')
    }
    card.innerHTML = `
        <div class="inner-card">
            <div class="inner-card-front">
                <p>
                    ${data.question}
                </p>
            </div>
            <div class="inner-card-back">
                <p>
                    ${data.answer}
                </p>
            </div>
        </div>
  `
    card.addEventListener('click',()=>{card.classList.toggle('show-answer')})  // class中有这个类的话，就删除，没有，就添加
    cardsEl.push(card)
    cardsContainer.appendChild(card)
    updateCurrentText();
}
function updateCurrentText(){
    currentEl.innerText = `${currentActiveCard+1}/${cardsEl.length}`
}
function setCardsData(cards){
    localStorage.setItem('cards',JSON.stringify(cards))
    window.location.reload() // 重新加载当前的界面
}
createCards()
nextBtn.addEventListener('click',()=>{
    cardsEl[currentActiveCard].className = 'card left'
    currentActiveCard = currentActiveCard+1
    if(currentActiveCard >cardsEl.length-1){
        currentActiveCard = cardsEl.length-1
    }
    cardsEl[currentActiveCard].className = 'card active'
    updateCurrentText()
})
prevBtn.addEventListener('click',()=>{
    cardsEl[currentActiveCard].className = 'card right'
    currentActiveCard = currentActiveCard-11
    if(currentActiveCard<0){
        currentActiveCard = 0
    }
    cardsEl[currentActiveCard].className = 'card active'
    updateCurrentText()
})
showBtn.addEventListener('click',()=>{addContainer.classList.add('show')})
hideBtn.addEventListener('click',()=>{addContainer.classList.remove('show')})
addCardBtn.addEventListener('click',()=>{
    const question = questionEl.value
    const answer = answerEl.value
    if(question.trim() && answer.trim()){
        const newCard = {question,answer}
        createCard(newCard)  // 直接默认是新加的
        questionEl.value = ''
        answerEl.value = ''
        addContainer.classList.remove('show')
        cardsData.push(newCard)
        setCardsData(cardsData)
    }
})
clearBtn.addEventListener('click',()=>{
    localStorage.clear()
    cardsContainer.innerHTML = ''
    window.location.reload()
})
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-color: white;
    display: flex;
    flex-direction: column;   /*竖着排列*/
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
}
h1{
    position: relative;
}
h1 button{
    position: absolute;
    right: 0;
    transform: translate(120%,-50%);   /*直接移动*/
    z-index: 2;
}
.btn{
    cursor: pointer;
    background-color: white;
    border: 1px solid #aaa;
    border-radius: 3px;
    font-size: 14px;
    margin-top: 20px;
    padding: 10px 15px;
}
.btn-small{
    font-size: 12px;
    padding: 5px 10px;
}
.btn-ghost{
    border: 0;
    background-color: transparent;
}
.clear{
    position: absolute;
    bottom: 30px;
    left: 30px;
}
.cards{
    perspective: 1000px;  /*三维效果*/
    position: relative;
    height: 300px;
    width: 500px;
    max-width: 100%;
}
.card{
    position: absolute; /*将所有的卡片都堆叠在一起*/
    opacity: 0;
    font-size: 1.5em;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transform: translateX(50%) rotateY(-10deg);
    transition: transform 0.4s ease,opacity 0.4s ease;
}
.card.active{
    cursor: pointer;
    opacity: 1;
    z-index: 10;
    transform: translateX(0) rotateY(0deg);  /*动画有点翘起来的感觉*/
}
.card.left {
    transform: translateX(-50%) rotateY(10deg);
}
.inner-card{
    box-shadow: 0 1px 10px rgba(0,0,0,0.3);
    border-radius: 4px;
    height: 100%;
    width: 100%;
    position: relative;
    transform-style: preserve-3d;  /*设置子元素是在3d空间中*/
    transition: transform 0.4s ease;
}
.card.show-answer .inner-card{  /*就相当卡片的背面*/
    transform: rotateX(180deg);
}
.inner-card-front,
.inner-card-back{
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: white;
}
.inner-card-front{
    transform: rotateX(0deg);
    z-index: 2;
}
.inner-card-back{
    transform: rotateX(180deg);  /*直接背面的效果*/
}
.inner-card-back::after,
.inner-card-front::after{ /*在这些元素后面添加的元素*/
    content: 'Flip';
    font-family: Arial, Helvetica, sans-serif;
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: bold;
    font-size: 16px;
    color: black;
}
.navigation{
    display: flex;
    margin: 20px 0;
}
.navigation .nav-button{
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 16px;
}
.navigation p{
    margin: 0 25px;
}
.add-container{
    opacity: 0;
    z-index: -1;   /*重点属性*/
    background-color: white;
    border-top: 2px solid white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    position: absolute;
    top: 0;
    bottom:0;
    width: 100%;
    transition: 0.3s ease;  /*没指明属性，代表就是全属性的变化*/
}
.add-container.show{
    opacity: 1;
    z-index: 2;
}
.add-container h3{
    margin: 10px 0;
}
.form-group label{
    display: block;
    margin: 20px 0 10px;
}
.form-group textarea{
    border: 1px solid #aaa;
    border-radius: 3px;
    font-size: 16px;
    padding: 12px;
    min-width: 500px;
    max-width: 100%;
}
```

## 12.My Landing Page

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Landing Page</title>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css">
</head>
<body>
<nav id="navbar">
    <div class="logo">
        <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="user">
    </div>
    <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Portfolio</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Contact Me</a></li>
    </ul>
</nav>
<header>
    <button id="toggle" class="toggle">
        <i class="fa fa-bars fa-2x"></i>
    </button>
    <h1>My Landing Page</h1>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, amet!
    </p>
    <button class="cta-btn" id="open">Sign up</button>
</header>
<div class="container">
    <h2>What is this landing page about?</h2>
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia iure
        accusamus ab consectetur eos provident ipsa est perferendis architecto.
        Provident, quaerat asperiores. Quo esse minus repellat sapiente, impedit
        obcaecati necessitatibus.
    </p>
    <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente optio
        officia ipsa. Cum dignissimos possimus et non provident facilis saepe!
    </p>

    <h2>Tell Me More</h2>

    <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat eaque
        delectus explicabo qui reprehenderit? Aspernatur ad similique minima
        accusamus maiores accusantium libero autem iusto reiciendis ullam
        impedit esse quibusdam, deleniti laudantium rerum beatae, deserunt nemo
        neque, obcaecati exercitationem sit. Earum.
    </p>

    <h2>Benefits</h2>
    <ul>
        <li>Lifetime Access</li>
        <li>30 Day Money Back</li>
        <li>Tailored Customer Support</li>
    </ul>

    <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse quam
        nostrum, fugiat, itaque natus officia laborum dolorum id accusantium
        culpa architecto tenetur fuga? Consequatur provident rerum eius ratione
        dolor officiis doloremque minima optio dignissimos doloribus odio
        debitis vero cumque itaque excepturi a neque, expedita nulla earum
        accusamus repellat adipisci veritatis quam. Ipsum fugiat iusto pariatur
        consectetur quas libero dolor dolores dolorem, nostrum ducimus
        doloremque placeat accusamus iste, culpa quaerat consequatur?
    </p>
</div>
<div class="modal-container" id="modal">
    <div class="modal">
        <button class="close-btn" id="close">
            <i class="fa fa-times"></i>
        </button>
        <div class="modal-header">
            <h3>Sign up</h3>
        </div>
        <div class="modal-content">
            <p>Register with us to get offers, support and more</p>
            <form class="modal-form">
                <div>
                    <label for="name">Name</label>
                    <input type="text" id="name" placeholder="Enter name" class="form-input">
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="text" id="email" placeholder="Enter Email" class="form-input">
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Enter Password" class="form-input">
                </div>
                <div>
                    <label for="password2">Confirm Password</label>
                    <input type="password" id="password2" placeholder="Confirm Password" class="form-input">
                </div>
                <input type="submit" value="Submit" class="submit-btn">
            </form>
        </div>
    </div>
</div>
<script src="./js/index.js"></script>
</body>
</html>
```

index.css

```css
:root{ /*定义本地变量*/
    --model-duration: 1s;
    --primary-color: #30336b;
    --secondary-color: #be2edd;
}
*{
    box-sizing: border-box;
}
body{
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    transition: transform 0.3s ease;   /*动画指定*/
}
body.show-nav{
    transform: translateX(200px);
}
nav{
    background-color: var(--primary-color);
    border-right: 2px solid rgba(200,200,200,0.1);
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    z-index: 100;
    transform: translateX(-100%);  /*直接在最高层变换位置*/
}
nav .logo{
    padding: 30px 0;
    text-align: center;
}
nav .logo img{
    height: 75px;
    width: 75px;
    border-radius: 50%;  /*直接成为圆形*/
}
nav ul{
    padding: 0;
    list-style-type: none;
    margin: 0;
}
nav ul li{
    border-bottom: 2px solid rgba(200,200,200,0.1);
    padding: 20px;
}
nav ul li:first-of-type{
    border-top: 2px solid rgba(200,200,200,0.1);
}
nav ul li a{
    color: white;
    text-decoration: none;
}
nav ul li a:hover{
    text-decoration: underline;
}
header{
    background-color: var(--primary-color);
    color: white;
    font-size: 130%;
    position: relative;
    padding: 40px 15px;
    text-align: center;
}
header h1{
    margin: 0;
}
header p{
    margin: 30px 0;
}
button,
input[type='submit']{
    background-color: var(--secondary-color);
    border: 0;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    padding: 8px 12px;
}
button:focus{
    outline: none;
}
.toggle{
    background-color: rgba(0,0,0,0.3);
    position: absolute;
    top: 20px;
    left: 20px;
}
.cta-btn{
    padding: 12px 30px;
    font-size: 20px;
}
.container{
    padding: 15px;
    margin: 0 auto;
    max-width: 100%;
    width: 800px;
}
.modal-container{
    background-color: rgba(0,0,0,0.5);
    display: none;
    position: fixed;
    top: 0;  /*全局*/
    left: 0;
    right: 0;
    bottom: 0;
}
.modal-container.show-modal{
    display: block;
}
.modal{
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    position: absolute;
    overflow: hidden;
    top: 50%; /*居中*/
    left: 50%;
    transform: translate(-50%,-50%);
    max-width: 100%;
    width: 400px;
    animation-name: modalopen;
    animation-duration: var(--model-duration);
}
.modal-header{
    background-color: var(--primary-color);
    color: white;
    padding: 15px;
}
.modal-header h3{
    margin: 0;
    border-bottom: 1px solid #333;
}
.modal-content{
    padding: 20px;
}
.modal-form div{
    margin: 15px 0;
}
.modal-form .form-input{
    padding: 8px;
    width: 100%;
}
.close-btn{
    background-color: transparent;
    font-size: 25px;
    position: absolute;
    top: 0;
    right: 0;
}
@keyframes modalopen {
    from {
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}
```

index.js

其中要注意数组函数toggle的使用方式

```js
const toggle = document.getElementById('toggle')
const close = document.getElementById('close')
const open = document.getElementById('open')
const model = document.getElementById('modal')
const navbar = document.getElementById('navbar')
function closeNavbar(e){
    // console.log(e.target) // 返回对应的html元素组件
    if(
        document.body.classList.contains('show-nav') &&
        e.target != toggle &&
        !toggle.contains(e.target) &&
        e.target !== navbar &&
        !navbar.contains(e.target)
    ){
        document.body.classList.toggle('show-nav')
        document.body.removeEventListener('click',closeNavbar)
    }else if(!document.body.classList.contains('show-nav')){
        document.body.removeEventListener('click',closeNavbar)
    }
}
toggle.addEventListener('click',()=>{
    document.body.classList.toggle('show-nav')
    document.body.addEventListener('click',closeNavbar)
})
open.addEventListener('click',()=>{model.classList.add('show-modal')})
close.addEventListener('click',()=>{model.classList.remove('show-modal')})
window.addEventListener('click',(e)=>{
    // console.log(e.target)
    e.target === model ? model.classList.remove('show-modal'):false;
})
```

## 13.Movie Seat Booking

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Movie Seat Booking</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<div class="movie-container">
    <label>Pick a movie:</label>
    <select id="movie">
        <option value="10">Avengers: Endgame ($10)</option>
        <option value="12">Joker ($12)</option>
        <option value="8">Toy Story 4 ($8)</option>
        <option value="9">The Lion King ($9)</option>
    </select>
</div>
<ul class="showcase">
    <li>
        <div class="seat"></div>
        <small>N/A</small>
    </li>
    <li>
        <div class="seat selected"></div>
        <small>Selected</small>
    </li>
    <li>
        <div class="seat occupied"></div>
        <small>Occupied</small>
    </li>
</ul>
<div class="container">
    <div class="screen"></div>
    <div class="row">
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
    </div>
    <div class="row">
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
    </div>
    <div class="row">
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
    </div>
    <div class="row">
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
    </div>
    <div class="row">
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
    </div>
    <div class="row">
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat occupied"></div>
        <div class="seat"></div>
    </div>
</div>
<p class="text">
    You have selected <span id="count">0</span> seats for a price of $<span id="total">0</span>
</p>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.js

```js
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');   // class的选择方式
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
populateUI()
let ticketPrice = +movieSelect.value   // 直接获取到select中的值,这里有类型的强制转换
function setMovieData(movieIndex,moviePrice){
    localStorage.setItem('selectedMovieIndex',movieIndex)
    localStorage.setItem('selectedMoviePrice',moviePrice)
}
function updateSelectedCount(){
    const selectedSeats = document.querySelectorAll('.row .seat.selected')  // 直接获取个数
    const seatIndex = [...selectedSeats].map(seat=>{return [...seats].indexOf(seat)})
    localStorage.setItem('selectedSeats',JSON.stringify(seatIndex))
    const selectedSeatsCount = selectedSeats.length
    count.innerText = selectedSeatsCount
    total.innerText = selectedSeatsCount*ticketPrice
    setMovieData(movieSelect.selectedIndex,movieSelect.value)
}
function populateUI(){  // 出场就更新界面的UI效果
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'))
    if(selectedSeats !== null && selectedSeats.length>0){
        seats.forEach((seat, index)=>{
            if(selectedSeats.indexOf(index) > -1){
                seat.classList.add('selected')
            }
        })
    }
    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex')
    if(selectedMovieIndex !== null){
        movieSelect.selectedIndex = selectedMovieIndex
    }
}
movieSelect.addEventListener('change',e=>{
    ticketPrice = +e.target.value
    setMovieData(e.target.selectedIndex,e.target.value)
    updateSelectedCount()
})
container.addEventListener('click',e=>{
    if(e.target.classList.contains('seat')&&!e.target.classList.contains('occupied')){
        e.target.classList.toggle('selected')  // 这个函数真的太好用了
        updateSelectedCount()
    }
})
updateSelectedCount()
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-color: #242333;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
}
.movie-container{
    margin: 20px 0;
}
.movie-container select{
    background-color: white;
    border: 0;
    border-radius: 5px;
    font-size: 14px;
    margin-left: 10px;
    padding: 5px 15px 5px 15px;
    -moz-appearance: none;  /*这个与浏览器有关*/
    -webkit-appearance: none;
}
.container{
    perspective: 1000px;  /*视角*/
    margin-bottom: 30px;
}
.seat{
    background-color: #444451;
    height: 12px;
    width: 15px;
    margin: 3px;
    border-top-right-radius: 10px;  /*硬核座椅*/
    border-top-left-radius: 10px;
}
.seat.selected{
    background-color: deepskyblue;
}
.seat.occupied{
    background-color: white;
}
.seat:nth-of-type(2){
    margin-right: 18px;
}
.seat:nth-last-of-type(2){
    margin-left: 18px;
}
.seat:not(.occupied):hover{  /*选择class中没有occupied*/
    cursor: pointer;
    transform: scale(1.2);
}
.showcase .seat:not(.occupied):hover{
    cursor: default;
    transform: scale(1);
}
.showcase{
    background-color: rgba(0,0,0,0.1);
    padding: 5px 10px;
    border-radius: 5px;
    color: #777;
    list-style-type: none;
    display: flex;
    justify-content: space-between;  /*调整样式*/
}
.showcase li{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px;  /*左右之间的距离*/
}
.showcase li small{
    margin-left: 2px;
}
.row{
    display: flex;
}
.screen{
    background-color: white;
    height: 70px;
    width: 100%;
    margin: 15px 0;
    transform: rotateX(-45deg);  /*显示出立体的效果*/
    box-shadow: 0 3px 10px rgba(255,255,255,0.7);
}
p.text{  /*特指选择器*/
    margin: 5px 0;
}
p.text span{
    color: deepskyblue;
}
```

## 14.Music Player

[CSS object-fit](https://www.w3school.com.cn/css/css3_object-fit.asp)

[进度条的使用](https://blog.csdn.net/weixin_41105030/article/details/8669562l)

[calc() ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc)

这其中的歌自己随便找，但是要主要js代码中的坑

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Music Player</title>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css">
</head>
<body>
<h1>Music Player</h1>
<div class="music-container" id="music-container">
    <div class="music-info">
        <h4 id="title"></h4>
        <div class="progress-container" id="progress-container">
            <div class="progress" id="progress"></div>
        </div>
    </div>
    <audio src="./music/1.mp3" id="audio"></audio>
    <div class="img-container">
        <img src="jpg/3.jpg" alt="music-cover" id="cover">
    </div>
    <div class="navigation">
        <button id="prev" class="action-btn">
            <i class="fas fa-backward"></i>
        </button>
        <button id="play" class="action-btn action-btn-big">
            <i class="fas fa-play"></i>
        </button>
        <button id="next" class="action-btn">
            <i class="fas fa-forward"></i>
        </button>
    </div>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-image: linear-gradient(    /*有角度的线性渐变颜色*/
        0deg,
        rgba(247,247,247,1) 23.8%,
        rgba(252,221,221,1) 92%
    );
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
}
.music-container{
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 20px 20px 0 rgba(252,169,169,0.6);
    display: flex;
    padding: 20px 30px;
    position: relative;
    margin: 100px 0;
    z-index: 10;
}
.img-container{
    position: relative;
    width: 110px;
}
.img-container::after{
    content: '';
    background-color: white;
    border-radius: 50%;
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 20px;
    height: 20px;
    transform: translate(-50%,50%);
}
.img-container img{
    border-radius: 50%;
    object-fit: cover;
    height: 110px;
    width: inherit;
    position: absolute;
    bottom: 0;
    left: 0;
    animation: rotate 3s linear infinite;   /*无限*/
    animation-play-state: paused;   /*先是停止*/
}
.music-container.play .img-container img{
    animation-play-state: running;
}
@keyframes rotate {
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
}
.navigation{
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}
.action-btn{
    background-color: white;
    border: 0;
    color: #dfbbdf;
    font-size: 20px;
    cursor: pointer;
    padding: 10px;
    margin: 0 20px;
]}
.action-btn.action-btn-big{
    color: #cdc2d0;
    font-size: 30px;
}
.action-btn:focus {
    outline: 0;
}
.music-info {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 15px 15px 0 0;
    position: absolute;
    top: 0;
    left: 20px;
    width: calc(100% - 40px);
    padding: 10px 10px 10px 150px;
    opacity: 0;
    transform: translateY(0%);
    transition: transform 0.3s ease-in, opacity 0.3s ease-in;
    z-index: 0;
}
.music-container.play .music-info {
    opacity: 1;
    transform: translateY(-100%);  /*向上*/
}
.music-info h4 {
    margin: 0;
}
.progress-container {
    background: #fff;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px 0;
    height: 4px;
    width: 100%;
}
.progress {
    background-color: #fe8daa;
    border-radius: 5px;
    height: 100%;
    width: 0%;
    transition: width 0.1s linear;  /*当属性有变化的时候会变化*/
}
```

index.js(未完成)

```js
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
// Song titles
const songs = ['1', '2', '3'];
// Keep track of song
let songIndex = 2;
// Initially load song details into DOM
loadSong(songs[songIndex]);
// Update song details
function loadSong(song) {
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `jpg/${song}.jpg`;
}
// Play song
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}
// Pause song
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');   // 直接改图标
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}
// Previous song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;   // 直接从尾开始
    }
    loadSong(songs[songIndex]);
    playSong();
}
// Next song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}
// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;   //HTML元素
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}
// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}
//get duration & currentTime for Time of song
function DurTime (e) {
    const {duration, currentTime} = e.srcElement;
    let sec;
    let sec_d;
    // define minutes currentTime
    let min = (currentTime == null) ? 0 :
        Math.floor(currentTime / 60);
    min = min < 10 ? '0' + min : min;

    // define seconds currentTime
    function get_sec(x) {
        if (Math.floor(x) >= 60) {
            for (var i = 1; i <= 60; i++) {
                if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
                    sec = Math.floor(x) - (60 * i);
                    sec = sec < 10 ? '0' + sec : sec;
                }
            }
        } else {
            sec = Math.floor(x);
            sec = sec < 10 ? '0' + sec : sec;
        }
    }

    get_sec(currentTime, sec);
    // define minutes duration
    let min_d = (isNaN(duration) === true) ? '0' :
        Math.floor(duration / 60);
    min_d = min_d < 10 ? '0' + min_d : min_d;

    function get_sec_d(x) {
        if (Math.floor(x) >= 60) {
            for (var i = 1; i <= 60; i++) {
                if (Math.floor(x) >= (60 * i) && Math.floor(x) < (60 * (i + 1))) {
                    sec_d = Math.floor(x) - (60 * i);
                    sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
                }
            }
        } else {
            sec_d = (isNaN(duration) === true) ? '0' :
                Math.floor(x);
            sec_d = sec_d < 10 ? '0' + sec_d : sec_d;
        }
    }

    // define seconds duration
    get_sec_d(duration);
    // change duration DOM
}
// Event listeners
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});
// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
// Time/song update
audio.addEventListener('timeupdate', updateProgress);
// Click on progress bar
progressContainer.addEventListener('click', setProgress);
// Song ends
audio.addEventListener('ended', nextSong);
// Time of song
// audio.addEventListener('timeupdate',DurTime);  // 修改显示时间的
```

## 15.New Year CountDown

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Year CountDown</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<div id="year" class="year"></div>
<h1>New Year CountDown</h1>
<div id="countdown" class="countdown">
    <div class="time">
        <h2 id="days">00</h2>
        <small>days</small>
    </div>
    <div class="time">
        <h2 id="hours">00</h2>
        <small>hours</small>
    </div>
    <div class="time">
        <h2 id="minutes">00</h2>
        <small>minutes</small>
    </div>
    <div class="time">
        <h2 id="seconds">00</h2>
        <small>seconds</small>
    </div>
</div>
<img src="./img/spinner.gif" alt="loading..." id="loading" class="loading">
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-image: url("../img/1.jpg");
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center center;
    height: 100vh;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0;
    overflow: hidden;
}
body::after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
}
body *{
    z-index: 1;
}
h1{
    font-size: 60px;
    margin: -80px 0 40px;
}
.year{
    font-size: 200px;
    z-index: -1;
    opacity: 0.2;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);   /*直接和上面的left形成对比*/
}
.countdown{
    display: none;
    transform: scale(2);
}
.time{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 15px;
}
.time h2{
    margin: 0 0 5px;
}
@media (max-width: 500px) {   /*媒体查询*/
    h1{
        font-size: 45px;
    }
    .time{
        margin: 5px;
    }
    .time h2{
        font-size: 12px;
        margin: 0;
    }
    .time small{
        font-size: 10px;
    }
}
```

index.js

```js
const days = document.getElementById('days')
const hours = document.getElementById('hours')
const minutes = document.getElementById('minutes')
const seconds = document.getElementById('seconds')
const countdown = document.getElementById('countdown')
const year = document.getElementById('year')
const loading = document.getElementById('loading')
const currentYear = new Date().getFullYear()
const newYearTime = new Date(`January 01 ${currentYear + 1} 00:00:00`);
year.innerText = currentYear+1
function updateCountDown(){
    const currentTime = new Date()
    const diff = newYearTime - currentTime
    // console.log(diff)  // 毫秒
    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor(diff / 1000 / 60 / 60) % 24;
    const m = Math.floor(diff / 1000 / 60) % 60;
    const s = Math.floor(diff / 1000) % 60;
    // Add values to DOM
    days.innerHTML = d;
    hours.innerHTML = h < 10 ? '0' + h : h;
    minutes.innerHTML = m < 10 ? '0' + m : m;
    seconds.innerHTML = s < 10 ? '0' + s : s;  // 三元表达式
}
setTimeout(()=>{   // 这个是固定的反应时长
    loading.remove()
    countdown.style.display = 'flex'
},1000)
setInterval(()=>{updateCountDown()},1000)
```

## 16.Relaxer App

[conic-gradient() ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/conic-gradient)

[transform-origin](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Relaxer</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<h1>Relaxer</h1>
<div class="container" id="container">
    <div class="circle"></div>
    <p id="text"></p>
    <div class="pointer-container">
        <span class="pointer"></span>
    </div>
    <div class="gradient-circle"></div>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-color: #224941;
    background-image: url("../img/1.jpg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: auto;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
}
.container{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    height: 300px;
    width: 300px;
    position: relative;
    transform: scale(1);
}
.circle{
    background-color: black;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}
.gradient-circle{
    background: conic-gradient(
            #55b7a4 0%,
            #4ca493 40%,
            #fff 40%,
            #fff 60%,
            #336d62 60%,
            #2a5b52 100%
    );
    height: 320px;  /*直接接了个外围*/
    width: 320px;
    z-index: -2;  /*图层问题*/
    border-radius: 50%;
    position: absolute;
    top: -10px;
    left: -10px;
    /*display: none;*/
}
.pointer{
    background-color: white;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    display: block;
}
.pointer-container{
    position: absolute;
    top: -40px;
    left: 140px;
    height: 190px;
    background-color: transparent;
    /*background-color: black;*/
    animation: rotate 7.5s linear forwards infinite;
    transform-origin: bottom center;
}
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.container.grow{   /*整体变化*/
    animation: grow 3s linear forwards;
}
@keyframes grow {
    from{
        transform: scale(1);
    }
    to{
        transform: scale(1.2);
    }
}
.container.shrink {
    animation: shrink 3s linear forwards;
}
@keyframes shrink {
    from {
        transform: scale(1.2);
    }

    to {
        transform: scale(1);
    }
}
```

index.js

```js
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
```

## 17.Sorted List

[flex ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)

[Element.closest()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest)

[HTMLElement: drop event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Top 10 Richest People</title>
    <link rel="stylesheet" href="./css/index.css">
    <script src="https://kit.fontawesome.com/3da1a747b2.js" crossorigin="anonymous"></script>
</head>
<body>
<h1>10 Richest People</h1>
<p>Drag and drop the items into their corresponding spots</p>
<ul class="draggable-list" id="draggable-list"></ul>
<button class="check-btn" id="check">
    Check Order
    <i class="fas fa-paper-plane"></i>
</button>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.js

```js
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
    // console.log(itemTwo,'two',itemOne,'one')
    // console.log(listItems[toIndex])
    listItems[fromIndex].appendChild(itemTwo)
    listItems[toIndex].appendChild(itemOne)
    // console.log(listItems[toIndex])
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
    dragListItems.forEach(item => {  // 重点掌握
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    });
}
check.addEventListener('click',checkOrder)
```

index.css

```css
:root{   /*定义全局变量*/
    --border-color: #e3e5e4;
    --background-color: #c3c7ca;
    --text-color: #34444f;
}
*{
    box-sizing: border-box;
}
body{
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
}
.draggable-list{
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 0;
    list-style-type: none;
}
.draggable-list li{
    background-color: white;
    display: flex;
    flex: 1;
}
.draggable-list li:not(:last-of-type){
    border-bottom: 1px solid var(--border-color);
}
.draggable-list .number{
    background-color: var(--background-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    height: 60px;
    width: 60px;
}
.draggable-list li.over .draggable{
    background-color: #eaeaea;
}
.draggable-list .person-name{
    margin: 0 20px 0 0;
}
.draggable-list li.right .person-name {
    color: #3ae374;
}
.draggable-list li.wrong .person-name {
    color: #ff3838;
}
.draggable {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    flex: 1;
}
.check-btn {
    background-color: var(--background-color);
    border: none;
    color: var(--text-color);
    font-size: 16px;
    padding: 10px 20px;
    cursor: pointer;
}
.check-btn:active {   /*按键特性*/
    transform: scale(0.98);
}
.check-btn:focus {  /*按键特性*/
    outline: none;
}
```

## 18.Speak Number Guess

[语音识别](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechRecognition)

![image-20220801155737869](https://img2022.cnblogs.com/blog/2849002/202208/2849002-20220802170521411-1690388428.png)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Speak Number Guess</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<img src="./img/mic.png" alt="Speak">
<h1>Guess a Number Between 1 - 100</h1>
<h3>Speak the number into your microphone</h3>
<div id="msg" class="msg"></div>
<script src="./js/index.js"></script>
</body>
</html>
```

index.js(浏览器的语音识别)

```js
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
```

index.css

```css
*{
    box-sizing: border-box;
}
body{
    background-color: #2f3542;
    background-image: url("../img/bg.jpg");
    background-repeat: no-repeat;
    background-position: left center;
    background-size: auto;
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
}
h1,
h3{
    margin-bottom: 0;
}
p{
    line-height: 1.5;
    margin: 0;
}
.play-again{
    padding: 8px 15px;
    border: 0;
    background-color:white;
    border-radius: 5px;
    margin-top: 10px;
}
.msg{
    font-size: 1.5em;
    margin-top: 40px;
}
.box{
    border: 1px solid #dedede;
    display: inline-block;
    font-size: 30px;
    margin: 20px;
    padding: 10px;
}
```

## 19.Speech Text Reader

[SpeechSynthesisUtterance-文字转语音功能](https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechSynthesisUtterance)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Speech Text Reader</title>
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<div class="container">
    <h1>Speech Text Reader</h1>
    <button id="toggle" class="btn btn-toggle">
        Toggle Text Box
    </button>
    <div id="text-box" class="text-box">
        <div id="close" class="close">X</div>
        <h3>Choose Voice</h3>
        <select id="voices"></select>
        <textarea id="text" placeholder="Enter text to read..."></textarea>
        <button class="btn" id="read">Read Text</button>
    </div>
    <main></main>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.js

```js
const main = document.querySelector('main');   // html元素选择
const voicesSelect = document.getElementById('voices');
const textarea = document.getElementById('text');
const readBtn = document.getElementById('read');
const toggleBtn = document.getElementById('toggle');
const closeBtn = document.getElementById('close');

const data = [
    {
        image: './img/drink.jpg',   // 注意理解文件位置
        text: "I'm Thirsty"
    },
    {
        image: './img/food.jpg',
        text: "I'm Hungry"
    },
    {
        image: './img/tired.jpg',
        text: "I'm Tired"
    },
    {
        image: './img/hurt.jpg',
        text: "I'm Hurt"
    },
    {
        image: './img/happy.jpg',
        text: "I'm Happy"
    },
    {
        image: './img/angry.jpg',
        text: "I'm Angry"
    },
    {
        image: './img/sad.jpg',
        text: "I'm Sad"
    },
    {
        image: './img/scared.jpg',
        text: "I'm Scared"
    },
    {
        image: './img/outside.jpg',
        text: 'I Want To Go Outside'
    },
    {
        image: './img/home.jpg',
        text: 'I Want To Go Home'
    },
    {
        image: './img/school.jpg',
        text: 'I Want To Go To School'
    },
    {
        image: './img/grandma.jpg',
        text: 'I Want To Go To Grandmas'
    }
];

data.forEach(item=>createBox(item));

// Create speech boxes
function createBox(item) {
    const box = document.createElement('div');

    const { image, text } = item;

    box.classList.add('box');

    box.innerHTML = `
    <img src="${image}" alt="${text}" />
    <p class="info">${text}</p>
  `;

    box.addEventListener('click', () => {
        setTextMessage(text);
        speakText();

        // Add active effect
        box.classList.add('active');
        setTimeout(() => box.classList.remove('active'), 800);   // 样式改变
    });
    main.appendChild(box);
}

// Init speech synth
const message = new SpeechSynthesisUtterance();

// Store voices
let voices = [];

function getVoices() {
    voices = speechSynthesis.getVoices();

    voices.forEach(voice => {
        const option = document.createElement('option');

        option.value = voice.name;
        option.innerText = `${voice.name} ${voice.lang}`;

        voicesSelect.appendChild(option);
    });
}

// Set text
function setTextMessage(text) {
    message.text = text;
}

// Speak text
function speakText() {
    speechSynthesis.speak(message);
}

// Set voice
function setVoice(e) {
    message.voice = voices.find(voice => voice.name === e.target.value);
}

// Voices changed
speechSynthesis.addEventListener('voiceschanged', getVoices);

// Toggle text box
toggleBtn.addEventListener('click', () =>
    document.getElementById('text-box').classList.toggle('show')
);

// Close button
closeBtn.addEventListener('click', () =>
    document.getElementById('text-box').classList.remove('show')
);

// Change voice
voicesSelect.addEventListener('change', setVoice);

// Read text button
readBtn.addEventListener('click', () => {
    setTextMessage(textarea.value);
    speakText();
});

getVoices();
```

index.css

```css
* {
    box-sizing: border-box;
}

body {
    background: #ffefea;
    font-family: Arial, Helvetica, sans-serif;
    min-height: 100vh;
    margin: 0;
}

h1 {
    text-align: center;
}

.container {
    margin: auto;
    padding: 20px;
}

.btn {
    cursor: pointer;
    background-color: darksalmon;
    border: 0;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    padding: 8px;
}

.btn:active {
    transform: scale(0.98);
}

.btn:focus,
select:focus {
    outline: 0;
}

.btn-toggle {
    display: block;
    margin: auto;
    margin-bottom: 20px;
}

.text-box {
    width: 70%;  /*直接百分比*/
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -800px);    /*一直存在元素*/
    background-color: #333;
    color: #fff;
    padding: 20px;
    border-radius: 5px;
    transition: all 1s ease-in-out;
}

.text-box.show {
    transform: translate(-50%, 0);    /*回到原处*/
}

.text-box select {
    background-color: darksalmon;
    border: 0;
    color: #fff;
    font-size: 12px;
    height: 30px;
    width: 100%;
}

.text-box textarea {
    border: 1px #dadada solid;
    border-radius: 4px;
    font-size: 16px;
    padding: 8px;
    margin: 15px 0;
    width: 100%;
    height: 150px;
}

.text-box .btn {
    width: 100%;
}

.text-box .close {
    float: right;
    text-align: right;
    cursor: pointer;
}

main {
    display: grid;    /*网格排布*/
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;   /*间隔*/
}

.box {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: box-shadow 0.2s ease-out;
}

.box.active {
    box-shadow: 0 0 10px 5px darksalmon;  /*属性变化*/
}

.box img {
    width: 100%;
    object-fit: cover;    /*图片摆放的方式*/
    height: 200px;
}

.box .info {
    background-color: darksalmon;
    color: #fff;
    font-size: 18px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
    padding: 10px;
    text-align: center;
    height: 100%;
}
/*控制网格的排布方式*/
@media (max-width: 1100px) {
    main {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 760px) {
    main {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 500px) {
    main {
        grid-template-columns: 1fr;
    }
}
```

## 20.Type Game

[appearance - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/appearance)

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Type Game</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css">
    <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<button id="settings-btn" class="settings-btn">
    <i class="fas fa-cog"></i>
</button>
<div id="settings" class="settings">
    <form id="settings-form">
        <div>
            <label for="difficulty">Difficulty</label>
            <select id="difficulty">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>
    </form>
</div>
<div class="container">
    <h2>👩‍💻 Speed Typer 👨‍💻</h2>
    <small>Type the following:</small>
    <h1 id="word"></h1>
    <input
            type="text"
            id="text"
            autocomplete="off"
            placeholder="Type the word here..."
            autofocus
    />
    <p class="time-container">Time left: <span id="time">10s</span></p>
    <p class="score-container">Score: <span id="score">0</span></p>
    <div id="end-game-container" class="end-game-container"></div>
</div>
<script type="text/javascript" src="./js/index.js"></script>
</body>
</html>
```

index.css

```css
* {
    box-sizing: border-box;
}
body {
    background-color: #2c3e50;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
}
button {
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
    padding: 5px 15px;
}
select {
    width: 200px;
    padding: 5px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    background-color: #a7c5e3;
}
select:focus,
button:focus {
    outline: 0;
}
.settings-btn {
    position: absolute;
    bottom: 30px;
    left: 30px;
}
.settings {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    height: 70px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(0);
    transition: transform 0.3s ease-in-out;
}
.settings.hide {
    transform: translateY(-100%);
}
.container {
    background-color: #34495e;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    color: #fff;
    position: relative;
    text-align: center;
    width: 500px;
}
h2 {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 8px;
    border-radius: 4px;
    margin: 0 0 40px;
}
h1 {
    margin: 0;
}
input {
    border: 0;
    border-radius: 4px;
    font-size: 14px;
    width: 300px;
    padding: 12px 20px;
    margin-top: 10px;
}
.score-container {
    position: absolute;
    top: 60px;
    right: 20px;
}
.time-container {
    position: absolute;
    top: 60px;
    left: 20px;
}
.end-game-container {
    background-color: inherit;
    display: none;  /*先消失*/
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;   /*直接改display属性*/
}
```

index.js

```js
const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');
// List of words for game
const words = [
    'sigh',
    'tense',
    'airplane',
    'ball',
    'pies',
    'juice',
    'warlike',
    'bad',
    'north',
    'dependent',
    'steer',
    'silver',
    'highfalutin',
    'superficial',
    'quince',
    'eight',
    'feeble',
    'admit',
    'drag',
    'loving'
];
// Init word
let randomWord;
// Init score
let score = 0;
// Init time
let time = 10;
// 初始化
let difficulty =
    localStorage.getItem('difficulty') !== null
        ? localStorage.getItem('difficulty')
        : 'medium';
// Set difficulty select value
difficultySelect.value =
    localStorage.getItem('difficulty') !== null
        ? localStorage.getItem('difficulty')
        : 'medium';
// Focus on text on start
text.focus();
// Start counting down
const timeInterval = setInterval(updateTime, 1000);
// Generate random word from array
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}
// Add word to DOM
function addWordToDOM() {
    randomWord = getRandomWord();
    word.innerHTML = randomWord;
}
// Update score
function updateScore() {
    score++;
    scoreEl.innerHTML = score;
}
// Update time
function updateTime() {
    time--;
    timeEl.innerHTML = time + 's';
    if (time === 0) {
        clearInterval(timeInterval);   // 一定要清除定时器
        // end game
        gameOver();
    }
}
// Game over, show end screen
function gameOver() {
    endgameEl.innerHTML = `
        <h1>Time ran out</h1>
        <p>Your final score is ${score}</p>
        <button onclick="location.reload()">Reload</button>   
  `; // 直接刷新页面
    endgameEl.style.display = 'flex';   // 直接改display的属性
}
addWordToDOM();
// Event listeners
// Typing
text.addEventListener('input', e => {    // 一直监听打字事件
    const insertedText = e.target.value;
    if (insertedText === randomWord) {
        addWordToDOM();
        updateScore();
        // Clear
        e.target.value = '';
        if (difficulty === 'hard') {
            time += 2;
        } else if (difficulty === 'medium') {
            time += 3;
        } else {
            time += 5;
        }
        updateTime();
    }
});
// Settings btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'));
// Settings select
settingsForm.addEventListener('change', e => {   // select框绑定改变事件
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty);
});
```

