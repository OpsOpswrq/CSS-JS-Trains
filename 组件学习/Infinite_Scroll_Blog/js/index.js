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