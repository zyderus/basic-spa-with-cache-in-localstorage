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

footerDate.innerHTML = `${new Date().getFullYear()}`

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

// Functions
function clearSections() {
  document.querySelectorAll('section').forEach(section => {
    section.style.display = 'none'
  })
}

function showFeed() {
  clearSections()
  feedSection.style.display = 'block'
}

function showLogin() {
  clearSections()
  loginSection.style.display = 'block'
}

function showRegister() {
  clearSections()
  regSection.style.display = 'block'
}

function showPage() {
  clearSections()
  signinBtn.style.display = 'none'
  registerBtn.style.display = 'none'
  pageSection.style.display = 'block'
  logoutBtn.style.display = 'block'
}

function timeFormat(ms) {
  const now = Date.now()
  let date
  if (now - ms < 60 * 1000) {
    date = 'now'
  } else if (now - ms < 10 * 60 * 1000) {
    date = 'within 10 mins'
  } else if (now - ms < 60 * 60 * 1000) {
    date = 'an hour ago'
  } else if (now - ms < 12 * 60 * 60 * 1000) {
    date = 'today'
  } else {
    date = new Date(ms).toDateString()
  }
  return date
}

function displayTimelines() {
  showFeed()
  newsfeed.sort((a, b) => b.date - a.date)
  newsfeed.forEach(feed => {
    feedSection.appendChild(blogCardComponent(feed))
  })
}

function loginUser() {
  const username = document.querySelector('#login-username')
  const password = document.querySelector('#login-password')
  const foundUser = users.find(user => username.value === user.username)
  if (foundUser && password.value === foundUser.password) {
    showPage();
    pageSection.innerHTML = `
      <div class="heading">
        <h2>Welcome to your Dashboard, ${foundUser.username.toUpperCase()}</h2>
      </div>
      <div class="card blog-form">
        <form action="" id="add-blog">
          <input type="text" id="img-url" placeholder="image url..."><br>
          <textarea name="" id="blog-text" cols="30" rows="10" placeholder="your blog..."></textarea><br>
          <a href="#" id="submit-blog" class="button btn-submit">Submit</a>
          <span class="warning submit-msg"></span>
        </form>
      </div>
    `
    const blogForm = document.querySelector('.blog-form')
    const submitBtn = document.querySelector('#submit-blog')
    const imgUrl = document.querySelector('#img-url')
    const blogText = document.querySelector('#blog-text')
    const submitMsg = document.querySelector('.submit-msg')

    newsfeed.sort((a, b) => b.date - a.date)
    newsfeed.forEach(feed => {
      if (feed.username === foundUser.username){
        pageSection.appendChild(blogCardComponent(feed))
      }
    })

    submitBtn.addEventListener('click', () => {
      if (!(blogText.value.length > 1)) {
        return submitMsg.innerHTML = ' * Cannot submit an empty blog...'
      }
      
      submitMsg.innerHTML = ''
      const newBlog = {
        username: foundUser.username,
        date: Date.now(),
        img: imgUrl.value,
        timeline: blogText.value,
      }
      newsfeed.push(newBlog)
      writeToLocalstorage('newsfeed', newsfeed)

      imgUrl.value = ''
      blogText.value = ''

      // Insert a new blog
      blogForm.after(blogCardComponent(newBlog))
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
      <div class="heading">
        <h2>Welcome to your Dashboard, ${username.value.toUpperCase()}</h2>
      </div>
      `
    } else {
      showRegister()
      regSection.innerHTML = ``
      regSection.innerHTML = `
      <div class="card">
        <p class="warning">* Username and Password must be 3 or more characters</p>
      </div>
      `
      setTimeout(() => { window.location.href = "index.html"; }, 3000)
    }
  } else {
    showPage();
    pageSection.innerHTML = `
    <div class="card">
      <p class="warning">* Username already registered. Please proceed to Login page</p>
    </div>
    `
    setTimeout(() => { window.location.href = "index.html"; }, 3000)
  }
}

// function deleteBlog() {
//   console.log('blog deleted')
// }

// Components
function blogCardComponent(feed) {
  const card = document.createElement('div')
  card.className = 'card'
  card.innerHTML = `
    <div class="delete-btn">&Cross;</div>
    <div class="pic-container" style="
      background-image: url('${feed.img}');">
    </div>
    <div class="content">
      <h3>${feed.username}</h3>
      <span class="date-span">${timeFormat(feed.date)}</span>
      <p>${feed.timeline.substring(0, 500)}</p>
    </div>
  `
  const deleteBtn = card.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', () => {
    card.style.transform = 'translateX(-3rem)'
    // card.remove()
  })
  return card
}