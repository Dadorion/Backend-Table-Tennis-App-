import crypto from 'crypto'

// Генерируем случайный байтовый ключ
const randomBytes = crypto.randomBytes(32) // 32 байта (256 бит)
const secretKey = randomBytes.toString('hex') // Преобразуем в шестнадцатеричную строку

console.log('Сгенерированный секретный ключ:', secretKey)
