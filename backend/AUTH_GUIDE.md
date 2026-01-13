# Authentication API Guide

This guide details how to use the authentication system.

## 1. Register a User
**Endpoint:** `POST /api/auth/register`
**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "doctor",  // Optional. Defaults to "patient". Options: "admin", "doctor", "receptionist", "patient"
  "phone": "1234567890"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "doctor",
    "phone": "1234567890"
  }
}
```

## 2. Login User
**Endpoint:** `POST /api/auth/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "doctor",
    "phone": "1234567890"
  }
}
```

## 3. Get Current User / Protected Route Example
**Endpoint:** `GET /api/auth/me`
**Access:** Private (Requires Token)

**Headers:**
```
Authorization: Bearer <your_token_here>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "doctor",
    "phone": "1234567890",
    "isActive": true,
    "createdAt": "2021-06-22T00:00:00.000Z",
    "updatedAt": "2021-06-22T00:00:00.000Z",
    "__v": 0
  }
}
```
