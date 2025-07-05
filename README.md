# GigRadar - Local Artist & Indie Gig Finder

A platform for discovering local music gigs, supporting independent artists, and connecting music lovers with underground music scenes.

## 🎵 Features

- **Map-based gig discovery** - Find local gigs near you
- **Artist & Venue profiles** - Complete profiles with music previews
- **Real-time check-ins** - Check in at gigs and share your experience
- **Vibe-meter ratings** - Rate gigs with a unique vibe-meter system
- **Music integration** - Spotify/YouTube music embedding
- **Push notifications** - Get notified about gigs in your area
- **Social features** - Reviews, ratings, and community engagement

## 🏗️ Project Structure

```
gigradar/
├── frontend/          # Next.js React frontend
│   ├── src/
│   │   ├── app/       # Next.js app router
│   │   ├── components/ # React components
│   │   └── lib/       # Utilities and helpers
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js Express API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   ├── utils/         # Utility functions
│   └── package.json   # Backend dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp env.example .env
   ```

4. Update `.env` with your configuration:

   - MongoDB connection string
   - JWT secret
   - Cloudinary credentials (for image uploads)

5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## 🗄️ Database Models

- **User** - User accounts and profiles
- **Artist** - Artist profiles with music links
- **Venue** - Venue information and locations
- **Gig** - Event details with ticketing
- **Review** - Gig reviews with vibe-meter ratings
- **Checkin** - Real-time check-ins at gigs

## 🛠️ Tech Stack

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v3
- Map integration (TBD)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io (for real-time features)
- Cloudinary (image uploads)

## 📱 Core Features

### For Music Lovers

- Discover local gigs on an interactive map
- Preview artist music via Spotify/YouTube
- Check in at gigs and share experiences
- Rate gigs with vibe-meter system
- Get notifications for favorite genres/artists

### For Artists

- Create detailed artist profiles
- Upload music previews and links
- Manage gig schedules
- Track performance metrics
- Connect with fans

### For Venues

- List venue details and amenities
- Manage gig bookings
- Track attendance and reviews
- Promote upcoming events

## 🔧 Development

### Running Both Services

From the root directory:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/gigs` - Get gigs (with filters)
- `POST /api/gigs` - Create new gig
- `POST /api/checkins` - Check in at gig
- `POST /api/reviews` - Post gig review

## 🚀 Deployment

### Backend Deployment

- Deploy to Heroku, Railway, or similar
- Set environment variables
- Connect to MongoDB Atlas

### Frontend Deployment

- Deploy to Vercel, Netlify, or similar
- Configure environment variables
- Update API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Artist collaboration features
- [ ] Mobile app development
- [ ] Payment integration
- [ ] Social media integration
