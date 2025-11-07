const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // eslint-disable-next-line no-console
    console.error('Missing MONGODB_URI in environment');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // eslint-disable-next-line no-console
    console.log('MongoDB connected (Koa)');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;


