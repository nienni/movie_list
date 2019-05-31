(function () {
  // new variable
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  axios.get(INDEX_URL) // change here
    .then((response) => {
      //解法一：迭代器
      // for (let item of response.data.results) {
      //   data.push(item)
      // }

      //解法二：展開運算子(... 三個點點（刪節號）就是 spread operator，他的主要功用是「展開陣列元素」)
      data.push(...response.data.results)
      //調用函式

      displayDataList(data)
      console.log(data)
      console.log(data.length)
      getTotalPages(data)//U89新增頁碼顯示
      getPageData(1, data) //U89製作頁碼顯示監聽器
    })
    .catch((err) => console.log(err))


  const dataPanel = document.getElementById('data-panel')

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })



  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()//運用 DOM 操作時，通常會使用 JavaScript 來掌控 UI 行為，因此遇到這種有預設行為的元件，需要使用 event.preventDefault() 來終止它們的預設行為。

    //filter + 正規表達法：如何有效比對字串
    const regex = new RegExp(searchInput.value, 'i')


    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    displayDataList(results)
    //U89 分頁顯示：為搜尋的結果也必須分頁顯示，所以要記得來search button渲染
    getTotalPages(results)
    getPageData(1, results)
  })

  //


  // SKIP (accessing data by axios)

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
      <div class= "col-sm-3">  
        <div "card mb-2">
          <img class= "card-img-top" src="${POSTER_URL}${item.image}"  alt="Card image cap">
          <div class= "card-body">
            <h6 class = "card-title">${item.title}</h6>
          </div>

          <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>

            
          </div>
        </div>
        </div>
      </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  //新增頁碼
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  //U89新增頁碼顯示HTML

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  // U89 listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  let paginationData = []

  function getPageData(pageNum, data) {
    paginationData = data || paginationData //U89解決疑難雜症關鍵：如果呼叫 getPageData 時有電影資料被傳入，就用新傳入的資料作運算，然後 paginationData 會被刷新；如果呼叫 getPageData 時沒有電影資料被傳入，則沿用 paginationData 裡的內容，確保 slice 始終有東西可以處理。
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

})()

//組合動態 HTML 樣板
// const dataPanel = document.getElementById('data-Panel')

// function displayDatalist(data) {
//   let HTMLcontent = ''
//   data.forEach(function (item, index) {
//     HTMLcontent += `
//     <div>
//       <img src= ${POSTER_URL}${item.image}>
//       <h6>${item.title}</h6>
//     </div>
//     `
//   })
//   dataPanel.innerHTML = HTMLcontent
// }

