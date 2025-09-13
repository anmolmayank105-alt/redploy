const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const College = require('./models/College');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for extended seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Extended sample data
const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Priya', 'Kavya', 'Anika', 'Isha', 'Myra', 'Sara', 'Riya', 'Pari',
  'Rahul', 'Amit', 'Rohit', 'Vikram', 'Suresh', 'Rajesh', 'Deepak', 'Manoj', 'Sanjay', 'Arun',
  'Sunita', 'Meera', 'Pooja', 'Neha', 'Kavita', 'Sita', 'Geeta', 'Rekha', 'Usha', 'Shanti',
  'Akash', 'Varun', 'Karan', 'Rohan', 'Nikhil', 'Ashish', 'Gaurav', 'Harsh', 'Rishabh', 'Shubham',
  'Shreya', 'Anjali', 'Divya', 'Swati', 'Richa', 'Simran', 'Nisha', 'Sakshi', 'Kirti', 'Vidya',
  'Abhishek', 'Saurabh', 'Naveen', 'Praveen', 'Vikas', 'Vishal', 'Ravi', 'Sandeep', 'Ajay', 'Vinay',
  'Preeti', 'Shikha', 'Pallavi', 'Manisha', 'Sonam', 'Kritika', 'Megha', 'Renu', 'Vandana', 'Nidhi',
  'Prakash', 'Dinesh', 'Mahesh', 'Naresh', 'Jitesh', 'Mukesh', 'Ramesh', 'Sunil', 'Anil', 'Kapil',
  'Mamta', 'Seema', 'Sunita', 'Anita', 'Rita', 'Sushma', 'Poonam', 'Kiran', 'Jyoti', 'Bharti'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Mishra', 'Jain', 'Agarwal',
  'Banerjee', 'Chakraborty', 'Das', 'Roy', 'Ghosh', 'Sen', 'Mukherjee', 'Bose', 'Dutta', 'Pal',
  'Reddy', 'Rao', 'Naidu', 'Prasad', 'Raju', 'Krishnan', 'Iyer', 'Nair', 'Pillai', 'Menon',
  'Aggarwal', 'Arora', 'Bhatia', 'Chopra', 'Dhawan', 'Goel', 'Kalra', 'Kapoor', 'Khanna', 'Malhotra',
  'Mehta', 'Modi', 'Pandey', 'Saxena', 'Shukla', 'Srivastava', 'Tiwari', 'Tripathi', 'Upadhyay', 'Varma',
  'Bhatt', 'Joshi', 'Thakur', 'Pandit', 'Dubey', 'Pathak', 'Chandra', 'Sinha', 'Nath', 'Sahni'
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com', 'protonmail.com', 'icloud.com'];

const customColleges = [
  'St. Xavier\'s College Mumbai',
  'Lady Shri Ram College Delhi',
  'Presidency College Chennai',
  'Ferguson College Pune',
  'Hindu College Delhi',
  'Miranda House Delhi',
  'Loyola College Chennai',
  'Christ University Bangalore',
  'Ramjas College Delhi',
  'Hansraj College Delhi',
  'SRCC Delhi',
  'Stella Maris College Chennai',
  'Mount Carmel College Bangalore',
  'Wilson College Mumbai',
  'Sophia College Mumbai',
  'Elphinstone College Mumbai',
  'Government College Chandigarh',
  'DAV College Chandigarh',
  'Khalsa College Delhi',
  'Kirori Mal College Delhi'
];

// Generate random data
const generateRandomEmail = (firstName, lastName) => {
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 10000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
};

const generateRandomUser = (collegeId, role, customCollege = null) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    name: `${firstName} ${lastName}`,
    email: generateRandomEmail(firstName, lastName),
    password: 'password123', // Will be hashed by the model
    role: role,
    collegeId: customCollege ? null : collegeId,
    customCollegeName: customCollege || null,
    isActive: true
  };
};

