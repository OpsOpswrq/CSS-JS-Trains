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
