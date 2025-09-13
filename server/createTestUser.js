const mongoose = require('mongoose');
const User = require('./models/User');
const College = require('./models/College');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    
    // Check if testuser already exists
    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    if (existingUser) {
      console.log('✅ testuser@example.com already exists');
      return;
    }
    
    // Get Netaji Subhash Engineering College
    const netajiCollege = await College.findOne({ name: 'Netaji Subhash Engineering College' });
    if (!netajiCollege) {
      console.log('❌ Netaji Subhash Engineering College not found');
      return;
    }
    
    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123', // This will be hashed automatically
      role: 'student',
      collegeId: netajiCollege._id,
      isActive: true
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('   Email: testuser@example.com');
    console.log('   Password: password123');
    console.log('   Role: student');
    console.log('   College:', netajiCollege.name);
    
    // Test the password
    const savedUser = await User.findOne({ email: 'testuser@example.com' }).select('+password');
    const isPasswordValid = await savedUser.comparePassword('password123');
    console.log('   Password verification:', isPasswordValid ? '✅ VALID' : '❌ INVALID');
    
  } catch (error) {
    console.error('❌ Failed to create test user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

createTestUser();