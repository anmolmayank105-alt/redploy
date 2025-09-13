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
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Sample data
const collegesData = [
  {
    name: 'Netaji Subhash Engineering College',
    location: 'Kolkata, West Bengal',
    address: 'Techno City, Rajarhat, Kolkata, West Bengal 700152',
    description: 'Premier engineering college known for excellence in technical education and research',
    type: 'Engineering',
    established: 1960
  },
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi, Delhi',
    address: 'Hauz Khas, New Delhi, Delhi 110016',
    description: 'One of the premier engineering institutes in India, known for cutting-edge research',
    type: 'Engineering',
    established: 1961
  },
  {
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai, Maharashtra',
    address: 'Powai, Mumbai, Maharashtra 400076',
    description: 'Leading technical institute offering undergraduate and postgraduate programs',
    type: 'Engineering',
    established: 1958
  },
  {
    name: 'Indian Institute of Science Bangalore',
    location: 'Bangalore, Karnataka',
    address: 'CV Raman Ave, Bengaluru, Karnataka 560012',
    description: 'Premier institute for advanced scientific and technological research and education',
    type: 'Science & Research',
    established: 1909
  },
  {
    name: 'Delhi University',
    location: 'New Delhi, Delhi',
    address: 'University Enclave, Delhi 110007',
    description: 'Prestigious central university offering diverse academic programs',
    type: 'University',
    established: 1922
  },
  {
    name: 'Jadavpur University',
    location: 'Kolkata, West Bengal',
    address: '188, Raja S.C. Mallick Rd, Kolkata, West Bengal 700032',
    description: 'Renowned state university known for engineering and liberal arts education',
    type: 'University',
    established: 1955
  },
  {
    name: 'Anna University',
    location: 'Chennai, Tamil Nadu',
    address: 'Sardar Patel Rd, Guindy, Chennai, Tamil Nadu 600025',
    description: 'Technical university specializing in engineering and technology education',
    type: 'Engineering',
    established: 1978
  },
  {
    name: 'National Institute of Technology Trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    address: 'National Institute of Technology Campus, Tiruchirappalli, Tamil Nadu 620015',
    description: 'Premier technical institute offering excellent engineering education',
    type: 'Engineering',
    established: 1964
  },
  {
    name: 'Birla Institute of Technology and Science',
    location: 'Pilani, Rajasthan',
    address: 'Vidya Vihar, Pilani, Rajasthan 333031',
    description: 'Private institute known for innovative teaching methods and industry collaboration',
    type: 'Engineering',
    established: 1964
  },
  {
    name: 'Vellore Institute of Technology',
    location: 'Vellore, Tamil Nadu',
    address: 'Tiruvalam Rd, Katpadi, Vellore, Tamil Nadu 632014',
    description: 'Leading private university with focus on engineering and technology',
    type: 'Engineering',
    established: 1984
  }
];

const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Priya', 'Kavya', 'Anika', 'Isha', 'Myra', 'Sara', 'Riya', 'Pari',
  'Rahul', 'Amit', 'Rohit', 'Vikram', 'Suresh', 'Rajesh', 'Deepak', 'Manoj', 'Sanjay', 'Arun',
  'Sunita', 'Meera', 'Pooja', 'Neha', 'Kavita', 'Sita', 'Geeta', 'Rekha', 'Usha', 'Shanti'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Mishra', 'Jain', 'Agarwal',
  'Banerjee', 'Chakraborty', 'Das', 'Roy', 'Ghosh', 'Sen', 'Mukherjee', 'Bose', 'Dutta', 'Pal',
  'Reddy', 'Rao', 'Naidu', 'Prasad', 'Raju', 'Krishnan', 'Iyer', 'Nair', 'Pillai', 'Menon'
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'];

// Generate random data
const generateRandomEmail = (firstName, lastName) => {
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
};

const generateRandomUser = (collegeId, role) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    name: `${firstName} ${lastName}`,
    email: generateRandomEmail(firstName, lastName),
    password: 'password123', // Will be hashed by the model
    role: role,
    collegeId: collegeId,
    customCollegeName: null,
    isActive: true
  };
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await College.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Insert colleges
    console.log('🏫 Inserting colleges...');
    const insertedColleges = await College.insertMany(collegesData);
    console.log(`✅ ${insertedColleges.length} colleges inserted`);
    
    // Generate users for each college
    console.log('👥 Generating users...');
    const usersToInsert = [];
    
    for (const college of insertedColleges) {
      // Generate 3-5 students per college
      const studentCount = Math.floor(Math.random() * 3) + 3; // 3-5 students
      for (let i = 0; i < studentCount; i++) {
        usersToInsert.push(generateRandomUser(college._id, 'student'));
      }
      
      // Generate 2-4 alumni per college
      const alumniCount = Math.floor(Math.random() * 3) + 2; // 2-4 alumni
      for (let i = 0; i < alumniCount; i++) {
        usersToInsert.push(generateRandomUser(college._id, 'alumni'));
      }
      
      // Generate 1 admin per college
      usersToInsert.push(generateRandomUser(college._id, 'admin'));
    }
    
    // Add some users with custom college names
    for (let i = 0; i < 5; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const customColleges = [
        'St. Xavier\'s College Mumbai',
        'Lady Shri Ram College Delhi',
        'Presidency College Chennai',
        'Ferguson College Pune',
        'Hindu College Delhi'
      ];
      
      usersToInsert.push({
        name: `${firstName} ${lastName}`,
        email: generateRandomEmail(firstName, lastName),
        password: 'password123',
        role: Math.random() > 0.5 ? 'student' : 'alumni',
        collegeId: null,
        customCollegeName: customColleges[i],
        isActive: true
      });
    }
    
    // Insert users
    console.log('👤 Inserting users...');
    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`✅ ${insertedUsers.length} users inserted`);
    
    // Display summary
    console.log('\n📊 SEEDING SUMMARY:');
    console.log(`🏫 Colleges: ${insertedColleges.length}`);
    
    const studentCount = insertedUsers.filter(u => u.role === 'student').length;
    const alumniCount = insertedUsers.filter(u => u.role === 'alumni').length;
    const adminCount = insertedUsers.filter(u => u.role === 'admin').length;
    const customCollegeCount = insertedUsers.filter(u => u.customCollegeName).length;
    
    console.log(`👨‍🎓 Students: ${studentCount}`);
    console.log(`🎓 Alumni: ${alumniCount}`);
    console.log(`👨‍💼 Admins: ${adminCount}`);
    console.log(`🏛️ Custom College Users: ${customCollegeCount}`);
    console.log(`👥 Total Users: ${insertedUsers.length}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Login Credentials:');
    console.log('Email: Any generated email from the list above');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

// Execute if run directly
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };