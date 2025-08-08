# SoundCloud Clone - Full-Stack Music Streaming Platform

A complete music streaming web application built with React, Node.js, Express, and MongoDB. Features include audio upload, streaming, user authentication, playlists, social features, and real-time interactions.

## ✨ Features

### 🎵 Core Music Features
- **Audio Upload & Streaming**: Upload and stream high-quality audio files
- **Waveform Visualization**: Visual audio waveforms for tracks
- **Advanced Audio Player**: Play, pause, seek, volume control, shuffle, repeat
- **Multiple Audio Formats**: Support for MP3, WAV, FLAC, AAC, M4A

### 👥 Social Features
- **User Profiles**: Customizable profiles with avatars and bio
- **Follow System**: Follow/unfollow other users
- **Comments**: Timestamped comments on tracks
- **Likes & Reposts**: Engage with tracks through likes and reposts
- **Real-time Updates**: Live notifications for interactions

### 🎧 Playlist & Library
- **Custom Playlists**: Create and manage personal playlists
- **Library Management**: Organize your music collection
- **Track Discovery**: Explore new music by genre, popularity
- **Search**: Advanced search for tracks, users, and playlists

### 🔐 Authentication & Security
- **JWT Authentication**: Secure user authentication
- **Protected Routes**: Role-based access control
- **Password Encryption**: Bcrypt password hashing
- **Rate Limiting**: API protection against abuse

### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first, works on all devices
- **SoundCloud-inspired**: Familiar and intuitive interface
- **Dark/Light Mode**: Automatic theme switching
- **Real-time Player**: Persistent bottom audio player
- **Infinite Scroll**: Smooth content loading

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **WaveSurfer.js** - Audio waveform visualization
- **Socket.io Client** - Real-time features
- **React Hot Toast** - Beautiful notifications
- **React Dropzone** - File upload interface

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud media storage

### Development Tools
- **Concurrently** - Run multiple commands
- **Nodemon** - Development server auto-restart
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file storage)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd soundcloud-clone
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**

Create `/server/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/soundcloud-clone
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: Email Configuration
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Create `/client/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```

This will start both the backend server (port 5000) and React frontend (port 3000).

## 📁 Project Structure

```
soundcloud-clone/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Route components
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
└── package.json           # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Tracks
- `GET /api/tracks` - Get all tracks (with pagination)
- `POST /api/tracks` - Upload new track
- `GET /api/tracks/:id` - Get single track
- `PUT /api/tracks/:id` - Update track
- `DELETE /api/tracks/:id` - Delete track
- `POST /api/tracks/:id/like` - Like/unlike track
- `POST /api/tracks/:id/repost` - Repost track
- `POST /api/tracks/:id/comments` - Add comment

### Users
- `GET /api/users/:username` - Get user profile
- `POST /api/users/:username/follow` - Follow/unfollow user
- `GET /api/users/:username/tracks` - Get user's tracks
- `GET /api/users/:username/likes` - Get user's liked tracks
- `GET /api/users/search` - Search users

### Playlists
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/:id` - Get single playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/tracks` - Add track to playlist
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove track from playlist

## 🎨 UI Components

### Layout Components
- **Navbar** - Top navigation with auth controls
- **Sidebar** - Left navigation menu
- **Player** - Bottom audio player

### Track Components
- **TrackCard** - Display track with artwork and controls
- **TrackList** - List of tracks with play buttons
- **WaveformPlayer** - Interactive waveform visualization
- **CommentSection** - Timestamped comments

### Form Components
- **UploadForm** - Multi-step track upload
- **PlaylistForm** - Create/edit playlists
- **ProfileForm** - Update user profile

## 🔒 Security Features

- **JWT Authentication** with automatic token refresh
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent API abuse
- **Input Validation** on all endpoints
- **File Upload Security** with type and size restrictions
- **CORS Configuration** for cross-origin requests
- **Helmet** for security headers

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set up environment variables on your hosting platform
2. Configure MongoDB Atlas connection
3. Set up Cloudinary for file storage
4. Deploy the `/server` directory

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `/client/build` directory
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by SoundCloud's user interface and functionality
- Built with modern web development best practices
- Uses industry-standard libraries and frameworks

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the development team.

---

**Happy coding! 🎵**