// Enhanced seed function
const seedLargeDatabase = async () => {
  try {
    console.log('🌱 Starting EXTENDED database seeding (1000+ users)...');
    
    // Get existing colleges
    const colleges = await College.find({});
    console.log(`📚 Found ${colleges.length} colleges in database`);
    
    if (colleges.length === 0) {
      console.log('❌ No colleges found. Please run the basic seed script first.');
      process.exit(1);
    }
    
    console.log('👥 Generating large dataset of users...');
    const usersToInsert = [];
    
    // Generate users for each college
    for (const college of colleges) {
      // Generate 40-60 students per college
      const studentCount = Math.floor(Math.random() * 21) + 40; // 40-60 students
      for (let i = 0; i < studentCount; i++) {
        usersToInsert.push(generateRandomUser(college._id, 'student'));
      }
      
      // Generate 30-50 alumni per college
      const alumniCount = Math.floor(Math.random() * 21) + 30; // 30-50 alumni
      for (let i = 0; i < alumniCount; i++) {
        usersToInsert.push(generateRandomUser(college._id, 'alumni'));
      }
      
      // Generate 2-4 admins per college
      const adminCount = Math.floor(Math.random() * 3) + 2; // 2-4 admins
      for (let i = 0; i < adminCount; i++) {
        usersToInsert.push(generateRandomUser(college._id, 'admin'));
      }
    }
    
    // Add users with custom college names (100 users)
    for (let i = 0; i < 100; i++) {
      const randomRole = ['student', 'alumni'][Math.floor(Math.random() * 2)];
      const randomCustomCollege = customColleges[Math.floor(Math.random() * customColleges.length)];
      usersToInsert.push(generateRandomUser(null, randomRole, randomCustomCollege));
    }
    
    // Insert users in batches to avoid memory issues
    console.log(`👤 Inserting ${usersToInsert.length} users in batches...`);
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < usersToInsert.length; i += batchSize) {
      const batch = usersToInsert.slice(i, i + batchSize);
      try {
        await User.insertMany(batch);
        insertedCount += batch.length;
        console.log(`   ✅ Inserted batch: ${insertedCount}/${usersToInsert.length} users`);
      } catch (error) {
        console.error(`   ❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        // Continue with next batch
      }
    }
    
    // Get final statistics
    const finalStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalUsers = await User.countDocuments();
    const totalColleges = await College.countDocuments();
    const customCollegeUsers = await User.countDocuments({ customCollegeName: { $ne: null } });
    
    console.log('\n📊 EXTENDED SEEDING SUMMARY:');
    console.log(`🏫 Colleges: ${totalColleges}`);
    console.log(`👥 Total Users: ${totalUsers}`);
    
    finalStats.forEach(stat => {
      console.log(`   ${stat._id === 'student' ? '👨‍🎓' : stat._id === 'alumni' ? '🎓' : '👨‍💼'} ${stat._id}: ${stat.count}`);
    });
    
    console.log(`🏛️ Custom College Users: ${customCollegeUsers}`);
    
    // Sample college statistics
    console.log('\n📈 Sample College Statistics:');
    for (let i = 0; i < Math.min(3, colleges.length); i++) {
      const college = colleges[i];
      const collegeStudents = await User.countDocuments({ collegeId: college._id, role: 'student' });
      const collegeAlumni = await User.countDocuments({ collegeId: college._id, role: 'alumni' });
      const collegeAdmins = await User.countDocuments({ collegeId: college._id, role: 'admin' });
      
      console.log(`   🏫 ${college.name}:`);
      console.log(`      👨‍🎓 Students: ${collegeStudents}`);
      console.log(`      🎓 Alumni: ${collegeAlumni}`);
      console.log(`      👨‍💼 Admins: ${collegeAdmins}`);
    }
    
    console.log('\n🎉 EXTENDED DATABASE SEEDING COMPLETED!');
    console.log(`📊 Successfully created ${totalUsers} users across ${totalColleges} colleges`);
    console.log('\n📝 Test Login Credentials:');
    console.log('Email: Any generated email from the database');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Error during extended seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the extended seeding
const runExtendedSeed = async () => {
  await connectDB();
  await seedLargeDatabase();
};

// Execute if run directly
if (require.main === module) {
  runExtendedSeed();
}

module.exports = { runExtendedSeed };