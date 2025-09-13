const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const College = require('./models/College');
const Alumni = require('./models/Alumni');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for comprehensive seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Enhanced sample data
const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Priya', 'Kavya', 'Anika', 'Isha', 'Myra', 'Sara', 'Riya', 'Pari',
  'Rahul', 'Amit', 'Rohit', 'Vikram', 'Suresh', 'Rajesh', 'Deepak', 'Manoj', 'Sanjay', 'Arun',
  'Sunita', 'Meera', 'Pooja', 'Neha', 'Kavita', 'Sita', 'Geeta', 'Rekha', 'Usha', 'Shanti',
  'Kiran', 'Anjali', 'Sneha', 'Preeti', 'Ravi', 'Nitin', 'Sachin', 'Prakash', 'Ashok', 'Vinod'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Mishra', 'Jain', 'Agarwal',
  'Banerjee', 'Chakraborty', 'Das', 'Roy', 'Ghosh', 'Sen', 'Mukherjee', 'Bose', 'Dutta', 'Pal',
  'Reddy', 'Rao', 'Naidu', 'Prasad', 'Raju', 'Krishnan', 'Iyer', 'Nair', 'Pillai', 'Menon',
  'Shah', 'Modi', 'Desai', 'Trivedi', 'Chandra', 'Srivastava', 'Tiwari', 'Pandey', 'Shukla', 'Dubey'
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'];

const degrees = [
  'B.Tech Computer Science', 'B.Tech Electronics', 'B.Tech Mechanical', 'B.Tech Civil', 'B.Tech Electrical',
  'M.Tech Computer Science', 'M.Tech Electronics', 'M.Tech Mechanical', 'M.Tech Civil', 'M.Tech Electrical',
  'B.Sc Computer Science', 'B.Sc Physics', 'B.Sc Chemistry', 'B.Sc Mathematics', 'B.Sc Biology',
  'M.Sc Computer Science', 'M.Sc Physics', 'M.Sc Chemistry', 'M.Sc Mathematics', 'M.Sc Biology',
  'MBA', 'MCA', 'B.Com', 'M.Com', 'BCA', 'B.A Economics', 'M.A Economics'
];

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'IBM', 'Oracle', 'Salesforce',
  'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Accenture', 'Capgemini',
  'Flipkart', 'Zomato', 'Paytm', 'Ola', 'Uber', 'Swiggy', 'PhonePe', 'BYJU\'S',
  'Reliance', 'Tata Group', 'Adani Group', 'Bajaj', 'Mahindra', 'L&T', 'Godrej',
  'ISRO', 'DRDO', 'BARC', 'HAL', 'BHEL', 'ONGC', 'NTPC', 'Coal India'
];

const jobTitles = [
  'Software Engineer', 'Senior Software Engineer', 'Lead Software Engineer', 'Principal Engineer',
  'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Product Manager', 'Technical Lead',
  'System Administrator', 'Network Engineer', 'Cybersecurity Analyst', 'Cloud Architect',
  'Business Analyst', 'Project Manager', 'Scrum Master', 'Team Lead', 'Director',
  'VP Engineering', 'CTO', 'CEO', 'Founder', 'Co-founder', 'Research Scientist',
  'Professor', 'Assistant Professor', 'Lecturer', 'Researcher', 'Consultant'
];

const achievements = [
  'Best Employee Award 2023', 'Innovation Excellence Award', 'Patent holder for AI technology',
  'Published 15+ research papers', 'Led team of 50+ engineers', 'Built product used by 10M+ users',
  'Startup founder with $50M valuation', 'TEDx Speaker', 'Open source contributor',
  'Google Developer Expert', 'Microsoft MVP', 'AWS Solutions Architect',
  'Mentored 100+ junior developers', 'Published technical book', 'Conference speaker',
  'Hackathon winner', 'Forbes 30 Under 30', 'Women in Tech Award', 'Excellence in Research',
  'Industry Leadership Award', 'Community Service Recognition', 'Technical Innovation Prize'
];

// Generate random data functions
const generateRandomEmail = (firstName, lastName) => {
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
};

const generateLinkedInProfile = (firstName, lastName) => {
  return `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 999)}`;
};

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateRandomUser = (collegeId, role, collegeName) => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  
  return {
    name: `${firstName} ${lastName}`,
    email: generateRandomEmail(firstName, lastName),
    password: 'password123', // Will be hashed by the model
    role: role,
    collegeId: collegeId,
    customCollegeName: null,
    isActive: true,
    firstName,
    lastName,
    collegeName
  };
};

const generateAlumniProfile = (userId, collegeId, userInfo) => {
  const graduationYear = 2015 + Math.floor(Math.random() * 8); // 2015-2022
  const degree = getRandomElement(degrees);
  const company = getRandomElement(companies);
  const jobTitle = getRandomElement(jobTitles);
  const achievement = getRandomElement(achievements);
  
  return {
    userId: userId,
    collegeId: collegeId,
    graduationYear: graduationYear,
    degree: degree,
    currentJob: `${jobTitle} at ${company}`,
    achievements: achievement,
    linkedin: generateLinkedInProfile(userInfo.firstName, userInfo.lastName)
  };
};

