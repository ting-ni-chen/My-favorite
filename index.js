const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const personInfo = []
const FRIEND_PER_PAGE = 20
let filteredpersonInfo = []
const paginator = document.querySelector('#paginator')


axios.get(INDEX_URL).then((response) => {
  personInfo.push(...response.data.results)
  renderPaginator(personInfo.length)
  renderpersonInfo(getFriendByPage(1))
})
  .catch((err) => console.log(err))

dataPanel.addEventListener('click', function (event) {
  if (event.target.matches('.btn-read-more')) {
    showModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-add-favorite')) {
  addToFavorite(Number(event.target.dataset.id))
}
})

// listen to paginator
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderpersonInfo(getFriendByPage(page))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault() //新增這裡
  const keyword = searchInput.value.trim().toLowerCase()
  // if (!keyword.length) {
  //   return alert('請輸入有效字串！')
  // }
  filteredpersonInfo = personInfo.filter((personInfo) =>
    personInfo.name.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredpersonInfo.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人`)
  }
  renderPaginator(filteredpersonInfo.length)  //新增這裡
  renderpersonInfo(getFriendByPage(1))
})

function showModal(id) {
  const ModalAvatar = document.querySelector('#modal-avatar')
  const ModalName = document.querySelector('#modal-name')
  const ModalGender = document.querySelector('#modal-gender')
  const ModalAge = document.querySelector('#modal-age')
  const ModalEmail = document.querySelector('#modal-email')
  const ModalBirthday = document.querySelector('#modal-birthday')

  axios.get(INDEX_URL + '/' + id).then((response) => {
    const data = response.data
    console.log(INDEX_URL + '/' + id)
    console.log(data)
    ModalName.innerText = `${data.name}\t${data.surname}`
    ModalGender.innerText = `Gender : ${data.gender}`
    ModalAge.innerText = `Age : ${data.age}`
    ModalEmail.innerText = `Email : ${data.email}`
    ModalAvatar.innerHTML = `<img src="${data.avatar}" alt="Avatar" id="person-modal-avatar">`
    ModalBirthday.innerText = `Birthday : ${data.birthday}`
  })
}

function renderpersonInfo(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
      <div class="mt-5">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top" alt="personAvatar">
          <div class="card-body">
            <h5 class="card-title" id="personName">${item.name}\t${item.surname}</h5>
          </div>
          <div class="card-footer text-muted">
            <button class="btn btn-info btn-read-more" data-toggle="modal" data-target="#person-modal" data-id="${item.id}">More Info</button>
            <button class="btn btn-danger btn-add-favorite" data-id="${item.id}">Like ♥</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIEND_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getFriendByPage(page) {
  const data = filteredpersonInfo.length ? filteredpersonInfo : personInfo
  const startIndex = (page - 1) * FRIEND_PER_PAGE
  return data.slice(startIndex, startIndex + FRIEND_PER_PAGE)
}

//新增函式
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = personInfo.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    return alert('此人已經在清單中！')
  }
  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
}