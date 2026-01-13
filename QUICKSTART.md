# Hospital Management System - Quick Start

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js v18+
- MongoDB running
- Terminal/Command Prompt

### Step 1: Install Backend (2 min)
```bash
cd backend
npm install
# .env file is already configured
```

### Step 2: Seed Database (1 min)
```bash
cd database
npm install
npm run seed
```

### Step 3: Start Backend (30 sec)
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

### Step 4: Start Frontend (30 sec)
```bash
cd frontend
# Dependencies already installed
npm run dev
# App running on http://localhost:5173
```

### Step 5: Login (30 sec)
Open http://localhost:5173 and login with:
- **Email:** admin@hospital.com
- **Password:** Admin@123

## 🎯 Quick Commands

### Backend
```bash
cd backend
npm run dev      # Start development server
npm start        # Start production server
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
```

### Database
```bash
cd database
npm run seed     # Seed database with sample data
```

## 📋 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | Admin@123 |
| Doctor | doctor@hospital.com | Doctor@123 |
| Receptionist | receptionist@hospital.com | Receptionist@123 |
| Patient | patient@hospital.com | Patient@123 |

## 🔗 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
hospital/
├── frontend/    → React app (port 5173)
├── backend/     → Express API (port 5000)
└── database/    → MongoDB seed scripts
```

## 🚀 Features to Test

1. **Login** → Try different user roles
2. **Dashboard** → See role-based UI
3. **Patients** → View patient list (admin/receptionist)
4. **Appointments** → View appointments (all roles)
5. **Doctors** → View doctor list (all roles)

## 🐛 Troubleshooting

**MongoDB not running?**
```bash
# Windows: Start MongoDB service
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Port already in use?**
```bash
# Change PORT in backend/.env
# Update VITE_API_URL in frontend/.env
```

**Can't login?**
```bash
# Re-run database seed
cd database
npm run seed
```

## 📚 Documentation

- **Setup:** SETUP_GUIDE.md
- **API:** API_DOCUMENTATION.md
- **Architecture:** ARCHITECTURE.md
- **Deploy:** DEPLOYMENT.md
- **Summary:** PROJECT_SUMMARY.md

## ✅ Verification

After setup, verify:
- [ ] Backend responds at http://localhost:5000/api/health
- [ ] Frontend loads at http://localhost:5173
- [ ] Can login with admin@hospital.com
- [ ] Dashboard shows role-based cards
- [ ] Can navigate to different pages

## 🎓 Next Steps

1. Explore the dashboard
2. Test different user roles
3. Create a new patient
4. Book an appointment
5. Read the documentation
6. Customize for your needs

---

**That's it! You're ready to go!** 🎉

For detailed information, see the full documentation files.
