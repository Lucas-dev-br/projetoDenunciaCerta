const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'denunciaCerta',
  password: 'lucas2001',
  port: 5432,
});

async function loginUser(req, res, origin) {
  const { nome, senha } = req.body;

  try {
    const query = 'SELECT * FROM usuario WHERE nome = $1 AND senha = $2';
    const values = [nome, senha];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      // Authentication successful, store user information in session
      if (origin === 'web'){
      req.session.usuario = result.rows[0];
      res.redirect(`/usuario?nome=${nome}`);
      } else {
      req.session.usuario = result.rows[0];
      res.json({ user: result.rows[0], customVariable: true })
      }
    } else {
      // Invalid credentials, redirect to the index page and send an error message as a query parameter
      res.redirect(`/index?error=1`);
    }
  } catch (error) {
    console.error('Error while logging in:', error);
    // Send a generic error message to the client
    res.status(500).send('Error processing the request. Please try again later.');
  }
}

module.exports = {
  loginUser,
};