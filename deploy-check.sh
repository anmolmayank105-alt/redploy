#!/bin/bash

echo "🔧 Alumni Management System - Deployment Verification"
echo "=================================================="

# Check if required files exist
echo "📁 Checking required files..."

files=("package.json" "vercel.json" "client/package.json" "server/package.json" "client/vite.config.js" "server/server.js")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing!"
        exit 1
    fi
done

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
if [ -f "package.json" ]; then
    npm install
fi

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

echo ""
echo "🏗️ Testing build process..."

# Test client build
cd client
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Client build successful"
else
    echo "❌ Client build failed!"
    exit 1
fi

cd ..

echo ""
echo "🎉 Deployment verification complete!"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Import repository in Vercel"
echo "3. Set environment variables in Vercel dashboard"
echo "4. Deploy!"
echo ""
echo "🔑 Environment variables to set in Vercel:"
echo "- MONGO_URI"
echo "- JWT_SECRET"
echo "- JWT_EXPIRE"
echo "- NODE_ENV=production"
echo "- CLIENT_URL (update after first deployment)"