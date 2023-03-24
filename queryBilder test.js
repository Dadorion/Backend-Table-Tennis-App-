class Query {

   constructor(options) {
      if (options) {
         const { table, col, filterCol } = options

         let val = []
         let filterVal = []
         const filter = []
         const data = []

         if (col) {
            for (let i = 0; i < col.length; i++) { val.push(`$${i + 1}`) }
         }
         if (filterCol) {
            for (let i = 0; i < filterCol.length; i++) { filterVal.push(`$${i + 1}`) }
         }

         switch (options.type) {
            case 'INSERT':
               this.qString = `INSERT INTO ${table} (${col}) VALUES (${val}) RETURNING *`
               break;
            case 'SELECT ALL':
               this.qString = `SELECT * FROM ${table} ORDER BY id DESC`
               break;
            case 'SELECT ID':
               this.qString = `SELECT * FROM ${table} WHERE ${filterCol} = ${filterVal}`
               break;
            case 'UPDATE':
               for (let i = 0; i < col.length; i++) {
                  data.push(`${col[i]} = ${val[i]}`)
               }
               for (let i = 0; i < filterCol.length; i++) {
                  filter.push(`${filterCol[i]} = ${col.length + 1}`)
               }

               this.qString = `UPDATE ${table} SET ${data} WHERE ${filter} RETURNING *`
               break;
            case 'DELETE':

               for (let i = 0; i < filterCol.length; i++) {
                  filter.push(`${filterCol[i]} = ${col.length + 1}`)
               }
               this.qString = `DELETE FROM ${table} WHERE ${filter} RETURNING *`
               break;
            default:
               break;
         }
      }
   }
}
export default new Query()


// console.log(new Query({ type: 'INSERT', table: 'table', col: ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'] }).qString)
// console.log(new Query({ type: 'SELECT ALL', table: 'table', col: [] }).qString)
// console.log(new Query({ type: 'SELECT ID', table: 'table', filterCol: ['id'] }).qString)
// console.log(new Query({ type: 'UPDATE', table: 'table', col: ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'], filterCol: ['id'] }).qString)
// console.log(new Query({ type: 'DELETE', table: 'table', col: ['fp_user_id', 'sp_user_id', 'date', 'tournament_id', 'location_id', 'winner'], filterCol: ['id'] }).qString)
