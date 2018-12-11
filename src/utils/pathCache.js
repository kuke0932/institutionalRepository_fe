const key = 'pathCache_'

export function getPathCache(path) {
  return window.sessionStorage.getItem(key + path)
}

export function setPathCache(path, name) {
  return window.sessionStorage.setItem(key + path, name)
}

export function removePathCache(path) {
  return window.sessionStorage.removeItem(key + path)
}
