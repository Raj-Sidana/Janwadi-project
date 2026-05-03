require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createTestUser() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = 'testuser@example.com';
  const number = '9876543210';

  const existing = await User.findOne({ $or: [{ email }, { number }] });
  if (existing) {
    console.log('Test user already exists:', {
      email: existing.email,
      number: existing.number,
      name: existing.name,
      id: existing._id.toString(),
    });
    process.exit(0);
  }

  const user = new User({
    name: 'Test User',
    number,
    email,
    state: 'Maharashtra',
    city: 'Mumbai',
    address: '123 Test Street, Mumbai',
    pincode: '400001',
    password: 'TestUser123',
  });

  await user.save();
  console.log('Created test user successfully:');
  console.log({
    email: user.email,
    number: user.number,
    password: 'TestUser123',
    name: user.name,
    id: user._id.toString(),
  });
  process.exit(0);
}

createTestUser().catch(err => {
  console.error('Error creating test user:', err);
  process.exit(1);
});