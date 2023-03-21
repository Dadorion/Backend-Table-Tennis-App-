import pkg from 'pg'

const { Client } = pkg

const config = {
   user: "postgres",
   password: "1111",
   host: "localhost",
   port: 5432,
   database: "ttStHoper"
}

const client = new Client(config)

export default client