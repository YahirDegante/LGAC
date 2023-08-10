const { connect } = require('mongoose');

const mongoURI = 'mongodb+srv://Yahir:Yahir1234@cluster0.vbtbdwu.mongodb.net/CENIDET';
const startConnection = async () => {
  try {
    console.log('Connecting to CENIDET database...');
    await connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('CENIDET database is connected');
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  mongoURI,
  startConnection,
};