// Comprehensive seed function
const comprehensiveSeed = async () => {
  try {
    console.log('🌱 Starting COMPREHENSIVE database seeding...');
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Alumni.deleteMany({});
    await User.deleteMany({});
    await College.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Get existing colleges or create them
    console.log('🏫 Setting up colleges...');
    const existingColleges = await College.find({});
    let colleges = [];
    
    if (existingColleges.length === 0) {
      // Create colleges if they don't exist
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
          address: 'Delhi University, Delhi 110007',
          description: 'One of India\'s largest universities offering diverse academic programs',
          type: 'University',
          established: 1922
        },
        {
          name: 'Jawaharlal Nehru University',
          location: 'New Delhi, Delhi',
          address: 'JNU, New Mehrauli Road, New Delhi 110067',
          description: 'Leading university known for social sciences and research',
          type: 'University',
          established: 1969
        },
        {
          name: 'University of Mumbai',
          location: 'Mumbai, Maharashtra',
          address: 'University of Mumbai, Fort, Mumbai 400032',
          description: 'Historic university with diverse academic offerings',
          type: 'University',
          established: 1857
        },
        {
          name: 'Anna University',
          location: 'Chennai, Tamil Nadu',
          address: 'Anna University, Guindy, Chennai 600025',
          description: 'Technical university known for engineering and technology programs',
          type: 'Technical University',
          established: 1978
        },
        {
          name: 'Osmania University',
          location: 'Hyderabad, Telangana',
          address: 'Osmania University, Hyderabad 500007',
          description: 'Historic university with comprehensive academic programs',
          type: 'University',
          established: 1918
        },
        {
          name: 'Banaras Hindu University',
          location: 'Varanasi, Uttar Pradesh',
          address: 'BHU, Varanasi 221005',
          description: 'One of India\'s largest residential universities',
          type: 'University',
          established: 1916
        }
      ];
      
      colleges = await College.insertMany(collegesData);
      console.log(`✅ ${colleges.length} colleges created`);
    } else {
      colleges = existingColleges;
      console.log(`✅ Using ${colleges.length} existing colleges`);
    }
    
    // Generate comprehensive user data
    console.log('👥 Generating comprehensive user data...');
    const usersToInsert = [];
    const alumniProfiles = [];
    
    for (const college of colleges) {
      console.log(`\n🏫 Processing ${college.name}:`);
      
      // Generate students (40-80 per college)
      const studentCount = Math.floor(Math.random() * 41) + 40; // 40-80 students
      console.log(`   📚 Generating ${studentCount} students...`);
      for (let i = 0; i < studentCount; i++) {
        usersToInsert.push(generateRandomUser(college._id, 'student', college.name));
      }
      
      // Generate alumni (50-100 per college)
      const alumniCount = Math.floor(Math.random() * 51) + 50; // 50-100 alumni
      console.log(`   🎓 Generating ${alumniCount} alumni...`);
      for (let i = 0; i < alumniCount; i++) {
        const alumniUser = generateRandomUser(college._id, 'alumni', college.name);
        usersToInsert.push(alumniUser);
      }
      
      // Generate admins (2-5 per college)
      const adminCount = Math.floor(Math.random() * 4) + 2; // 2-5 admins
      console.log(`   👨‍💼 Generating ${adminCount} admins...`);
      for (let i = 0; i < adminCount; i++) {
        usersToInsert.push(generateRandomUser(college._id, 'admin', college.name));
      }
    }
    
    // Add some users with custom college names
    console.log('\n🏛️ Adding users with custom colleges...');
    const customColleges = [
      'St. Xavier\'s College Mumbai',
      'Lady Shri Ram College Delhi',
      'Presidency College Chennai',
      'Ferguson College Pune',
      'Hindu College Delhi',
      'Christ University Bangalore',
      'Loyola College Chennai',
      'Miranda House Delhi',
      'Ramjas College Delhi',
      'Hansraj College Delhi'
    ];
    
    for (let i = 0; i < 50; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const customCollegeName = getRandomElement(customColleges);
      
      usersToInsert.push({
        name: `${firstName} ${lastName}`,
        email: generateRandomEmail(firstName, lastName),
        password: 'password123',
        role: Math.random() > 0.6 ? 'student' : 'alumni',
        collegeId: null,
        customCollegeName: customCollegeName,
        isActive: true,
        firstName,
        lastName,
        collegeName: customCollegeName
      });
    }
    
    console.log(`\n👤 Inserting ${usersToInsert.length} users in batches...`);
    
    // Insert users in batches
    const batchSize = 100;
    const insertedUsers = [];
    
    for (let i = 0; i < usersToInsert.length; i += batchSize) {
      const batch = usersToInsert.slice(i, i + batchSize);
      const batchResult = await User.insertMany(batch);
      insertedUsers.push(...batchResult);
      console.log(`   ✅ Inserted batch: ${Math.min(i + batchSize, usersToInsert.length)}/${usersToInsert.length} users`);
    }
    
    console.log('✅ All users inserted successfully');
    
    // Create detailed alumni profiles
    console.log('\n🎓 Creating detailed alumni profiles...');
    const alumniUsers = insertedUsers.filter(user => user.role === 'alumni' && user.collegeId !== null);
    console.log(`   📊 Found ${alumniUsers.length} alumni users with valid collegeId to create profiles for`);
    
    const alumniProfilesData = [];
    for (const alumniUser of alumniUsers) {
      const profile = generateAlumniProfile(alumniUser._id, alumniUser.collegeId, {
        firstName: alumniUser.name.split(' ')[0],
        lastName: alumniUser.name.split(' ').slice(1).join(' ')
      });
      alumniProfilesData.push(profile);
    }
    
    // Insert alumni profiles in batches
    console.log(`   👤 Inserting ${alumniProfilesData.length} alumni profiles...`);
    for (let i = 0; i < alumniProfilesData.length; i += batchSize) {
      const batch = alumniProfilesData.slice(i, i + batchSize);
      await Alumni.insertMany(batch);
      console.log(`   ✅ Inserted alumni batch: ${Math.min(i + batchSize, alumniProfilesData.length)}/${alumniProfilesData.length} profiles`);
    }
    
    console.log('✅ All alumni profiles created successfully');
    
    // Generate final statistics
    console.log('\n📊 COMPREHENSIVE SEEDING SUMMARY:');
    const totalUsers = await User.countDocuments();
    const totalColleges = await College.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalAlumniProfiles = await Alumni.countDocuments();
    const customCollegeUsers = await User.countDocuments({ collegeId: null });
    
    console.log(`🏫 Colleges: ${totalColleges}`);
    console.log(`👥 Total Users: ${totalUsers}`);
    console.log(`   👨‍🎓 Students: ${totalStudents}`);
    console.log(`   🎓 Alumni: ${totalAlumni}`);
    console.log(`   👨‍💼 Admins: ${totalAdmins}`);
    console.log(`📋 Alumni Profiles: ${totalAlumniProfiles}`);
    console.log(`🏛️ Custom College Users: ${customCollegeUsers}`);
    
    // Show detailed statistics for each college
    console.log('\n📈 College-wise Statistics:');
    for (const college of colleges) {
      const collegeStudents = await User.countDocuments({ collegeId: college._id, role: 'student' });
      const collegeAlumni = await User.countDocuments({ collegeId: college._id, role: 'alumni' });
      const collegeAdmins = await User.countDocuments({ collegeId: college._id, role: 'admin' });
      const collegeAlumniProfiles = await Alumni.countDocuments({ collegeId: college._id });
      
      console.log(`   🏫 ${college.name}:`);
      console.log(`      👨‍🎓 Students: ${collegeStudents}`);
      console.log(`      🎓 Alumni: ${collegeAlumni} (${collegeAlumniProfiles} detailed profiles)`);
      console.log(`      👨‍💼 Admins: ${collegeAdmins}`);
    }
    
    console.log('\n🎉 COMPREHENSIVE DATABASE SEEDING COMPLETED!');
    console.log(`📊 Successfully created ${totalUsers} users with ${totalAlumniProfiles} detailed alumni profiles across ${totalColleges} colleges`);
    
    // Show sample alumni profile
    const sampleAlumni = await Alumni.findOne()
      .populate('userId', 'name email')
      .populate('collegeId', 'name');
    
    if (sampleAlumni) {
      console.log('\n📋 Sample Alumni Profile:');
      console.log(`   Name: ${sampleAlumni.userId.name}`);
      console.log(`   Email: ${sampleAlumni.userId.email}`);
      console.log(`   College: ${sampleAlumni.collegeId.name}`);
      console.log(`   Graduation Year: ${sampleAlumni.graduationYear}`);
      console.log(`   Degree: ${sampleAlumni.degree}`);
      console.log(`   Current Job: ${sampleAlumni.currentJob}`);
      console.log(`   Achievements: ${sampleAlumni.achievements}`);
      console.log(`   LinkedIn: ${sampleAlumni.linkedin}`);
    }
    
  } catch (error) {
    console.error('❌ Comprehensive seeding failed:', error);
    throw error;
  }
};

// Run the comprehensive seeding
const runComprehensiveSeeding = async () => {
  try {
    await connectDB();
    await comprehensiveSeed();
  } catch (error) {
    console.error('❌ Seeding process failed:', error.message);
  } finally {
    console.log('🔌 Database connection closed');
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run if called directly
if (require.main === module) {
  runComprehensiveSeeding();
}

module.exports = {
  runComprehensiveSeeding,
  comprehensiveSeed
};