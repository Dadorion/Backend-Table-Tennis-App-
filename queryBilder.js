class Query {

   constructor(options) {
      const { table, values } = options
      const columns = []
      if (values) {
         for (let i = 0; i < values.length; i++) { columns.push(`$${i + 1}`) }
      }


      switch (options.type) {
         case 'INSERT':
            this.queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *`
            break;
         case 'SELECT ALL':
            this.queryString = `SELECT * FROM ${table} ORDER BY id DESC`
            break;
         case 'SELECT ID':
            this.queryString = `SELECT * FROM ${table} WHERE id = ${columns}`
            break;
         case 'UPDATE':
            const data =
               this.queryString = `UPDATE ${table} SET fp_user_id = $1, sp_user_id = $2, date = $3, tournament_id = $4, location_id = $5, winner = $6 WHERE id = $7 RETURNING *`
            break;
         default:
            break;
      }



   }

   // insertItem(options) {
   //    console.log(options)
   //    const { table, values } = options
   //    const columns = []

   //    for (let i = 0; i < values.length; i++) { columns.push(`$${i + 1}`) }

   //    const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *`
   //    // console.log(queryString)
   //    return queryString
   //    return options
   // }
}





// export default new Query()
// const query = new Query({ type: 'INSERT', table: 'table', values: ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'] })
// const query = new Query({ type: 'SELECT ALL', table: 'table' })
// const query = new Query({ type: 'SELECT ID', table: 'table', values: [1] })
const query = new Query({ type: 'UPDATE', table: 'table', values: [1] })
console.log(query.queryString)