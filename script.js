const feedSection = document.querySelector('#feed')
const regSection = document.querySelector('#register')
const loginSection = document.querySelector('#login')
const pageSection = document.querySelector('#page')
const regForm = document.querySelector('#reg-form')
const loginForm = document.querySelector('#login-form')
const toLogin = document.querySelector('#to-login')
const toRegister = document.querySelector('#to-register')
const footerDate = document.querySelector('.footer-date')
const signinBtn = document.querySelector('#signin-btn')
const registerBtn = document.querySelector('#register-btn')
const logoutBtn = document.querySelector('#logout-btn')

// Event Listeners
document.addEventListener('DOMContentLoaded', displayTimelines())
signinBtn.addEventListener('click', () => showLogin())
registerBtn.addEventListener('click', () => showRegister())

loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  loginUser()
})

regForm.addEventListener('submit', (e) => {
  e.preventDefault()
  registerUser()
})

footerDate.innerHTML = `${new Date().getFullYear()}`

// Functions
function showFeed() {
  feedSection.style.display = 'block'
  regSection.style.display = 'none'
  loginSection.style.display = 'none'
  pageSection.style.display = 'none'
}

function showLogin() {
  feedSection.style.display = 'none'
  regSection.style.display = 'none'
  loginSection.style.display = 'block'
  pageSection.style.display = 'none'
}

function showRegister() {
  feedSection.style.display = 'none'
  regSection.style.display = 'block'
  loginSection.style.display = 'none'
  pageSection.style.display = 'none'
}

function showPage() {
  signinBtn.style.display = 'none'
  registerBtn.style.display = 'none'
  feedSection.style.display = 'none'
  regSection.style.display = 'none'
  loginSection.style.display = 'none'
  pageSection.style.display = 'block'
  logoutBtn.style.display = 'block'
}

function displayTimelines() {
  showFeed()
  newsfeed.forEach(feed => {
    createCard(feed, feedSection)
  })
}

function loginUser() {
  const username = document.querySelector('#login-username')
  const password = document.querySelector('#login-password')
  const foundUser = users.find(user => username.value === user.username)
  if (foundUser && password.value === foundUser.password) {
    showPage();
    pageSection.innerHTML = `
      <h2>Welcome to your Dashboard, ${foundUser.username.toUpperCase()}</h2>
      <br>
      <div class="card">
        <form action="" id="add-blog">
          <input type="text" id="img-url" placeholder="image url..."><br>
          <textarea name="" id="blog-text" cols="30" rows="10" placeholder="your blog..."></textarea><br>
          <button class="button">Submit</button>
        </form>
      </div>
    `
    const list = document.querySelector('#list')
    newsfeed.forEach(feed => {
      if (feed.username === foundUser.username) {
        createCard(feed, pageSection)
      }
    })

  } else {
    username.value = ''
    password.value = ''
  }
}

function registerUser() {
  const username = document.querySelector('#reg-username')
  const password = document.querySelector('#reg-password')
  const foundUser = users.find(user => username.value === user.username)
  if (!foundUser) {
    if (username.value.length > 2 && password.value.length > 2) {
      const newUser = {
        username: username.value,
        password: password.value,
      }
      users.push(newUser)
      writeToLocalstorage('users', users)

      showPage();
      pageSection.innerHTML = `
        <h2>Welcome to your Dashboard, ${username.value.toUpperCase()}</h2>
        <a href="index.html"><button>Back</button></a>
      `
    } else {
      showPage()
      pageSection.innerHTML = `
        <h4>Username and Password must be 3 or more characters
      `
      setTimeout(() => { window.location.href = "index.html"; }, 2000)
    }
  } else {
    showPage();
    pageSection.innerHTML = `
      <h2>Username already registered. Please proceed to Login page</h2>
    `
    setTimeout(() => { window.location.href = "index.html"; }, 2000)
  }
}

function createCard(feed, section) {
  const card = document.createElement('div')
  card.className = 'card'
  card.innerHTML = `
    <div class="pic-container" style="
      background-image: url('${feed.img}');">
    </div>
    <div class="content">
      <h3>${feed.username}</h3>
      <span class="date-span">${feed.date}</span>
      <p>${feed.timeline.substring(0, 500)}</p>
    </div>
  `
  section.appendChild(card)
}