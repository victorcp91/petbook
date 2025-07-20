/**
 * Mock System for PetBook Application
 *
 * This file contains mocks for external dependencies, API calls,
 * and other external services used in the application.
 */

import {
  createUser,
  createPet,
  createClient,
  createAppointment,
  createService,
  createDashboardStats,
} from './factories';

// Mock API Response Types
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Mocks
export const mockAuthResponses = {
  login: (userData = {}) => {
    const user = createUser(userData);
    return {
      statusCode: 200,
      body: {
        user,
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
        refreshToken:
          'mock-refresh-token-' + Math.random().toString(36).substring(2),
      },
    };
  },

  logout: () => ({
    statusCode: 200,
    body: { message: 'Logged out successfully' },
  }),

  refreshToken: (userData = {}) => {
    const user = createUser(userData);
    return {
      statusCode: 200,
      body: {
        user,
        token: 'mock-new-jwt-token-' + Math.random().toString(36).substring(2),
      },
    };
  },

  forgotPassword: () => ({
    statusCode: 200,
    body: { message: 'Password reset email sent' },
  }),

  resetPassword: () => ({
    statusCode: 200,
    body: { message: 'Password reset successfully' },
  }),
};

// User Management Mocks
export const mockUserResponses = {
  getCurrentUser: (userData = {}) => ({
    statusCode: 200,
    body: createUser(userData),
  }),

  updateProfile: (userData = {}) => ({
    statusCode: 200,
    body: createUser(userData),
  }),

  changePassword: () => ({
    statusCode: 200,
    body: { message: 'Password changed successfully' },
  }),

  getUsers: (count = 10) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () => createUser()),
      pagination: {
        page: 1,
        limit: 10,
        total: count,
        totalPages: Math.ceil(count / 10),
      },
    },
  }),
};

// Pet Management Mocks
export const mockPetResponses = {
  getPets: (count = 15) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () => createPet()),
      pagination: {
        page: 1,
        limit: 15,
        total: count,
        totalPages: Math.ceil(count / 15),
      },
    },
  }),

  getPet: (petData = {}) => ({
    statusCode: 200,
    body: createPet(petData),
  }),

  createPet: (petData = {}) => ({
    statusCode: 201,
    body: createPet(petData),
  }),

  updatePet: (petData = {}) => ({
    statusCode: 200,
    body: createPet(petData),
  }),

  deletePet: () => ({
    statusCode: 200,
    body: { message: 'Pet deleted successfully' },
  }),

  searchPets: (query: string, count = 5) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () =>
        createPet({ name: `Pet matching ${query}` })
      ),
      pagination: {
        page: 1,
        limit: 5,
        total: count,
        totalPages: 1,
      },
    },
  }),
};

// Client Management Mocks
export const mockClientResponses = {
  getClients: (count = 20) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () => createClient()),
      pagination: {
        page: 1,
        limit: 20,
        total: count,
        totalPages: Math.ceil(count / 20),
      },
    },
  }),

  getClient: (clientData = {}) => ({
    statusCode: 200,
    body: createClient(clientData),
  }),

  createClient: (clientData = {}) => ({
    statusCode: 201,
    body: createClient(clientData),
  }),

  updateClient: (clientData = {}) => ({
    statusCode: 200,
    body: createClient(clientData),
  }),

  deleteClient: () => ({
    statusCode: 200,
    body: { message: 'Client deleted successfully' },
  }),

  searchClients: (query: string, count = 5) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () =>
        createClient({ name: `Client matching ${query}` })
      ),
      pagination: {
        page: 1,
        limit: 5,
        total: count,
        totalPages: 1,
      },
    },
  }),
};

// Appointment Management Mocks
export const mockAppointmentResponses = {
  getAppointments: (count = 25) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () => createAppointment()),
      pagination: {
        page: 1,
        limit: 25,
        total: count,
        totalPages: Math.ceil(count / 25),
      },
    },
  }),

  getAppointment: (appointmentData = {}) => ({
    statusCode: 200,
    body: createAppointment(appointmentData),
  }),

  createAppointment: (appointmentData = {}) => ({
    statusCode: 201,
    body: createAppointment(appointmentData),
  }),

  updateAppointment: (appointmentData = {}) => ({
    statusCode: 200,
    body: createAppointment(appointmentData),
  }),

  deleteAppointment: () => ({
    statusCode: 200,
    body: { message: 'Appointment cancelled successfully' },
  }),

  getAppointmentsByDate: (date: string, count = 8) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () =>
        createAppointment({ appointmentDate: date })
      ),
    },
  }),
};

