const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const College = require('./models/College');

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const userCount = await User.countDocuments();
    const collegeCount = await College.countDocuments();
    
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`🏫 Total Colleges: ${collegeCount}`);
    
    // Check user roles distribution
    const studentCount = await User.countDocuments({ role: 'student' });
    const alumniCount = await User.countDocuments({ role: 'alumni' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const customCollegeCount = await User.countDocuments({ customCollegeName: { $ne: null } });
    
    console.log(`👨‍🎓 Students: ${studentCount}`);
    console.log(`🎓 Alumni: ${alumniCount}`);
    console.log(`👨‍💼 Admins: ${adminCount}`);
    console.log(`🏛️ Custom College Users: ${customCollegeCount}`);
    
    // Sample user data
    const sampleUser = await User.findOne().populate('collegeId');
    if (sampleUser) {
      console.log('\n📋 Sample User:');
      console.log(`Name: ${sampleUser.name}`);
      console.log(`Email: ${sampleUser.email}`);
      console.log(`Role: ${sampleUser.role}`);
      console.log(`College: ${sampleUser.collegeId ? sampleUser.collegeId.name : sampleUser.customCollegeName || 'None'}`);
    }
    
    // Sample college data
    const sampleCollege = await College.findOne();
    if (sampleCollege) {
      console.log('\n🏫 Sample College:');
      console.log(`Name: ${sampleCollege.name}`);
      console.log(`Address: ${sampleCollege.address}`);
      console.log(`Description: ${sampleCollege.description.substring(0, 50)}...`);
    }
    
    console.log('\n✅ Database verification completed');
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkDatabase();