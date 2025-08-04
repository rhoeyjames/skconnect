# SKConnect - Youth Development & Sangguniang Kabataan Portal

SKConnect is a comprehensive full-stack web application designed to facilitate youth development and community engagement through the Sangguniang Kabataan (SK) system.

## 🚀 Features

### For Youth (Users)
- **Event Registration**: Browse and register for community events
- **Project Suggestions**: Submit ideas for community projects
- **Voting System**: Vote on project suggestions from other users
- **Event Feedback**: Rate and provide feedback on attended events
- **Personal Dashboard**: Track registered events and participation

### For SK Admins
- **Event Management**: Create, update, and manage community events
- **Registration Management**: Approve/reject event registrations
- **Project Review**: Review and respond to project suggestions
- **Analytics Dashboard**: View participation statistics and reports
- **User Management**: Oversee registered users and their activities

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Multer** for file uploads
- **Express-validator** for input validation
- **bcryptjs** for password hashing

### Frontend
- **React** with **TypeScript**
- **React Router** for navigation
- **Axios** for API calls
- **TailwindCSS** for styling
- **React-Toastify** for notifications
- **Recharts** for analytics visualization

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd skconnect
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update the `.env` file with your configuration:
   \`\`\`env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skconnect
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   \`\`\`

4. **Start the backend server**
   \`\`\`bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install frontend dependencies**
   \`\`\`bash
   # Using the specified create-react-app version for Termux compatibility
   npx create-react-app@4.0.3 . --template typescript
   
   # Install additional dependencies
   npm install axios react-router-dom react-toastify recharts
   npm install -D tailwindcss postcss autoprefixer
   \`\`\`

3. **Initialize TailwindCSS**
   \`\`\`bash
   npx tailwindcss init -p
   \`\`\`

4. **Start the frontend development server**
   \`\`\`bash
   npm start
   \`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Mobile Compatibility

SKConnect is built with a mobile-first approach using TailwindCSS, ensuring optimal performance on:
- Mobile devices (phones and tablets)
- Desktop browsers
- Termux environment (Android)

## 🗃️ Database Schema

### Collections

1. **users** - User accounts and profiles
2. **events** - Community events and activities
3. **registrations** - Event registration records
4. **suggestions** - Project suggestions from users
5. **votes** - Voting records for suggestions
6. **feedbacks** - Event feedback and ratings

## 🔐 Authentication & Security

- JWT-based authentication system
- Password hashing with bcryptjs
- Protected routes for authenticated users
- Role-based access control (User/Admin)
- File upload validation and security

## 📊 Admin Features

- **Dashboard Analytics**: User statistics, event popularity, barangay participation
- **Event Management**: Full CRUD operations for events
- **Registration Oversight**: Approve/reject registrations with notes
- **Project Review System**: Manage community project suggestions
- **Export Functionality**: Download registration lists as CSV files

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/my-registrations` - User's registrations
- `GET /api/registrations/event/:eventId` - Event registrations (Admin)
- `PUT /api/registrations/:id/status` - Update registration status (Admin)

### Suggestions
- `POST /api/suggestions` - Create suggestion
- `GET /api/suggestions` - List suggestions
- `POST /api/suggestions/:id/vote` - Vote on suggestion
- `PUT /api/suggestions/:id/status` - Update suggestion status (Admin)

### Feedback
- `POST /api/feedback` - Submit event feedback
- `GET /api/feedback/event/:eventId` - Get event feedback
- `GET /api/feedback/event/:eventId/stats` - Get feedback statistics

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection is configured
3. Deploy using your preferred platform (Vercel, Heroku, etc.)

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy the build folder to your hosting platform
3. Configure API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**SKConnect** - Empowering youth, building communities! 🌟
