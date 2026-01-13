# Hospital Management System - Project Architecture

## Overview

This is a production-grade Hospital Management System built with a clean three-layer architecture:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB with Mongoose

## Project Structure

```
hospital-management-system/
│
├── frontend/                    # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx     # Navigation bar with role-based menu
│   │   │   └── PrivateRoute.jsx # Route protection component
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Dashboard.jsx  # Role-based dashboard
│   │   │   ├── Patients.jsx   # Patient management
│   │   │   └── Appointments.jsx # Appointment management
│   │   │
│   │   ├── services/          # API service layer
│   │   │   ├── api.js         # Axios instance with interceptors
│   │   │   └── index.js       # All API service functions
│   │   │
│   │   ├── App.jsx            # Main app with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind CSS styles
│   │
│   ├── .env                   # Environment variables
│   ├── package.json           # Dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── vite.config.js         # Vite configuration
│
├── backend/                    # Node.js Backend API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   │
│   ├── models/                # Mongoose schemas
│   │   ├── User.js            # User model with auth
│   │   ├── Patient.js         # Patient model
│   │   ├── Doctor.js          # Doctor model
│   │   ├── Appointment.js     # Appointment model
│   │   ├── Prescription.js    # Prescription model
│   │   └── Bill.js            # Bill model
│   │
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Authentication logic
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── prescriptionController.js
│   │   └── billController.js
│   │
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   ├── prescriptions.js
│   │   └── bills.js
│   │
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js            # JWT authentication & authorization
│   │   └── error.js           # Error handling
│   │
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   ├── package.json           # Dependencies
│   └── server.js              # Express server setup
│
├── database/                   # Database Scripts
│   ├── seed.js                # Database seeding script
│   ├── package.json           # Dependencies
│   ├── .env                   # MongoDB connection
│   └── README.md              # Database documentation
│
├── .gitignore                 # Git ignore rules
├── README.md                  # Project overview
├── SETUP_GUIDE.md             # Setup instructions
└── API_DOCUMENTATION.md       # API reference

```

## Technology Stack

### Frontend Technologies
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework

### Backend Technologies
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger
- **dotenv**: Environment variables

### Development Tools
- **nodemon**: Auto-restart server
- **ESLint**: Code linting (frontend)
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## Architecture Patterns

### 1. Three-Layer Architecture

**Presentation Layer (Frontend)**
- React components for UI
- State management with React hooks
- API calls through service layer
- Client-side routing

**Application Layer (Backend)**
- RESTful API endpoints
- Business logic in controllers
- Middleware for cross-cutting concerns
- JWT-based authentication

**Data Layer (Database)**
- MongoDB for data persistence
- Mongoose for schema validation
- Seed scripts for initial data

### 2. MVC Pattern (Backend)

**Models**
- Define data structure
- Schema validation
- Business logic methods
- Pre/post hooks

**Controllers**
- Handle HTTP requests
- Process business logic
- Return responses
- Error handling

**Routes**
- Define API endpoints
- Apply middleware
- Map to controllers
- Role-based access control

### 3. Service Layer Pattern (Frontend)

**API Service**
- Centralized API calls
- Request/response interceptors
- Token management
- Error handling

**Component Services**
- Reusable business logic
- Data transformation
- State management helpers

## Security Features

### Authentication & Authorization
- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)
- Protected routes on frontend and backend
- Token expiration (7 days default)
- Automatic logout on token expiry

### Data Security
- Input validation on all endpoints
- Mongoose schema validation
- SQL injection prevention (NoSQL)
- XSS protection
- CORS configuration
- Environment variable protection

### Password Requirements
- Minimum 6 characters
- Hashed before storage
- Never returned in API responses
- Secure comparison for login

## Database Design

### Collections

**users**
- Base authentication
- Role assignment
- Contact information
- Active status

**patients**
- Links to user
- Medical history
- Emergency contacts
- Allergies & medications
- Auto-generated patient ID

**doctors**
- Links to user
- Specialization & qualifications
- Availability schedule
- Consultation fees
- Auto-generated doctor ID

**appointments**
- Patient-doctor relationship
- Date and time
- Status tracking
- Reason and notes
- Auto-generated appointment ID

**prescriptions**
- Links to patient, doctor, appointment
- Diagnosis and symptoms
- Medications with dosage
- Lab tests
- Follow-up dates
- Auto-generated prescription ID

