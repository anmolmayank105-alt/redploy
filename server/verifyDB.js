const mongoose = require('mongoose');
const dbService = require('./services/db');
const User = require('./models/User');
const Alumni = require('./models/Alumni');
const College = require('./models/College');

async function verifyDatabase() {
  try {
    // Connect to database
    await dbService.connect(process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.ntrwp.mongodb.net/redploy');
    
    console.log('🔍 DATABASE VERIFICATION');
    console.log('========================');
    
    // Count documents
    const collegeCount = await College.countDocuments();
    const userCount = await User.countDocuments();
    const alumniCount = await Alumni.countDocuments();
    
    console.log(`📊 Document Counts:`);
    console.log(`   🏫 Colleges: ${collegeCount}`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🎓 Alumni Profiles: ${alumniCount}`);
    
    // Check Netaji Subhash Engineering College specifically
    const netajiCollege = await College.findOne({name: 'Netaji Subhash Engineering College'});
    if (netajiCollege) {
      const netajiStudents = await User.countDocuments({collegeId: netajiCollege._id, role: 'student'});
      const netajiAlumni = await User.countDocuments({collegeId: netajiCollege._id, role: 'alumni'});
      const netajiAdmins = await User.countDocuments({collegeId: netajiCollege._id, role: 'admin'});
      const netajiAlumniProfiles = await Alumni.countDocuments({collegeId: netajiCollege._id});
      
      console.log(`\n🏫 Netaji Subhash Engineering College:`);
      console.log(`   👨‍🎓 Students: ${netajiStudents}`);
      console.log(`   🎓 Alumni: ${netajiAlumni}`);
      console.log(`   👨‍💼 Admins: ${netajiAdmins}`);
      console.log(`   📋 Alumni Profiles: ${netajiAlumniProfiles}`);
    }
    
    // Sample alumni profiles
    const sampleAlumniProfiles = await Alumni.find().populate('collegeId', 'name').limit(3);
    if (sampleAlumniProfiles.length > 0) {
      console.log(`\n📋 Sample Alumni Profiles:`);
      sampleAlumniProfiles.forEach((alumni, index) => {
        console.log(`   ${index + 1}. ${alumni.firstName} ${alumni.lastName}`);
        console.log(`      🏫 College: ${alumni.collegeId?.name || 'N/A'}`);
        console.log(`      🎓 Graduation: ${alumni.graduationYear} - ${alumni.degree}`);
        console.log(`      💼 Current Job: ${alumni.currentJob}`);
        console.log(`      🏆 Achievements: ${alumni.achievements}`);
        console.log(`      🔗 LinkedIn: ${alumni.linkedin}`);
        console.log('');
      });
    }
    
    // Check user roles distribution
    const studentCount = await User.countDocuments({role: 'student'});
    const adminCount = await User.countDocuments({role: 'admin'});
    const totalAlumniUsers = await User.countDocuments({role: 'alumni'});
    
    console.log(`📈 User Role Distribution:`);
    console.log(`   👨‍🎓 Students: ${studentCount}`);
    console.log(`   🎓 Alumni: ${totalAlumniUsers}`);
    console.log(`   👨‍💼 Admins: ${adminCount}`);
    
    console.log(`\n✅ Database verification completed successfully!`);
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
  } finally {
    await dbService.disconnect();
  }
}

verifyDatabase();