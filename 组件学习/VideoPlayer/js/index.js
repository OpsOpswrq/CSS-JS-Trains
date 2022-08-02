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
    video.addEventListener('click',toggleVideoStatus)
    video.addEventListener('pause',updatePlayImg)
    video.addEventListener('play',updatePlayImg)
    video.addEventListener('timeupdate',updateProgress)
    video.addEventListener('click', toggleVideoStatus);
    video.addEventListener('pause', updatePlayImg);
    video.addEventListener('play', updatePlayImg);
    video.addEventListener('timeupdate', updateProgress);
    play.on('click', toggleVideoStatus);
    stop.on('click', stopVideo);
    progress.addEventListener('change', setVideoProgress);
})
