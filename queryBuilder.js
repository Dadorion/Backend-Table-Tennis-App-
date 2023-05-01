class Query {
   insert(table, col) {
      let val = []
      if (col) {
         for (let i = 0; i < col.length; i++) { val.push(`$${i + 1}`) }
      }

      const str = `INSERT INTO ${table} (${col}) VALUES (${val}) RETURNING *`

      return str
   }
   selectAll(table) {
      const str = `SELECT * FROM ${table} ORDER BY id DESC`

      return str
   }
   selectID(table) {
      const str = `SELECT * FROM ${table} WHERE id = $1`

      return str
   }
   update(table, col) {
      let val = []
      for (let i = 0; i < col.length; i++) { val.push(`$${i + 1}`) }
      const data = []
      for (let i = 0; i < col.length; i++) {
         data.push(`${col[i]} = ${val[i]}`)
      }

      const str = `UPDATE ${table} SET ${data} WHERE id = $${col.length + 1} RETURNING *`

      return str
   }
   delete(table) {
      const str = `DELETE FROM ${table} WHERE id = $1 RETURNING *`

      return str
   }
}
export default new Query()
