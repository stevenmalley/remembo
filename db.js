

module.exports = pool => ({

  async getQuizzes(){
    const response = await pool.query(`SELECT * FROM quizzes WHERE public = TRUE`);
    return {quizzes:response.rows};
  },

  async getQuiz(id) {
    const quizResponse = await pool.query(`SELECT * FROM quizzes WHERE id = ${id}`);
    const ownerResponse = await pool.query(`SELECT username FROM users WHERE id = ${quizResponse.rows[0].owner}`);
    const factResponse = await pool.query(`SELECT * FROM facts WHERE quiz_id = ${id}`);
    return {
      data:{...quizResponse.rows[0],owner:ownerResponse.rows[0].username}, // replace owner_id with owner name
      facts:factResponse.rows
    };
  },

});