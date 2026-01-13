# Hospital Management System - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn**
- **Git** (optional)

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# The .env file is already created with default values
# Edit if needed:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/hospital_db
# - JWT_SECRET=hospital_jwt_secret_key_2024_change_in_production
# - JWT_EXPIRE=7d
# - NODE_ENV=development

# Start MongoDB service (if not running)
# Windows: Start MongoDB service from Services
# Mac/Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 2. Database Setup

```bash
# Navigate to database directory
cd database

# Install dependencies
npm install

# Run seed script to populate database with sample data
npm run seed
```

This will create:
- Admin user
- Receptionist user
- 3 Doctor users with profiles
- 2 Patient users with profiles

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Dependencies are already installed
# If needed, run: npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Login Credentials

After seeding the database, use these credentials:

### Admin Account
- **Email:** admin@hospital.com
- **Password:** Admin@123
- **Access:** Full system access

### Doctor Account
- **Email:** doctor@hospital.com
- **Password:** Doctor@123
- **Access:** View appointments, create prescriptions

### Receptionist Account
- **Email:** receptionist@hospital.com
- **Password:** Receptionist@123
- **Access:** Register patients, book appointments, generate bills

### Patient Account
- **Email:** patient@hospital.com
- **Password:** Patient@123
- **Access:** View appointments and prescriptions

## Verification Steps

### 1. Check Backend
```bash
# Test health endpoint
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Hospital Management System API is running"
}
```

### 2. Check Database
```bash
# Connect to MongoDB
mongosh

# Use hospital database
use hospital_db

# Check collections
show collections

# Count users
db.users.countDocuments()
```

### 3. Check Frontend
- Open browser: `http://localhost:5173`
- You should see the login page
- Try logging in with any of the default accounts

## Common Issues & Solutions

### MongoDB Connection Error
**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running
2. Check MongoDB connection string in `.env`
3. Verify MongoDB port (default: 27017)

### Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Solution:**
1. Change port in backend `.env` file
2. Update frontend `.env` with new API URL
3. Or kill the process using the port

### CORS Errors
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Backend already has CORS enabled
- Ensure backend is running before frontend
- Check API URL in frontend `.env`

### JWT Token Errors
**Error:** `JsonWebTokenError: invalid token`

**Solution:**
1. Clear browser localStorage
2. Login again
3. Ensure JWT_SECRET matches in backend

## Development Workflow

### Running All Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Making Changes

**Backend Changes:**
- Edit files in `backend/` directory
- Server auto-restarts with nodemon
- Test API endpoints with Postman or curl

**Frontend Changes:**
- Edit files in `frontend/src/` directory
- Vite hot-reloads automatically
- Changes appear instantly in browser

**Database Changes:**
- Edit `database/seed.js`
- Re-run: `npm run seed`
- This will clear and repopulate database

## Testing the System

### 1. Test Authentication
1. Login as admin
2. Verify dashboard loads
3. Check role-based menu items

### 2. Test Patient Management
1. Login as receptionist
2. Navigate to Patients
3. Register a new patient
4. Verify patient appears in list

### 3. Test Appointments
1. Login as receptionist
2. Book an appointment
3. Login as doctor
4. Verify appointment appears

### 4. Test Prescriptions
1. Login as doctor
2. Create a prescription
3. Login as patient
4. Verify prescription is visible

### 5. Test Billing
1. Login as receptionist
2. Create a bill
3. Verify bill details

## Production Deployment

### Backend Deployment

1. **Set Production Environment Variables:**
```bash
NODE_ENV=production
MONGODB_URI=<your_production_mongodb_uri>
JWT_SECRET=<strong_random_secret>
PORT=5000
```

2. **Deploy to:**
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

### Frontend Deployment

1. **Build for production:**
```bash
cd frontend
npm run build
```

2. **Deploy `dist` folder to:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

3. **Update API URL:**
```bash
VITE_API_URL=https://your-backend-url.com/api
```

### Database Deployment

1. **Use managed MongoDB:**
- MongoDB Atlas (recommended)
- AWS DocumentDB
- DigitalOcean Managed MongoDB

2. **Update connection string in backend `.env`**

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS for API and frontend
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable CORS only for trusted origins
- [ ] Regular security updates

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Check MongoDB connection
4. Verify environment variables
5. Ensure all services are running

## Next Steps

1. Customize the UI/UX
2. Add more features (reports, analytics)
3. Implement email notifications
4. Add file upload for medical records
5. Integrate payment gateway
6. Add real-time notifications
7. Implement audit logs

---

**Congratulations!** Your Hospital Management System is now ready to use. 🎉
