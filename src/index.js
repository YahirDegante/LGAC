const { app } = require('./config/express');
const { startConnection } = require('./utils/database');

const main = () => {
  app.listen(app.get('port'));
  console.log(`
  ------------------------------
   Cenidet server is running in              
    http://localhost:${app.get('port')}/     
  ------------------------------
  `);
}

main();
startConnection();