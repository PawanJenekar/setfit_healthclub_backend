const db = require('./Config/db.config');
const app = require('./src/app');

const port = process.env.PORT || 3000;

db.query('SELECT NOW()')
  .then(() => {
    console.log('PostgreSQL Connected');
  })
  .catch((err) => {
    console.log('DB Connection Error:', err);
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});