const body = document.querySelector('body')
const main = document.querySelector('#main')
const signinBtn = document.querySelector('#signin-btn')
const registerBtn = document.querySelector('#register-btn')
const logoutBtn = document.querySelector('#logout-btn')

// Add footer
const footer = footerComponent()
body.appendChild(footer)

// Event Listeners
document.addEventListener('DOMContentLoaded', displayTimeline())
// Add parallax to body background
// window.addEventListener('scroll', () => {
//   const offset = window.pageYOffset
//   body.style.backgroundPositionY = offset * 0.3 + 'px'
// })
signinBtn.addEventListener('click', () => loginUser())
registerBtn.addEventListener('click', () => registerUser())

// Functions
function signedBtnSet() {
  signinBtn.style.display = 'none'
  registerBtn.style.display = 'none'
  logoutBtn.style.display = 'block'
}

function displayTimeline() {
  newsfeed.sort((a, b) => b.date - a.date)
  newsfeed.forEach(feed => {
    main.appendChild(blogCardComponent(feed))
  })
}

function loginUser() {
  main.innerHTML = ''
  const card = loginCardComponent()
  main.appendChild(card)
}

function registerUser() {
  main.innerHTML = ''
  const card = registerCardComponent()
  main.appendChild(card)
}

// Remove a blog from local storage
function removeBlogFromDb(element) {
  const index = newsfeed.findIndex(feed => feed.date === element)
  newsfeed.splice(index, 1)
  writeToLocalstorage('newsfeed', newsfeed)
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
  main.innerHTML = `
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

// Login card component
function loginCardComponent() {
  const card = document.createElement('div')
  card.className = 'card'
  card.className += ' card-auth'
  card.innerHTML = `
    <div class="auth-title">Sign In</div>

    <form action="" id="login-form">
      <label for="login-username">Username</label><br>
      <input type="text" id="login-username"><br>
      <label for="login-password">Password</label><br>
      <input type="password" id="login-password"><br>
      <button class="button btn-glass">Login</button>
    </form> 
  `
  const username = card.querySelector('#login-username')
  const password = card.querySelector('#login-password')
  const loginForm = card.querySelector('#login-form')

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    login()
  })

  function login() {
    const foundUser = users.find(user => username.value === user.username)
    if (foundUser && password.value === foundUser.password) {
      signedBtnSet()
      insertBlogComponent(foundUser)
      newsfeed.sort((a, b) => b.date - a.date)    // sort blogs by date in descending order
      // Add blog cards of a login user
      newsfeed.forEach(feed => {
        if (feed.username === foundUser.username){
          const card = blogCardComponent(feed)
          card.querySelector('.delete-btn').style.display = 'flex'
          main.appendChild(card)
        }
      })
    } else {
      username.value = ''
      password.value = ''
    }
  }
  return card
}

// Register card component
function registerCardComponent() {
  const card = document.createElement('div')
  card.className = 'card'
  card.className += ' card-auth'
  card.innerHTML = `
    <div class="auth-title">Register</div>

    <form action="" id="reg-form">
      <label for="reg-username">Username</label><br>
      <input type="text" id="reg-username"><br>
      <label for="reg-password">Password</label><br>
      <input type="password" id="reg-password"><br>
      <button class="button btn-glass">Register</button>
    </form>
  `
  const username = card.querySelector('#reg-username')
  const password = card.querySelector('#reg-password')
  const regForm = card.querySelector('#reg-form')

  regForm.addEventListener('submit', (e) => {
    e.preventDefault()
    register()
  })

  function register() {
    const foundUser = users.find(user => username.value === user.username)
    if (!foundUser) {
      // if username and password contain at least 3 chars, then create a user
      if (username.value.length > 2 && password.value.length > 2) {
        signedBtnSet()
        const newUser = {
          username: username.value,
          password: password.value,
        }
        // Add user to array to local storage
        users.push(newUser)
        writeToLocalstorage('users', users)
  
        insertBlogComponent(newUser)
      } else {
        main.innerHTML = ``
        main.innerHTML = `
        <div class="card">
          <p class="warning">* Username and Password must be 3 or more characters</p>
        </div>
        `
        // Back to main screen after n milliseconds
        setTimeout(() => { window.location.href = "index.html"; }, 3000)
      }
    } else {
      main.innerHTML = `
      <div class="card">
        <p class="warning">* Username already registered. Please proceed to Login page</p>
      </div>
      `
      setTimeout(() => { window.location.href = "index.html"; }, 3000)
    }
  }
  return card
}

function footerComponent() {
  const footer = document.createElement('footer')
  footer.className = 'footer'
  footer.innerHTML = `
    <br><br><hr><br>
    &copy; ${new Date().getFullYear()} MugMag, Inc.
    <br><br><br>
  `
  return footer
}