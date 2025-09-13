const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function addTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if testuser already exists
    const existing = await User.findOne({ email: 'testuser@example.com' });
    if (existing) {
      console.log('Test user already exists:', existing.email);
      return;
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'student',
      isActive: true,
      collegeId: null,
      customCollegeName: 'Demo College'
    });
    await testUser.save();
    console.log('✅ Test user created:', testUser.email);
  } catch (err) {
    console.error('❌ Error creating test user:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

addTestUser();