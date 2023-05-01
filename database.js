// import pkg from 'pg'
// const { Pool } = pkg

// const config = {
//    user: "postgres",
//    password: "1111",
//    host: "localhost",
//    port: 5432,
//    database: "ttStHoper"
// }
// const pool = new Pool(config)
// export default pool


// Setup for VDS server
// ||||||||
// \/\/\/\/

import pkg from 'pg'
const { Pool } = pkg


const config = {
   user: "postgres",
   password: "post15",
   host: "tabten.ru",
   port: 5432,
   database: "ttapp"
}

const pool = new Pool(config)
export default pool
