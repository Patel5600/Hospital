# Hospital Management System - Database

This directory contains MongoDB schemas and seed scripts for the Hospital Management System.

## Database Models

### User
- Base user model with authentication
- Roles: admin, doctor, receptionist, patient
- Password hashing with bcrypt

### Patient
- Patient profile linked to User
- Medical history
- Emergency contacts
- Allergies and medications

### Doctor
- Doctor profile linked to User
- Specialization and qualifications
- Availability schedule
- Consultation fees

### Appointment
- Patient-Doctor appointments
- Status tracking
- Appointment scheduling

### Prescription
- Medical prescriptions
- Medications with dosage
- Lab tests
- Follow-up dates

### Bill
- Itemized billing
- Payment tracking
- Multiple payment methods

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# Edit .env file
MONGODB_URI=mongodb://localhost:27017/hospital_db
```

3. Ensure MongoDB is running

4. Run seed script:
```bash
npm run seed
```

## Default Users

After seeding, you can login with:

**Admin**
- Email: admin@hospital.com
- Password: Admin@123

**Receptionist**
- Email: receptionist@hospital.com
- Password: Receptionist@123

**Doctor**
- Email: doctor@hospital.com
- Password: Doctor@123

**Patient**
- Email: patient@hospital.com
- Password: Patient@123

## Schema Details

All models include:
- Automatic timestamps (createdAt, updatedAt)
- Auto-generated IDs (patientId, doctorId, etc.)
- Data validation
- Reference population

## Notes

- The seed script will clear existing data before seeding
- All passwords are hashed using bcrypt
- Sample data includes realistic medical information
