import api from '../config/api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const patientService = {
    getAll: async () => {
        const response = await api.get('/patients');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    create: async (patientData) => {
        const response = await api.post('/patients', patientData);
        return response.data;
    },

    update: async (id, patientData) => {
        const response = await api.put(`/patients/${id}`, patientData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/patients/${id}`);
        return response.data;
    },
};

export const doctorService = {
    getAll: async () => {
        const response = await api.get('/doctors');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/doctors/${id}`);
        return response.data;
    },

    create: async (doctorData) => {
        const response = await api.post('/doctors', doctorData);
        return response.data;
    },

    update: async (id, doctorData) => {
        const response = await api.put(`/doctors/${id}`, doctorData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/doctors/${id}`);
        return response.data;
    },
};

export const appointmentService = {
    getAll: async () => {
        const response = await api.get('/appointments');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    create: async (appointmentData) => {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    },

    update: async (id, appointmentData) => {
        const response = await api.put(`/appointments/${id}`, appointmentData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    },
};

export const prescriptionService = {
    getAll: async () => {
        const response = await api.get('/prescriptions');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/prescriptions/${id}`);
        return response.data;
    },

    create: async (prescriptionData) => {
        const response = await api.post('/prescriptions', prescriptionData);
        return response.data;
    },

    update: async (id, prescriptionData) => {
        const response = await api.put(`/prescriptions/${id}`, prescriptionData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/prescriptions/${id}`);
        return response.data;
    },
};

export const billService = {
    getAll: async () => {
        const response = await api.get('/bills');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/bills/${id}`);
        return response.data;
    },

    create: async (billData) => {
        const response = await api.post('/bills', billData);
        return response.data;
    },

    update: async (id, billData) => {
        const response = await api.put(`/bills/${id}`, billData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/bills/${id}`);
        return response.data;
    },
};
