/*
  If you remove all sample cards and would want to reinsert them back:
  in the local storage container of you browser choose this app's url
  find newsfeed property, then delete it.
  App will reinsert sample data on reload
*/

// Sample users data
const fill_users = [
  { username: 'rus', password: 'asdf' },
  { username: 'tom', password: 'asdf' },
  { username: 'sam', password: 'asdf' },
]

// Sample newsfeed data
const fill_newsfeed = [
  {
    username: 'rus',
    date: 1609681482866,
    img: 'https://images.unsplash.com/photo-1595540053711-28d0413e0f66?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDIzfHJuU0tESHd3WVVrfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    timeline: 'Rus is fine with programming. It works out wonderfully for him. Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably.',
  },
  {
    username: 'sam',
    date: 1609581462866,
    img: 'https://images.unsplash.com/photo-1608819296683-bab8d5c7b178?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDI0fHJuU0tESHd3WVVrfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    timeline: 'Dancing with Sam is always pleasantfor him. Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably.',
  },
  {
    username: 'tom',
    date: 1609681452866,
    img: 'https://images.unsplash.com/photo-1608634769432-f9b6524aa2bf?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fGJvOGpRS1RhRTBZfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    timeline: 'Tom will fly to Spain in a few months fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably.',
  },
  {
    username: 'sam',
    date: 1609681502866,
    img: 'https://images.unsplash.com/photo-1594842084112-fe6d71906449?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDI5fGJvOGpRS1RhRTBZfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    timeline: 'Out wonderfully for him. Folly words widow one downs few age every seven. If miss part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably.',
  },
  {
    username: 'rus',
    date: 1608671422866,
    img: 'https://images.unsplash.com/photo-1573592234083-c0b2fbda21bb?ixid=MXwxMjA3fDB8MHx0b3BpYy1mZWVkfDMzfGJvOGpRS1RhRTBZfHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
    timeline: 'Rus is part by fact he park just shew. Discovered had get considered projection who favourable. Necessary up knowledge it tolerably.',
  },
]

// Local Storage Utilities
const writeToLocalstorage = (name, list) => localStorage.setItem(name, JSON.stringify(list))
const readFromLocalstorage = name => JSON.parse(localStorage.getItem(name))
const writeNreadFromLocalstorage = (name, list) => {
  writeToLocalstorage(name, list)
  return readFromLocalstorage(name)
}

// Load database data to cache arrays. Insert sample data to database if no data present
let users = readFromLocalstorage('users') || writeNreadFromLocalstorage('users', fill_users)
let newsfeed = readFromLocalstorage('newsfeed') || writeNreadFromLocalstorage('newsfeed', fill_newsfeed)