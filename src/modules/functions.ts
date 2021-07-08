import { User, Newsfeed } from './interfaces.js'

// Local Storage Utilities
export const writeToLocalstorage = (name: string, list: any) => {
  localStorage.setItem(name, JSON.stringify(list))
}

export const readFromLocalstorage = (name: string) => {
  return JSON.parse(localStorage.getItem(name)!)
}

// Fetch data from Local Storage, fill with samples if empty
export const fetchLocalData = (type: string, list: any) => {
  const usersStored = readFromLocalstorage(type)
  if (!usersStored) {
    writeToLocalstorage(type, list)
    return readFromLocalstorage(type)
  } else {
    return usersStored
  }
}

export function timeFormat(ms: number) {
  const now = Date.now()
  let date: string
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
