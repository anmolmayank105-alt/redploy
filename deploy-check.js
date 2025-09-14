const fs = require('fs');
const path = require('path');

console.log('🔍 Deployment Configuration Check\n');

// Check if all required files exist
const requiredFiles = [
  'vercel.json',
  'package.json',
  'client/package.json',
  'server/package.json',
  'server/server.js',
  'client/dist/index.html'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n📦 Checking package.json scripts:');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log('✅ Root package.json found');
  console.log('Scripts:', Object.keys(pkg.scripts || {}));
} catch (e) {
  console.log('❌ Error reading root package.json');
}

try {
  const clientPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'client/package.json'), 'utf8'));
  console.log('✅ Client package.json found');
  console.log('Build script:', clientPkg.scripts?.build || 'NOT FOUND');
} catch (e) {
  console.log('❌ Error reading client package.json');
}

console.log('\n🔧 Vercel Configuration:');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  console.log('✅ vercel.json found');
  console.log('Builds:', vercelConfig.builds?.length || 0, 'configured');
  console.log('Routes:', vercelConfig.routes?.length || 0, 'configured');
} catch (e) {
  console.log('❌ Error reading vercel.json');
}

console.log('\n🌐 Environment Variables to Set in Vercel:');
console.log('- MONGODB_URI (your MongoDB Atlas connection string)');
console.log('- JWT_SECRET (your JWT secret key)');
console.log('- NODE_ENV=production');

console.log('\n📋 Deployment Steps:');
console.log('1. Make sure all files are committed to git');
console.log('2. Push to your repository');
console.log('3. Connect repository to Vercel');
console.log('4. Set environment variables in Vercel dashboard');
console.log('5. Deploy');

console.log('\n🚀 If you get 404 errors after deployment:');
console.log('- Check that the build completed successfully');
console.log('- Verify all environment variables are set');
console.log('- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)');
console.log('- Check Vercel function logs for any errors');