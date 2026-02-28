//뉴스 함수 호출
let  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`)
let newsList = []
let searchIcon = document.querySelector('.fa-magnifying-glass')
let userInput = document.getElementById('user-input')
let keywordButton = document.getElementById('keyword-btn')
let bars = document.querySelector('.fa-bars')
let sideButton = document.querySelectorAll('.side-menu-area a')

let totalResults = 0
let page = 1
const pageSize = 10
const groupSize  =5



let deleteButton = document.querySelector('.fa-x')
let menus = document.querySelectorAll('.menus button')

userInput.addEventListener("focus",()=>{
    userInput.value = ""
})
userInput.addEventListener("keydown",(event)=>{
    if(event.key === "Enter"){
        getNewsByKeyword()
    }
})
//카테고리 버튼 
menus.forEach((item)=>
item.addEventListener("click",(event)=>{
    getNewsByCategory(event)
}))

//사이드 카테고리

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  sideButton.forEach((item)=>
    item.addEventListener("click",(event)=>{
        getNewsByCategory(event)
        closeNav() 
    }))

//서치아이콘
searchIcon.addEventListener("click",()=>{
    userInput.classList.toggle("active");
    keywordButton.classList.toggle("active");
})



//코드 리펙토링

const getNews = async ()=>{

    
    try {
        url.searchParams.set("page",page)
        url.searchParams.set("pageSize",pageSize)
        let response = await fetch(url)
        console.log("response",response)
        let data = await response.json() //파일 형태 확장자 
        
           console.log("data",data)
        if(response.status === 200){
           if(data.articles.length === 0){
                    throw new Error("No matches for your search")
                }
                newsList = data.articles
                totalResults =data.totalResults
                console.log(newsList,totalResults)
                render()
                paginationRender()
    
        }else{
            throw new Error(data.message)
        }
            
        } catch (error) {
           errorRender(error.message)
        }
       
}



const getLatestNews = async ()=>{
    page = 1
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`)
    getNews()
}

getLatestNews()


//카테고리별 뉴스
const getNewsByCategory= async (event)=>{
    page = 1
    let category = event.target.textContent.toLowerCase()
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${category}`)
    getNews()
}


//키워드별 뉴스

const getNewsByKeyword = async ()=>{
    page = 1
    let keyword = userInput.value
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`)
    userInput.value = ""
    getNews()
}

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



const errorRender = (error)=>{

    const errorHTML = `
    <div class="alert alert-danger" role="alert">
  ${error}
</div>
    `
    document.getElementById('news-list').innerHTML =errorHTML
      document.querySelector(".pagination").innerHTML = ""
}

const paginationRender = ()=>{

    let totalPage = Math.ceil(totalResults/pageSize)
    
    console.log(totalPage)
    let pageGroup = Math.ceil(page/groupSize)
    console.log(pageGroup)
    let lastPage = groupSize*pageGroup
    if(lastPage>totalPage){
        lastPage = totalPage
    }
    let firstPage = lastPage -(groupSize-1) < 1 ? 1 : lastPage -(groupSize-1)
    console.log(lastPage,firstPage)


    let paginationHTML = ``
    if(page>1){
        paginationHTML=`<li class="page-item"><a class="page-link" onclick="moveToPage(1)">&lt;&lt</a></li>
    <li class="page-item"><a class="page-link" onclick="moveToPage(${page-1})">&lt;</a></li>`
    }
    
    for(let i = firstPage;i<=lastPage;i++){
        paginationHTML+= `  
        <li class="page-item"><a class="page-link ${i === page ?"active": ""}" onclick="moveToPage(${i})">${i}</a></li>
   `    
    }

    if(page<totalPage){

        paginationHTML+=` <li class="page-item"><a class="page-link" onclick="moveToPage(${page+1})" >&gt;</a></li>
        <li class="page-item"><a class="page-link" onclick="moveToPage(${totalPage})" > &gt;&gt; </a></li>
        `
    }
   

    document.querySelector('.pagination').innerHTML = paginationHTML
}

const moveToPage = (num)=>{
    page = num
    getNews()
}