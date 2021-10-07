const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const personInfo = JSON.parse(localStorage.getItem('favoriteFriends')) || []
let filteredpersonInfo = []


dataPanel.addEventListener('click', function (event) {
  if (event.target.matches('.btn-read-more')) {
    showModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
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
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}
function removeFromFavorite(id) {
  const friendIndex = personInfo.findIndex(friend => friend.id === id)
  personInfo.splice(friendIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(personInfo))
  renderpersonInfo(personInfo)
}
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-friend')) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})
renderpersonInfo(personInfo)