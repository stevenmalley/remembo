module.exports = pool => ({

  async getQuizzes(){
    const response = await pool.query(`SELECT * FROM quizzes WHERE public = TRUE ORDER BY name`);
    return response.rows;
  },

  async getPrivateQuizzes(username){
    const ownerResponse = await pool.query(`SELECT id FROM users WHERE username = '${username}'`);
    const response = await pool.query(`SELECT id, name, description FROM quizzes WHERE public = FALSE AND owner = ${ownerResponse.rows[0].id} ORDER BY name`);
    return response.rows;
  },

  async getQuiz(id) {
    const quizResponse = await pool.query(`SELECT * FROM quizzes WHERE id = ${id}`);
    if (quizResponse.rows.length === 0) return {notFound:true};
    const ownerResponse = await pool.query(`SELECT username FROM users WHERE id = ${quizResponse.rows[0].owner}`);
    const factResponse = await pool.query(`SELECT * FROM facts WHERE quiz_id = ${id} ORDER BY order_number`);
    return {
      data:{...quizResponse.rows[0],owner:ownerResponse.rows[0].username}, // replace owner id with owner name
      facts:factResponse.rows
    };
  },

  async saveQuiz(quiz) {
    const ownerResponse = await pool.query(`SELECT id FROM users WHERE username = '${quiz.data.owner}'`);
    const quizResponse = await pool.query(`INSERT INTO quizzes (owner,name,description,public) VALUES (${ownerResponse.rows[0].id},'${quiz.data.name}','${quiz.data.description}',FALSE) RETURNING id`);
    const quizID = quizResponse.rows[0].id;
    const valuesString = quiz.facts.map((fact,i) => `(${quizID},'${fact.text}','${fact.hint}',${i},'${fact.info}')`).join(", ");
    await pool.query(`INSERT INTO facts (quiz_id,text,hint,order_number,info) VALUES `+valuesString);
    return quizID;
  },

  async modifyQuiz(quiz) {
    await pool.query(`UPDATE quizzes SET name = '${quiz.data.name}', description = '${quiz.data.description}' WHERE id = ${quiz.data.id}`);
    await pool.query(`DELETE FROM facts WHERE quiz_id = ${quiz.data.id}`);
    const valuesString = quiz.facts.map((fact,i) => `(${quiz.data.id},'${fact.text}','${fact.hint}',${i},'${fact.info}')`).join(", ");
    await pool.query(`INSERT INTO facts (quiz_id,text,hint,order_number,info) VALUES `+valuesString);
    return true;
  },

  async deleteQuiz(quizID) {
    await pool.query(`DELETE FROM facts WHERE quiz_id = ${quizID}`);
    return pool.query(`DELETE FROM quizzes WHERE id = ${quizID}`);
  },

  async publishQuiz(quizID) {
    return pool.query(`UPDATE quizzes SET public = TRUE WHERE id = ${quizID}`);
  },

  async unpublishQuiz(quizID) {
    return pool.query(`UPDATE quizzes SET public = FALSE WHERE id = ${quizID}`);
  },

  async confirmOwnership(username,quizID) {
    const ownerResponse = await pool.query(`SELECT id FROM users WHERE username = '${username}'`);
    const quizResponse = await pool.query(`SELECT owner FROM quizzes WHERE id = ${quizID}`);
    return (ownerResponse.rows[0].id === quizResponse.rows[0].owner);
  },




  async findByUsername(username,cb) {
    const userResponse = await pool.query(`SELECT * FROM users WHERE username = '${username}'`);
    cb(null,userResponse.rows[0]);
  },

  async findById(id,cb) {
    const userResponse = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
    cb(null,userResponse.rows[0]);
  },

  async register(username,password) {
    const userResponse = await pool.query(`SELECT * FROM users WHERE username = '${username}'`);
    if (userResponse.rows.length === 0) {
      await pool.query(`INSERT INTO users (username,password) VALUES ('${username}','${password}')`);
      return true;
    } else {
      return false;
    }
  }

});