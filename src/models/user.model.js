const db = require('../../Config/db.config');

module.exports = {
  async findAll() {
    const { rows } = await db.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    return rows;
  },

  async create({ name, email }) {
    const { rows } = await db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
      [name, email]
    );
    return rows[0];
  },
};
