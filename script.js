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
    insertBlogComponent(foundUser)
    newsfeed.sort((a, b) => b.date - a.date)    // sort blogs by date in descending order
    // Add blog cards of a login user
    newsfeed.forEach(feed => {
      if (feed.username === foundUser.username){
        const card = blogCardComponent(feed)
        card.querySelector('.delete-btn').style.display = 'flex'
        pageSection.appendChild(card)
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

  // Check if username exists
  const foundUser = users.find(user => username.value === user.username)
  if (!foundUser) {
    // if username and password contain at least 3 chars, then create a user
    if (username.value.length > 2 && password.value.length > 2) {
      const newUser = {
        username: username.value,
        password: password.value,
      }
      // Add user to array to local storage
      users.push(newUser)
      writeToLocalstorage('users', users)

      // unhide page section
      showPage();
      insertBlogComponent(newUser)
    } else {
      showRegister()
      regSection.innerHTML = ``
      regSection.innerHTML = `
      <div class="card">
        <p class="warning">* Username and Password must be 3 or more characters</p>
      </div>
      `
      // Back to main screen after n milliseconds
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

// Remove a blog from local storage
function removeBlogFromDb(element) {
  const blogs = readFromLocalstorage('newsfeed')
  const index = blogs.findIndex(blog => blog.date === element)
  blogs.splice(index, 1)
  writeToLocalstorage('newsfeed', blogs)
}

/*   COMPONENTS   */

// Blog card component
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

  // Delete icon of card element
  const deleteBtn = card.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', () => {
    // move card offscreen
    card.style.transform = 'translateX(-200%)'
    // remove card element from DOM
    card.addEventListener('transitionend', () => card.remove())
    // remove card record from database
    removeBlogFromDb(feed.date)
  })
  return card
}

// Insert and display a blog component
function insertBlogComponent(user) {
  pageSection.innerHTML = `
    <div class="heading">
      <h2>Welcome to your Dashboard, ${user.username.toUpperCase()}</h2>
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
  // Form elements variables
  const blogForm = document.querySelector('.blog-form')
  const submitBtn = document.querySelector('#submit-blog')
  const imgUrl = document.querySelector('#img-url')
  const blogText = document.querySelector('#blog-text')
  const submitMsg = document.querySelector('.submit-msg')

  // Add blog
  submitBtn.addEventListener('click', () => {
    // Display error if blog is empty on submit
    if (!(blogText.value.length > 1)) {
      return submitMsg.innerHTML = ' * Cannot submit an empty blog...'
    }
    
    // Clear error message
    submitMsg.innerHTML = ''
    // Create a new blog
    const newBlog = {
      username: user.username,
      date: Date.now(),
      img: imgUrl.value,
      timeline: blogText.value,
    }
    // Add blog to array
    newsfeed.push(newBlog)
    // Add array to local storage
    writeToLocalstorage('newsfeed', newsfeed)

    imgUrl.value = ''
    blogText.value = ''

    // Insert a new blog card
    const card = blogCardComponent(newBlog)
    card.querySelector('.delete-btn').style.display = 'flex'
    blogForm.after(card)
  })
}