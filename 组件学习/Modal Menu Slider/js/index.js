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