**bills**
- Links to patient and appointment
- Itemized billing
- Payment status tracking
- Multiple payment methods
- Auto-generated bill ID

### Relationships

```
User (1) ──→ (1) Patient
User (1) ──→ (1) Doctor
Patient (1) ──→ (N) Appointments
Doctor (1) ──→ (N) Appointments
Appointment (1) ──→ (0..1) Prescription
Patient (1) ──→ (N) Prescriptions
Doctor (1) ──→ (N) Prescriptions
Patient (1) ──→ (N) Bills
Appointment (0..1) ──→ (1) Bill
```

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Stateless communication
- JSON request/response
- Consistent error handling

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // for list endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Role-Based Access Control

### Admin
- Full system access
- Manage doctors
- Manage patients
- View all data
- Delete records

### Doctor
- View appointments
- Access patient history
- Create prescriptions
- Update prescriptions
- View own schedule

### Receptionist
- Register patients
- Book appointments
- Generate bills
- Update patient info
- Manage appointment status

### Patient
- View own appointments
- View own prescriptions
- View own bills
- Update own profile

## State Management

### Frontend State
- Local component state (useState)
- Authentication state (localStorage)
- API data caching (useEffect)
- Form state management

### Backend State
- Stateless API design
- JWT for session management
- Database for persistence
- No server-side sessions

## Error Handling

### Frontend
- Try-catch blocks for async operations
- User-friendly error messages
- Form validation feedback
- Network error handling
- Automatic token refresh on 401

### Backend
- Global error handler middleware
- Mongoose validation errors
- Custom error messages
- Error logging
- Graceful shutdown on critical errors

## Performance Optimizations

### Frontend
- Code splitting with React Router
- Lazy loading components
- Vite's fast HMR
- Tailwind CSS purging
- Production build optimization

### Backend
- MongoDB indexing on IDs
- Efficient queries with populate
- Connection pooling
- Compression middleware
- Caching strategies

### Database
- Indexed fields (email, IDs)
- Lean queries where possible
- Projection to limit fields
- Pagination for large datasets

## Testing Strategy

### Unit Testing
- Test individual functions
- Mock external dependencies
- Test edge cases
- Validate business logic

### Integration Testing
- Test API endpoints
- Test database operations
- Test authentication flow
- Test RBAC

### End-to-End Testing
- Test complete user flows
- Test role-based features
- Test error scenarios
- Test cross-browser compatibility

## Deployment Architecture

### Development
```
Frontend (Vite Dev Server) → Backend (Express) → MongoDB (Local)
```

### Production
```
Frontend (CDN/Static Host) → Backend (Cloud Server) → MongoDB (Atlas)
```

### Recommended Hosting

**Frontend:**
- Vercel
- Netlify
- AWS S3 + CloudFront

**Backend:**
- Heroku
- Railway
- AWS EC2
- DigitalOcean

**Database:**
- MongoDB Atlas
- AWS DocumentDB

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancer ready
- Database replication
- CDN for static assets

### Vertical Scaling
- Optimize queries
- Add database indexes
- Implement caching
- Use connection pooling

## Future Enhancements

1. **Real-time Features**
   - WebSocket for notifications
   - Live appointment updates
   - Chat between doctor-patient

2. **Advanced Features**
   - Email notifications
   - SMS reminders
   - File upload for medical records
   - Report generation (PDF)
   - Analytics dashboard
   - Audit logs

3. **Integration**
   - Payment gateway
   - Lab systems
   - Pharmacy systems
   - Insurance providers

4. **Mobile App**
   - React Native app
   - Push notifications
   - Offline support

## Code Quality Standards

### Naming Conventions
- camelCase for variables and functions
- PascalCase for components and classes
- UPPER_CASE for constants
- Descriptive names

### Code Organization
- One component per file
- Logical folder structure
- Separation of concerns
- DRY principle

### Documentation
- JSDoc comments for functions
- README for each module
- API documentation
- Setup guides

## Maintenance

### Regular Tasks
- Update dependencies
- Security patches
- Database backups
- Log monitoring
- Performance monitoring

### Version Control
- Git for source control
- Feature branches
- Pull request reviews
- Semantic versioning

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Scalability and maintainability
- ✅ Security best practices
- ✅ Production-ready code
- ✅ Easy deployment
- ✅ Future extensibility
