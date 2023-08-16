class Query {
   insert(table, col) {
      let val = []
      if (col) {
         for (let i = 0; i < col.length; i++) { val.push(`$${i + 1}`) }
      }

      return `INSERT INTO ${table} (${col}) VALUES (${val}) RETURNING *`
   }
   selectAll(table, arrStr) {
      arrStr.length == 0 ? arrStr.push('*') : arrStr
      return `SELECT ${arrStr} FROM ${table} ORDER BY id DESC`
   }
   selectAllPredictive(table, arrStr) {
      arrStr.length == 0 ? arrStr.push('*') : arrStr
      return `SELECT ${arrStr} FROM ${table} WHERE name ILIKE $1 OR surname ILIKE $1`
   }
   selectID(table) { return `SELECT * FROM ${table} WHERE id = $1` }
   update(table, col) {
      let val = []
      for (let i = 0; i < col.length; i++) { val.push(`$${i + 1}`) }
      const data = []
      for (let i = 0; i < col.length; i++) {
         data.push(`${col[i]} = ${val[i]}`)
      }
      return `UPDATE ${table} SET ${data} WHERE id = $${col.length + 1} RETURNING *`
   }
   delete(table) { return `DELETE FROM ${table} WHERE id = $1 RETURNING *` }
}
export default new Query()
