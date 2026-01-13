# Hospital Management System - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "patient",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "phone": "+1234567890"
  }
}
```

### POST /auth/login
Login user

**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@hospital.com",
    "role": "admin",
    "phone": "+1234567890"
  }
}
```

### GET /auth/me
Get current user (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Admin User",
    "email": "admin@hospital.com",
    "role": "admin",
    "phone": "+1234567890",
    "isActive": true
  }
}
```

## Patients

### GET /patients
Get all patients (Protected: admin, doctor, receptionist)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "patient_id",
      "user": {
        "name": "Alice Williams",
        "email": "patient@hospital.com",
        "phone": "+1234567895"
      },
      "patientId": "PAT000001",
      "dateOfBirth": "1990-05-15",
      "gender": "female",
      "bloodGroup": "A+",
      "address": {
        "street": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      }
    }
  ]
}
```

### GET /patients/:id
Get patient by ID (Protected)

### POST /patients
Create new patient (Protected: admin, receptionist)

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Password@123",
  "phone": "+1234567899",
  "dateOfBirth": "1995-03-20",
  "gender": "female",
  "bloodGroup": "B+",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Spouse",
    "phone": "+1234567898"
  }
}
```

### PUT /patients/:id
Update patient (Protected: admin, receptionist)

### DELETE /patients/:id
Delete patient (Protected: admin)

## Doctors

### GET /doctors
Get all doctors (Public)

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "doctor_id",
      "user": {
        "name": "Dr. John Smith",
        "email": "doctor@hospital.com",
        "phone": "+1234567892"
      },
      "doctorId": "DOC000001",
      "specialization": "Cardiology",
      "qualification": "MD, FACC",
      "experience": 15,
      "licenseNumber": "MED123456",
      "department": "Cardiology",
      "consultationFee": 150,
      "availability": [
        {
          "day": "monday",
          "startTime": "09:00",
          "endTime": "17:00"
        }
      ],
      "isAvailable": true
    }
  ]
}
```

### GET /doctors/:id
Get doctor by ID (Public)

### POST /doctors
Create new doctor (Protected: admin)

**Request Body:**
```json
{
  "name": "Dr. Sarah Johnson",
  "email": "sarah@hospital.com",
  "password": "Doctor@123",
  "phone": "+1234567900",
  "specialization": "Neurology",
  "qualification": "MD, PhD",
  "experience": 10,
  "licenseNumber": "MED123459",
  "department": "Neurology",
  "consultationFee": 200,
  "availability": [
    {
      "day": "monday",
      "startTime": "10:00",
      "endTime": "18:00"
    },
    {
      "day": "wednesday",
      "startTime": "10:00",
      "endTime": "18:00"
    }
  ]
}
```

### PUT /doctors/:id
Update doctor (Protected: admin)

### DELETE /doctors/:id
Delete doctor (Protected: admin)

## Appointments

### GET /appointments
Get all appointments (Protected, filtered by role)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "appointment_id",
      "appointmentId": "APT000001",
      "patient": {
        "patientId": "PAT000001",
        "user": {
          "name": "Alice Williams",
          "email": "patient@hospital.com",
          "phone": "+1234567895"
        }
      },
      "doctor": {
        "doctorId": "DOC000001",
        "user": {
          "name": "Dr. John Smith",
          "email": "doctor@hospital.com",
          "phone": "+1234567892"
        },
        "specialization": "Cardiology"
      },
      "appointmentDate": "2024-01-20",
      "appointmentTime": "10:00",
      "status": "scheduled",
      "reason": "Regular checkup",
      "notes": ""
    }
  ]
}
```

### GET /appointments/:id
Get appointment by ID (Protected)

### POST /appointments
Create new appointment (Protected: admin, receptionist)

**Request Body:**
```json
{
  "patient": "patient_id",
  "doctor": "doctor_id",
  "appointmentDate": "2024-01-25",
  "appointmentTime": "14:00",
  "reason": "Follow-up consultation",
  "notes": "Patient requested afternoon slot"
}
```

### PUT /appointments/:id
Update appointment (Protected)

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Confirmed via phone"
}
```

### DELETE /appointments/:id
Delete appointment (Protected: admin, receptionist)

## Prescriptions

