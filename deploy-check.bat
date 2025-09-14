@echo off
echo 🔧 Alumni Management System - Deployment Verification
echo ==================================================

echo 📁 Checking required files...

if exist "package.json" (
    echo ✅ package.json exists
) else (
    echo ❌ package.json is missing!
    exit /b 1
)

if exist "vercel.json" (
    echo ✅ vercel.json exists
) else (
    echo ❌ vercel.json is missing!
    exit /b 1
)

if exist "client\package.json" (
    echo ✅ client\package.json exists
) else (
    echo ❌ client\package.json is missing!
    exit /b 1
)

if exist "server\package.json" (
    echo ✅ server\package.json exists
) else (
    echo ❌ server\package.json is missing!
    exit /b 1
)

echo.
echo 📦 Installing dependencies...

call npm install

echo Installing client dependencies...
cd client
call npm install
cd ..

echo Installing server dependencies...
cd server
call npm install
cd ..

echo.
echo 🏗️ Testing build process...

cd client
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Client build successful
) else (
    echo ❌ Client build failed!
    exit /b 1
)

cd ..

echo.
echo 🎉 Deployment verification complete!
echo.
echo 📝 Next steps:
echo 1. Push your code to GitHub
echo 2. Import repository in Vercel
echo 3. Set environment variables in Vercel dashboard
echo 4. Deploy!
echo.
echo 🔑 Environment variables to set in Vercel:
echo - MONGO_URI
echo - JWT_SECRET
echo - JWT_EXPIRE
echo - NODE_ENV=production
echo - CLIENT_URL (update after first deployment)