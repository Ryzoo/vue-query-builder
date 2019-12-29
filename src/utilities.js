const deepClone = function (obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepClone)
  } else if (obj && typeof obj === 'object') {
    let cloned = {}

    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })

    return cloned
  } else {
    return obj
  }
}

export default deepClone;