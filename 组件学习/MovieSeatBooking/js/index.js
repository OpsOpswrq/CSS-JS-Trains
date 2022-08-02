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