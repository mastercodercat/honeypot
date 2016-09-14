export function format2Digits(n) {
  return n >= 10 ? n : '0' + n
}

export function nth(n) {
  const m = n % 10
  const t = n / 10
  if (t == 1) {
    return 'th'
  }
  if (m == 1) {
    return 'st'
  }
  if (m == 2) {
    return 'nd'
  }
  if (m == 3) {
    return 'rd'
  }
  return 'th'
}

export function formatDate(date = null, includeTime = true) {
  const _date = date ? new Date(date) : new Date()
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ]
  const day = _date.getDate()
  const monthIndex = _date.getMonth()
  const year = _date.getFullYear()
  let formattedDate = ''
  formattedDate += monthNames[monthIndex] + ' ' + day + ', ' + year
  if (includeTime) {
    formattedDate += ' '
    formattedDate += format2Digits(_date.getHours()) + ':'
    formattedDate += format2Digits(_date.getMinutes()) + ':'
    formattedDate += format2Digits(_date.getSeconds())
  }
  return formattedDate
}

export function formatDate2(date = null, includeTime = true) {
  const _date = date ? new Date(date) : new Date()
  const day = _date.getDate()
  const month = _date.getMonth()
  const year = _date.getFullYear()
  let formattedDate = ''
  formattedDate += format2Digits(month) + '/'
  formattedDate += format2Digits(day) + '/'
  formattedDate += year
  if (includeTime) {
    formattedDate += ' '
    formattedDate += format2Digits(_date.getHours()) + ':'
    formattedDate += format2Digits(_date.getMinutes())
  }
  return formattedDate
}