// Service Management Mocks
export const mockServiceResponses = {
  getServices: (count = 10) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () => createService()),
      pagination: {
        page: 1,
        limit: 10,
        total: count,
        totalPages: Math.ceil(count / 10),
      },
    },
  }),

  getService: (serviceData = {}) => ({
    statusCode: 200,
    body: createService(serviceData),
  }),

  createService: (serviceData = {}) => ({
    statusCode: 201,
    body: createService(serviceData),
  }),

  updateService: (serviceData = {}) => ({
    statusCode: 200,
    body: createService(serviceData),
  }),

  deleteService: () => ({
    statusCode: 200,
    body: { message: 'Service deleted successfully' },
  }),
};

// Dashboard Mocks
export const mockDashboardResponses = {
  getStats: (statsData = {}) => ({
    statusCode: 200,
    body: createDashboardStats(statsData),
  }),

  getRecentActivity: (count = 10) => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: count }, () => ({
        type: ['appointment', 'pet', 'client', 'service'][
          Math.floor(Math.random() * 4)
        ],
        action: ['created', 'updated', 'deleted'][
          Math.floor(Math.random() * 3)
        ],
        timestamp: new Date().toISOString(),
        user: createUser(),
        details: 'Activity details',
      })),
    },
  }),

  getRevenueChart: () => ({
    statusCode: 200,
    body: {
      data: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toISOString(),
        revenue: Math.floor(Math.random() * 10000) + 5000,
        appointments: Math.floor(Math.random() * 100) + 20,
      })),
    },
  }),
};

// Error Response Mocks
export const mockErrorResponses = {
  notFound: (resource = 'Resource') => ({
    statusCode: 404,
    body: { error: `${resource} not found` },
  }),

  unauthorized: () => ({
    statusCode: 401,
    body: { error: 'Unauthorized access' },
  }),

  forbidden: () => ({
    statusCode: 403,
    body: { error: 'Access forbidden' },
  }),

  validationError: (field = 'field') => ({
    statusCode: 422,
    body: {
      error: 'Validation failed',
      details: { [field]: [`${field} is required`] },
    },
  }),

  serverError: () => ({
    statusCode: 500,
    body: { error: 'Internal server error' },
  }),

  networkError: () => ({
    forceNetworkError: true,
  }),

  timeout: () => ({
    delay: 10000, // 10 second delay
    statusCode: 200,
    body: { message: 'Delayed response' },
  }),
};

// File Upload Mocks
export const mockFileUploadResponses = {
  uploadImage: (filename = 'test-image.jpg') => ({
    statusCode: 200,
    body: {
      url: `https://example.com/uploads/${filename}`,
      filename,
      size: Math.floor(Math.random() * 1000000) + 100000,
      type: 'image/jpeg',
    },
  }),

  uploadDocument: (filename = 'test-document.pdf') => ({
    statusCode: 200,
    body: {
      url: `https://example.com/documents/${filename}`,
      filename,
      size: Math.floor(Math.random() * 5000000) + 500000,
      type: 'application/pdf',
    },
  }),
};

// Notification Mocks
export const mockNotificationResponses = {
  sendEmail: () => ({
    statusCode: 200,
    body: { message: 'Email sent successfully' },
  }),

  sendSMS: () => ({
    statusCode: 200,
    body: { message: 'SMS sent successfully' },
  }),

  sendPushNotification: () => ({
    statusCode: 200,
    body: { message: 'Push notification sent successfully' },
  }),
};

// Payment Mocks
export const mockPaymentResponses = {
  createPayment: (amount = 100) => ({
    statusCode: 200,
    body: {
      id: 'pay_' + Math.random().toString(36).substring(2),
      amount,
      currency: 'BRL',
      status: 'pending',
      paymentMethod: 'credit_card',
    },
  }),

  confirmPayment: (paymentId: string) => ({
    statusCode: 200,
    body: {
      id: paymentId,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    },
  }),
};

// Export all mocks for use in tests
export const mocks = {
  auth: mockAuthResponses,
  users: mockUserResponses,
  pets: mockPetResponses,
  clients: mockClientResponses,
  appointments: mockAppointmentResponses,
  services: mockServiceResponses,
  dashboard: mockDashboardResponses,
  errors: mockErrorResponses,
  files: mockFileUploadResponses,
  notifications: mockNotificationResponses,
  payments: mockPaymentResponses,
};

// Helper function to create dynamic mocks
export const createMockResponse = (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  responseData: any = {},
  statusCode = 200
) => {
  return {
    statusCode,
    body: responseData,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

// Helper function to create paginated mock responses
export const createPaginatedMock = (
  data: any[],
  page = 1,
  limit = 10,
  total?: number
) => {
  const totalCount = total || data.length;
  return {
    statusCode: 200,
    body: {
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
  };
};
