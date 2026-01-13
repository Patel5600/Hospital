const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Define schemas (same as backend models)
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    phone: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientId: { type: String, unique: true },
    dateOfBirth: Date,
    gender: String,
    bloodGroup: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        notes: String
    }],
    allergies: [String],
    currentMedications: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: { type: String, unique: true },
    specialization: String,
    qualification: String,
    experience: Number,
    licenseNumber: { type: String, unique: true },
    department: String,
    consultationFee: Number,
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);

// Seed data
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany();
        await Patient.deleteMany();
        await Doctor.deleteMany();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        // Create Admin User
        console.log('Creating admin user...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@hospital.com',
            password: hashedPassword,
            role: 'admin',
            phone: '+1234567890'
        });

        // Create Receptionist User
        console.log('Creating receptionist user...');
        const receptionistPassword = await bcrypt.hash('Receptionist@123', salt);
        const receptionistUser = await User.create({
            name: 'Sarah Johnson',
            email: 'receptionist@hospital.com',
            password: receptionistPassword,
            role: 'receptionist',
            phone: '+1234567891'
        });

        // Create Doctor Users
        console.log('Creating doctor users...');
        const doctorPassword = await bcrypt.hash('Doctor@123', salt);

        const doctor1User = await User.create({
            name: 'Dr. John Smith',
            email: 'doctor@hospital.com',
            password: doctorPassword,
            role: 'doctor',
            phone: '+1234567892'
        });

        const doctor2User = await User.create({
            name: 'Dr. Emily Davis',
            email: 'emily.davis@hospital.com',
            password: doctorPassword,
            role: 'doctor',
            phone: '+1234567893'
        });

        const doctor3User = await User.create({
            name: 'Dr. Michael Brown',
            email: 'michael.brown@hospital.com',
            password: doctorPassword,
            role: 'doctor',
            phone: '+1234567894'
        });

        // Create Patient User
        console.log('Creating patient user...');
        const patientPassword = await bcrypt.hash('Patient@123', salt);
        const patient1User = await User.create({
            name: 'Alice Williams',
            email: 'patient@hospital.com',
            password: patientPassword,
            role: 'patient',
            phone: '+1234567895'
        });

        const patient2User = await User.create({
            name: 'Robert Miller',
            email: 'robert.miller@hospital.com',
            password: patientPassword,
            role: 'patient',
            phone: '+1234567896'
        });

        // Create Doctor Profiles
        console.log('Creating doctor profiles...');
        await Doctor.create({
            user: doctor1User._id,
            doctorId: 'DOC000001',
            specialization: 'Cardiology',
            qualification: 'MD, FACC',
            experience: 15,
            licenseNumber: 'MED123456',
            department: 'Cardiology',
            consultationFee: 150,
            availability: [
                { day: 'monday', startTime: '09:00', endTime: '17:00' },
                { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
                { day: 'friday', startTime: '09:00', endTime: '17:00' }
            ]
        });

        await Doctor.create({
            user: doctor2User._id,
            doctorId: 'DOC000002',
            specialization: 'Pediatrics',
            qualification: 'MD, FAAP',
            experience: 10,
            licenseNumber: 'MED123457',
            department: 'Pediatrics',
            consultationFee: 120,
            availability: [
                { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
                { day: 'thursday', startTime: '10:00', endTime: '18:00' },
                { day: 'saturday', startTime: '09:00', endTime: '13:00' }
            ]
        });

        await Doctor.create({
            user: doctor3User._id,
            doctorId: 'DOC000003',
            specialization: 'Orthopedics',
            qualification: 'MD, FAAOS',
            experience: 12,
            licenseNumber: 'MED123458',
            department: 'Orthopedics',
            consultationFee: 140,
            availability: [
                { day: 'monday', startTime: '08:00', endTime: '16:00' },
                { day: 'tuesday', startTime: '08:00', endTime: '16:00' },
                { day: 'thursday', startTime: '08:00', endTime: '16:00' }
            ]
        });

        // Create Patient Profiles
        console.log('Creating patient profiles...');
        await Patient.create({
            user: patient1User._id,
            patientId: 'PAT000001',
            dateOfBirth: new Date('1990-05-15'),
            gender: 'female',
            bloodGroup: 'A+',
            address: {
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
            },
            emergencyContact: {
                name: 'John Williams',
                relationship: 'Spouse',
                phone: '+1234567897'
            },
            allergies: ['Penicillin'],
            currentMedications: ['Aspirin 81mg daily']
        });

        await Patient.create({
            user: patient2User._id,
            patientId: 'PAT000002',
            dateOfBirth: new Date('1985-08-22'),
            gender: 'male',
            bloodGroup: 'O+',
            address: {
                street: '456 Oak Avenue',
                city: 'Los Angeles',
                state: 'CA',
                zipCode: '90001',
                country: 'USA'
            },
            emergencyContact: {
                name: 'Mary Miller',
                relationship: 'Spouse',
                phone: '+1234567898'
            },
            allergies: [],
            currentMedications: []
        });

        console.log('✅ Database seeded successfully!');
        console.log('\n📋 Default Users:');
        console.log('Admin: admin@hospital.com / Admin@123');
        console.log('Receptionist: receptionist@hospital.com / Receptionist@123');
        console.log('Doctor: doctor@hospital.com / Doctor@123');
        console.log('Patient: patient@hospital.com / Patient@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
