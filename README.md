# Multi-College Alumni Management System

A full-stack MERN application for managing alumni across multiple colleges and universities.

## 🏗️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication

**Frontend:**
- React 18
- Vite
- JavaScript (ES6+)
- CSS3 with custom styles

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd redploy
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration:**
   
   The `.env` file is already configured with:
   ```env
   MONGO_URI=mongodb+srv://starunkumarainds2024_db_user:2fgmUJliWHq9YUIl@cluster0.bc9ss4x.mongodb.net/alumni_db
   JWT_SECRET=your_jwt_secret_multi_college_alumni_2024_super_secure_key
   PORT=5000
   NODE_ENV=development
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on: http://localhost:5000

2. **Start the Frontend (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on: http://localhost:5173

## 🔧 API Endpoints

### Test Routes
- `GET /` - API status and information
- `GET /api/test` - Test API connectivity

Example API response:
```json
{
  "message": "API working",
  "timestamp": "2024-09-13T10:30:00.000Z",
  "environment": "development"
}
```

## 📁 Project Structure

```
redploy/
├── server/                 # Backend application
│   ├── services/
│   │   └── db.js          # Database connection service
│   ├── routes/
│   │   └── api.js         # API routes
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server entry point
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   └── LandingPage.jsx  # Main landing page
│   │   ├── App.jsx        # Root React component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── .env                   # Environment variables
└── README.md             # This file
```

## 🎨 Features

### Current Implementation
- ✅ Express.js API server with MongoDB Atlas connection
- ✅ Database service wrapper for easy database management
- ✅ React frontend with Vite build system
- ✅ Responsive landing page with modern CSS
- ✅ API test endpoint
- ✅ Error handling and graceful shutdown
- ✅ Development and production configurations

### Planned Features
- 🔄 User authentication (JWT)
- 🔄 Alumni registration and profiles
- 🔄 Multi-college support
- 🔄 Event management
- 🔄 Mentorship programs
- 🔄 Donation tracking
- 🔄 Admin dashboard

## 🛠️ Development

### Backend Scripts
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

### Frontend Scripts
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Database Service

The database connection is handled by a service class in `server/services/db.js`:

```javascript
const dbService = require('./services/db');

// Connect to database
await dbService.connect(process.env.MONGO_URI);

// Check connection status
const isConnected = dbService.isConnected();

// Disconnect (handled automatically on server shutdown)
await dbService.disconnect();
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |

## 🚦 Testing the Setup

1. **Test Backend:**
   ```bash
   curl http://localhost:5000/api/test
   ```

2. **Expected Response:**
   ```json
   {
     "message": "API working",
     "timestamp": "2024-09-13T10:30:00.000Z",
     "environment": "development"
   }
   ```

3. **Test Frontend:**
   Open http://localhost:5173 in your browser

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed:**
   - Verify your MongoDB Atlas connection string
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure the database user has proper permissions

2. **Port Already in Use:**
   - Change the PORT in `.env` file
   - Kill existing processes: `npx kill-port 5000`

3. **Dependencies Issues:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Logs and Debugging

The application includes comprehensive logging:
- ✅ MongoDB connection status
- 🚀 Server startup information
- ❌ Error messages with stack traces
- 🛑 Graceful shutdown logs

## � Monitoring

### Health Checks
- Backend: http://localhost:5000/ (API status)
- Database: Automatic connection monitoring
- Frontend: Vite dev server status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready to connect alumni across the world! 🎓✨**