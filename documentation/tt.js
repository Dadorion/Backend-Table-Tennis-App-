let bool = false
const value = '1982-04-23'
const today = new Date();
const newDate = new Date(value)
if (new Date(value).getTime() < today.getTime()) { bool = true }

console.log(newDate.getTime())
console.log(today.getTime())
console.log(bool)
