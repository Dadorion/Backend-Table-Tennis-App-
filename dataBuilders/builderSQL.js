class builderQuerySQL {
   createQuery(filter, lessonsPerPage) {
      // const qFilter =
      //    `
      //    SELECT
      //       lessons.id
      //    FROM
      //       lessons
      //       JOIN lesson_teachers on lesson_teachers.lesson_id = lessons.id
      //       JOIN lesson_students on lesson_students.lesson_id = lessons.id
      //       JOIN teachers on lesson_teachers.teacher_id = teachers.id
      //       JOIN students on lesson_students.student_id = students.id
      //    ${filter}
      //    `

      const q =
         `
         SELECT
            matches.id,
            matches.date,
            is_important,
            locations.name as location,
            matches.first_player as author,
            players.id as player_id,
            players.name,
            games.fp_score,
            games.sp_score
            -- *
         FROM
            matches
            join players_matches on matches.id = players_matches.match_id
            join players on players.id = players_matches.player_id
            join locations on locations.id = matches.location_id
            join games on games.match_id = matches.id
         WHERE
            matches.first_player = 19
         ORDER BY
            matches.id
         -- LIMIT ${lessonsPerPage}
         `
      // лимит ограничивает количество строк, а не матчей
      // `
      // SELECT
      //    lessons.id AS lesson_id,
      //    date,
      //    title,
      //    students.id AS student_id,
      //    students.name AS student_name,
      //    teachers.id AS teacher_id,
      //    teachers.name AS teacher_name,
      //    visit,
      //    status
      // FROM
      //    lessons
      //    JOIN lesson_teachers on lesson_teachers.lesson_id = lessons.id
      //    JOIN lesson_students on lesson_students.lesson_id = lessons.id
      //    JOIN teachers on lesson_teachers.teacher_id = teachers.id
      //    JOIN students on lesson_students.student_id = students.id
      // WHERE
      //    lessons.id IN (${qFilter})

      // ORDER BY lessons.id ASC
      // LIMIT ${lessonsPerPage}
      // `
      return q
   }
}

export default new builderQuerySQL()


