import pkg from 'pg'
const {
   Pool
} = pkg

const config = {
   user: process.env.DB_USER || "postgres",
   password: process.env.DB_PASSWORD || "111",
   host: process.env.DB_HOST || "localhost",
   port: process.env.DB_PORT || 5432,
   database: process.env.DB_DB || "ttApp"
}
const pool = new Pool(config)
pool.on('connect', connection => {
   // console.log('||||||||||||||||||||||||||||')
   // console.log('----------------------------')
   // console.log('new connection to postgress')
   // console.log(pool.idleCount, 'pool.idleCount')
   // console.log(pool.totalCount, 'pool.totalCount')
   // console.log(pool.waitingCount, 'pool.waitingCount')
   // console.log('----------------------------')
   // console.log('||||||||||||||||||||||||||||')
})
export default pool


// Setup for VDS server
// ||||||||
// \/\/\/\/

// import pkg from 'pg'
// const { Pool } = pkg


// const config = {
//    user: process.env.DB_USER || "postgres",
//    password: process.env.DB_PASSWORD || "1111",
//    host: process.env.DB_HOST || "localhost",
//    port: process.env.DB_PORT || 5432,
//    database: process.env.DB_DB || "ttapp"
// }

// const pool = new Pool(config)
// export default pool
