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