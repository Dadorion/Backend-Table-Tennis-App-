import pool from '../database.js'
import requestsBuilder from '../dataBuilders/requestsBuilder.js'
import builderQuerySQL from './builderSQL.js'

class MainService {
   async getAll(date, status, teacherIds, studentsCount, page, lessonsPerPage) {
      // FIXME: в данный момент запрос может возвращать не лимит 5 занятий, а лимит 5 строк из БД

      class Filter {
         constructor(page, lessonsPerPage) {
            this.page = `page = ${page}`
            this.lessonsPerPage = `lessonsPerPage = ${lessonsPerPage}`
         }
      }

      class FilterBuilder {
         constructor(page, lessonsPerPage) {
            this.filter = new Filter(page, lessonsPerPage)
         }

         setDate(date) {
            let dates = date.split(","), d1 = '', d2 = ''
            if (dates[1]) {
               d1 = dates[0]
               d2 = dates[1]
            } else {
               d1 = dates[0]
               d2 = dates[0]
            }

            this.filter.strDate = `date BETWEEN DATE '${d1}' AND DATE '${d2}'`
            return this
         }
         setStatus(status) {
            this.filter.strStatus = `lessons.status = ${status}`
            return this
         }
         setTeacherIds(teacherIds) {
            this.filter.strTeachers = `teachers.id in (${teacherIds})`
            return this
         }
         setStudentsCount(studentsCount) {
            let students = studentsCount.split(","), s1 = '', s2 = ''
            if (students[1]) {
               s1 = students[0]
               s2 = students[1]
            } else {
               s1 = students[0]
               s2 = students[0]
            }
            this.filter.strStudCount = `GROUP BY lessons.id HAVING count(1) >= ${s1} AND count(1) <= ${s2}`
            return this
         }

         build() {
            this.str = ''
            if (this.filter.strDate !== undefined || this.filter.strStatus !== undefined || this.filter.strTeachers !== undefined) this.str += `WHERE `
            let paramsCount = 0
            if (this.filter.strDate !== undefined) { paramsCount > 0 ? this.str += `AND ` : null; this.str += `${this.filter.strDate} `; paramsCount++ }
            if (this.filter.strStatus !== undefined) { paramsCount > 0 ? this.str += `AND ` : null; this.str += `${this.filter.strStatus} `; paramsCount++ }
            if (this.filter.strTeachers !== undefined) { paramsCount > 0 ? this.str += `AND ` : null; this.str += `${this.filter.strTeachers} `; paramsCount++ }

            // if (page > 1) { paramsCount > 0 ? this.str += `AND ` : null; this.str += `lessons.id > 10 `; paramsCount++ } похоже, что здесь это не работает адекватно
            console.log(this)
            // this.str += ``

            if (this.filter.strStudCount !== undefined) this.str += `${this.filter.strStudCount}`
            return this.str
         }
      }

      let filter = new FilterBuilder(page, lessonsPerPage)
      if (date) filter.setDate(date)
      if (status) filter.setStatus(status)
      if (teacherIds) filter.setTeacherIds(teacherIds)
      if (studentsCount) filter.setStudentsCount(studentsCount)
      filter.build()

      const q = builderQuerySQL.createQuery(filter.build(), lessonsPerPage)
      console.log(q)
      const answer = await pool.query(q)

      // const answer = await pool.query(builderQuerySQL.createQuery(filter.build()))
      // const answer = await pool.query(
      //    builderQuerySQL.createQuery(filter.build()),
      //    [d1, d2, status, teacherIds, studentsCount, page, lessonsPerPage])
      // $1 - d1, $2 - d2, $3 - status, $4 - teacherIds, $5 - studentsCount, $6 - page, $7 - lessonPerPage

      // return answer.rows

      const answerLessons = requestsBuilder(answer.rows)
      const totalLessons = await (await pool.query('SELECT count(*) FROM lessons')).rows[0].count
      let result =
      {
         "pagination":
         {
            "lessonsCount": answerLessons.length,
            "totalLessons": totalLessons,
            "totalPages": Math.round(totalLessons / lessonsPerPage),
            "currentPage": page,
            "perPage": lessonsPerPage,
            "maxPerPage": 100,
         },

         "body": [...answerLessons]
      }

      return result
   }
}

export default new MainService()
