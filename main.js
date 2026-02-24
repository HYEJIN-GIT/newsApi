//뉴스 함수 호출
let newsList = []
const getLatestNews = async ()=>{
    url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?`)
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
                    <img src="${news.urlToImage}" class ="news-img-size"> 
                </div>
                <div class="col-lg-8" >
                    <h2>${news.title}</h2>
                   <div> ${news.description}</div>
                    <div>${news.author} *${news.publishedAt}</div>
                </div>
            </div>


 `).join('')

 document.getElementById('news-list').innerHTML = newsHTML
}