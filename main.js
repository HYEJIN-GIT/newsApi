//뉴스 함수 호출

let newsList = []
let searchIcon = document.querySelector('.fa-magnifying-glass')
let userInput = document.getElementById('user-input')
let keywordButton = document.getElementById('keyword-btn')
let bars = document.querySelector('.fa-bars')
const sideMenu = document.querySelector(".side-menus");
let deleteButton = document.querySelector('.fa-x')

searchIcon.addEventListener("click",()=>{
    userInput.classList.toggle("active");
    keywordButton.classList.toggle("active");
})

bars.addEventListener("click",()=>{
    sideMenu.classList.toggle("active");
})
 
deleteButton.addEventListener("click",()=>{
    sideMenu.classList.remove("active");
})
    



const getLatestNews = async ()=>{
    let  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`)
    let response = await fetch(url)
    console.log("response",response)
    let data = await response.json() //파일 형태 확장자 
    console.log("data",data)
    newsList = data.articles
    console.log(newsList)
    render()
}

getLatestNews()





const render =() =>{
 let newsHTML = newsList.map((news)=>
`      
 <div class="row news-content">
                <div class="col-lg-4">
                    <img src="${ news.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}" class ="news-img-size"> 
                </div>
                <div class="col-lg-8" >
                    <h2>${news.title}</h2>
                   <div> 
                   ${
                    news.description ? 
                    ( news.description.length > 200 ? news.description.slice(0,200)+"..." : news.description) 
                    : "내용 없음"
                   }
                   
                   </div>
                    <div>${news.source?.name || "no source" } *${
                        
                        moment(news.publishedAt).fromNow()
                       }</div>
                </div>
            </div>


 `).join('')

 document.getElementById('news-list').innerHTML = newsHTML
}