### GET /prescriptions
Get all prescriptions (Protected, filtered by role)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "prescription_id",
      "prescriptionId": "PRX000001",
      "patient": {
        "patientId": "PAT000001",
        "user": {
          "name": "Alice Williams"
        }
      },
      "doctor": {
        "doctorId": "DOC000001",
        "user": {
          "name": "Dr. John Smith"
        }
      },
      "diagnosis": "Hypertension",
      "symptoms": ["High blood pressure", "Headache"],
      "medications": [
        {
          "name": "Lisinopril",
          "dosage": "10mg",
          "frequency": "Once daily",
          "duration": "30 days",
          "instructions": "Take in the morning"
        }
      ],
      "labTests": [],
      "followUpDate": "2024-02-20",
      "prescriptionDate": "2024-01-20"
    }
  ]
}
```

### GET /prescriptions/:id
Get prescription by ID (Protected)

### POST /prescriptions
Create new prescription (Protected: doctor)

**Request Body:**
```json
{
  "patient": "patient_id",
  "appointment": "appointment_id",
  "diagnosis": "Common Cold",
  "symptoms": ["Cough", "Fever", "Sore throat"],
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Three times daily",
      "duration": "5 days",
      "instructions": "Take after meals"
    }
  ],
  "labTests": [
    {
      "testName": "Complete Blood Count",
      "instructions": "Fasting required"
    }
  ],
  "followUpDate": "2024-02-01",
  "notes": "Rest and plenty of fluids"
}
```

### PUT /prescriptions/:id
Update prescription (Protected: doctor)

### DELETE /prescriptions/:id
Delete prescription (Protected: admin, doctor)

## Bills

### GET /bills
Get all bills (Protected, filtered by role)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "bill_id",
      "billId": "BILL000001",
      "patient": {
        "patientId": "PAT000001",
        "user": {
          "name": "Alice Williams"
        }
      },
      "items": [
        {
          "description": "Consultation Fee",
          "quantity": 1,
          "unitPrice": 150,
          "amount": 150
        },
        {
          "description": "Lab Tests",
          "quantity": 2,
          "unitPrice": 50,
          "amount": 100
        }
      ],
      "subtotal": 250,
      "tax": 25,
      "discount": 0,
      "total": 275,
      "paymentStatus": "pending",
      "paidAmount": 0,
      "billDate": "2024-01-20"
    }
  ]
}
```

### GET /bills/:id
Get bill by ID (Protected)

### POST /bills
Create new bill (Protected: admin, receptionist)

**Request Body:**
```json
{
  "patient": "patient_id",
  "appointment": "appointment_id",
  "items": [
    {
      "description": "Consultation Fee - Cardiology",
      "quantity": 1,
      "unitPrice": 150,
      "amount": 150
    },
    {
      "description": "ECG Test",
      "quantity": 1,
      "unitPrice": 75,
      "amount": 75
    }
  ],
  "subtotal": 225,
  "tax": 22.5,
  "discount": 0,
  "total": 247.5,
  "paymentMethod": "card",
  "dueDate": "2024-02-20"
}
```

### PUT /bills/:id
Update bill (Protected: admin, receptionist)

**Request Body:**
```json
{
  "paymentStatus": "paid",
  "paidAmount": 247.5,
  "paymentMethod": "cash"
}
```

### DELETE /bills/:id
Delete bill (Protected: admin)

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Role-Based Access Control

| Endpoint | Admin | Doctor | Receptionist | Patient |
|----------|-------|--------|--------------|---------|
| GET /patients | ✅ | ✅ | ✅ | ❌ |
| POST /patients | ✅ | ❌ | ✅ | ❌ |
| PUT /patients | ✅ | ❌ | ✅ | ❌ |
| DELETE /patients | ✅ | ❌ | ❌ | ❌ |
| GET /doctors | ✅ | ✅ | ✅ | ✅ |
| POST /doctors | ✅ | ❌ | ❌ | ❌ |
| GET /appointments | ✅ | ✅ | ✅ | ✅ |
| POST /appointments | ✅ | ❌ | ✅ | ❌ |
| POST /prescriptions | ❌ | ✅ | ❌ | ❌ |
| GET /prescriptions | ✅ | ✅ | ❌ | ✅ |
| POST /bills | ✅ | ❌ | ✅ | ❌ |
| GET /bills | ✅ | ❌ | ✅ | ✅ |
