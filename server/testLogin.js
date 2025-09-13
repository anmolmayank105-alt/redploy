const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testUserLogin() {
  try {
    // Connect to database using the same URI as server
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    
    console.log('🔍 Testing user login functionality...');
    
    // Find testuser@example.com
    const testUser = await User.findOne({ email: 'testuser@example.com' });
    console.log('Test user found:', testUser ? 'YES' : 'NO');
    
    if (testUser) {
      console.log('Test user details:');
      console.log('  Name:', testUser.name);
      console.log('  Email:', testUser.email);
      console.log('  Role:', testUser.role);
      console.log('  Active:', testUser.isActive);
      console.log('  College ID:', testUser.collegeId);
      
      // Test password comparison
      const isPasswordValid = await testUser.comparePassword('password123');
      console.log('Password "password123" valid:', isPasswordValid);
    } else {
      console.log('❌ testuser@example.com not found in database');
      
      // Find any user for testing
      const anyUser = await User.findOne({ role: 'student' }).limit(1);
      if (anyUser) {
        console.log('\n📋 Sample student user found for testing:');
        console.log('  Name:', anyUser.name);
        console.log('  Email:', anyUser.email);
        console.log('  Role:', anyUser.role);
        console.log('  Active:', anyUser.isActive);
        
        // Test with this user's credentials
        const isPasswordValid = await anyUser.comparePassword('password123');
        console.log('  Password "password123" valid:', isPasswordValid);
      }
    }
    
    // Count total users
    const totalUsers = await User.countDocuments();
    const studentUsers = await User.countDocuments({ role: 'student' });
    console.log('\n📊 Total users in database:', totalUsers);
    console.log('📊 Student users:', studentUsers);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

testUserLogin();