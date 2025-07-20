# Test Data Factories and Mocks System

## Overview

This document describes the comprehensive test data factories and mocks system implemented for the PetBook application. The system provides consistent, reusable test data generation and API mocking capabilities.

## 🏭 Test Data Factories

### Core Factories

#### User Factory

```typescript
import { factories } from '../support/factories';

// Create a basic user
const user = factories.createUser();

// Create a user with custom data
const owner = factories.createUser({
  name: 'John Doe',
  email: 'john@petbook.com',
  role: 'owner',
});

// Create specialized users
const ownerUser = factories.createOwnerUser();
const employeeUser = factories.createEmployeeUser();
```

#### Pet Factory

```typescript
// Create a basic pet
const pet = factories.createPet();

// Create a pet with custom data
const dog = factories.createPet({
  name: 'Buddy',
  species: 'dog',
  breed: 'Golden Retriever',
  weight: 25,
});

// Create specialized pets
const dogPet = factories.createDogPet();
const catPet = factories.createCatPet();
```

#### Client Factory

```typescript
// Create a basic client
const client = factories.createClient();

// Create a client with custom data
const client = factories.createClient({
  name: 'Maria Santos',
  email: 'maria@example.com',
  phone: '(11) 99999-9999',
});
```

#### Appointment Factory

```typescript
// Create a basic appointment
const appointment = factories.createAppointment();

// Create an appointment with custom data
const appointment = factories.createAppointment({
  serviceType: 'banho_tosa',
  status: 'scheduled',
  price: 100,
});

// Create specialized appointments
const scheduledAppointment = factories.createScheduledAppointment();
const completedAppointment = factories.createCompletedAppointment();
```

#### Service Factory

```typescript
// Create a basic service
const service = factories.createService();

// Create a service with custom data
const service = factories.createService({
  name: 'Banho e Tosa',
  price: 80,
  duration: 90,
});
```

#### Dashboard Stats Factory

```typescript
// Create dashboard statistics
const stats = factories.createDashboardStats();

// Create stats with custom data
const stats = factories.createDashboardStats({
  totalPets: 150,
  totalAppointments: 45,
  totalRevenue: 12500,
});
```

### Collection Factories

```typescript
// Create collections of test data
const users = factories.createUserCollection(5);
const pets = factories.createPetCollection(10);
const clients = factories.createClientCollection(15);
const appointments = factories.createAppointmentCollection(20);
const services = factories.createServiceCollection(8);
```

## 🎭 Mock System

### Authentication Mocks

```typescript
import { mocks } from '../support/mocks';

// Mock login response
const loginResponse = mocks.auth.login({
  name: 'Test Owner',
  email: 'owner@petbook.com',
});

// Mock logout response
const logoutResponse = mocks.auth.logout();

// Mock token refresh
const refreshResponse = mocks.auth.refreshToken();
```

### API Response Mocks

#### User Management

```typescript
// Mock user API responses
const userResponse = mocks.users.getCurrentUser();
const usersList = mocks.users.getUsers(10);
const profileUpdate = mocks.users.updateProfile();
```

#### Pet Management

```typescript
// Mock pet API responses
const petsList = mocks.pets.getPets(15);
const petDetails = mocks.pets.getPet();
const createPet = mocks.pets.createPet();
const updatePet = mocks.pets.updatePet();
const deletePet = mocks.pets.deletePet();
const searchPets = mocks.pets.searchPets('Buddy', 5);
```

#### Client Management

```typescript
// Mock client API responses
const clientsList = mocks.clients.getClients(20);
const clientDetails = mocks.clients.getClient();
const createClient = mocks.clients.createClient();
const updateClient = mocks.clients.updateClient();
const deleteClient = mocks.clients.deleteClient();
const searchClients = mocks.clients.searchClients('Maria', 5);
```

#### Appointment Management

```typescript
// Mock appointment API responses
const appointmentsList = mocks.appointments.getAppointments(25);
const appointmentDetails = mocks.appointments.getAppointment();
const createAppointment = mocks.appointments.createAppointment();
const updateAppointment = mocks.appointments.updateAppointment();
const deleteAppointment = mocks.appointments.deleteAppointment();
const appointmentsByDate = mocks.appointments.getAppointmentsByDate(
  '2024-02-15',
  8
);
```

#### Service Management

```typescript
// Mock service API responses
const servicesList = mocks.services.getServices(10);
const serviceDetails = mocks.services.getService();
const createService = mocks.services.createService();
const updateService = mocks.services.updateService();
const deleteService = mocks.services.deleteService();
```

#### Dashboard Mocks

```typescript
// Mock dashboard API responses
const dashboardStats = mocks.dashboard.getStats();
const recentActivity = mocks.dashboard.getRecentActivity(10);
const revenueChart = mocks.dashboard.getRevenueChart();
```

### Error Response Mocks

```typescript
// Mock various error scenarios
const notFound = mocks.errors.notFound('Pet');
const unauthorized = mocks.errors.unauthorized();
const forbidden = mocks.errors.forbidden();
const validationError = mocks.errors.validationError('name');
const serverError = mocks.errors.serverError();
const networkError = mocks.errors.networkError();
const timeout = mocks.errors.timeout();
```

### File Upload Mocks

```typescript
// Mock file upload responses
const imageUpload = mocks.files.uploadImage('pet-photo.jpg');
const documentUpload = mocks.files.uploadDocument('report.pdf');
```

### Notification Mocks

```typescript
// Mock notification responses
const emailSent = mocks.notifications.sendEmail();
const smsSent = mocks.notifications.sendSMS();
const pushSent = mocks.notifications.sendPushNotification();
```

### Payment Mocks

```typescript
// Mock payment responses
const paymentCreated = mocks.payments.createPayment(100);
const paymentConfirmed = mocks.payments.confirmPayment('pay_123');
```

## 🛠️ Cypress Commands Integration

### Enhanced Commands

The factories and mocks are integrated into Cypress commands for easy use in tests:

```typescript
// Authentication
cy.mockAuthFlow({
  name: 'Test Owner',
  email: 'owner@petbook.com',
  role: 'owner',
});

// API Mocking
cy.mockPetAPI();
cy.mockClientAPI();
cy.mockAppointmentAPI();
cy.mockDashboardAPI({
  totalPets: 150,
  totalAppointments: 45,
});

// Error Scenarios
cy.mockErrorScenarios();

// Test Data Creation
const pets = cy.createTestDataCollection('pets', 5);
const customPet = cy.createTestPet({
  name: 'Buddy',
  species: 'dog',
});
```

### Custom Commands Available

| Command                    | Description                       | Parameters                          |
| -------------------------- | --------------------------------- | ----------------------------------- |
| `mockAuthFlow`             | Mock complete authentication flow | `userData`                          |
| `mockPetAPI`               | Mock pet management API           | `pets`                              |
| `mockClientAPI`            | Mock client management API        | `clients`                           |
| `mockAppointmentAPI`       | Mock appointment management API   | `appointments`                      |
| `mockDashboardAPI`         | Mock dashboard API                | `stats`                             |
| `mockErrorScenarios`       | Mock various error scenarios      | None                                |
| `createTestDataCollection` | Create collection of test data    | `type`, `count`                     |
| `mockPaginatedResponse`    | Mock paginated API response       | `endpoint`, `data`, `page`, `limit` |

## 📊 Data Generation Features

### Realistic Data Generation

- **Names**: Brazilian names for clients and users
- **Phone Numbers**: Brazilian format with DDD
- **Addresses**: Brazilian addresses with cities and states
- **Dates**: Realistic dates with proper formatting
- **IDs**: Unique identifiers for all entities
- **Emails**: Generated from names with common domains

### Customization Support

All factories support customization through overrides:

```typescript
// Override specific fields while keeping defaults
const customPet = factories.createPet({
  name: 'Custom Pet',
  species: 'dog',
  weight: 30,
});

// Create specialized data
const ownerUser = factories.createOwnerUser({
  name: 'John Doe',
  email: 'john@petbook.com',
});
```

### Collection Generation

```typescript
// Generate collections with custom count
const users = factories.createUserCollection(10);
const pets = factories.createPetCollection(15);
const clients = factories.createClientCollection(20);

// Collections maintain data consistency
users.forEach(user => {
  expect(user).to.have.property('id');
  expect(user).to.have.property('email');
  expect(user).to.have.property('name');
});
```

## 🎯 Usage Examples

### Basic Test Setup

```typescript
describe('Pet Management', () => {
  beforeEach(() => {
    // Setup mocks
    cy.mockAuthFlow();
    cy.mockPetAPI();

    // Clear test data
    cy.clearTestData();
  });

  it('should create a new pet', () => {
    const pet = cy.createTestPet({
      name: 'Buddy',
      species: 'dog',
    });

    cy.visit('/pets');
    cy.contains('Add Pet').click();

    // Fill form with pet data
    cy.get('input[name="name"]').type('Buddy');
    cy.get('select[name="species"]').select('dog');
    cy.get('button[type="submit"]').click();

    // Verify API call
    cy.wait('@createPet');
  });
});
```

### Error Handling Test

```typescript
describe('Error Handling', () => {
  it('should handle network errors', () => {
    cy.mockNetworkError('/api/pets');

    cy.visit('/pets');

    // Should show error state
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should handle validation errors', () => {
    cy.mockApiError('/api/pets', 422, 'Validation failed');

    cy.visit('/pets');
    cy.contains('Add Pet').click();
    cy.get('button[type="submit"]').click();

    // Should show validation errors
    cy.get('[data-testid="validation-error"]').should('be.visible');
  });
});
```

### Dashboard Test

```typescript
describe('Dashboard', () => {
  it('should display dashboard statistics', () => {
    cy.mockDashboardAPI({
      totalPets: 150,
      totalAppointments: 45,
      totalRevenue: 12500,
    });

    cy.visit('/dashboard');

    // Verify API calls
    cy.wait('@getDashboardStats');
    cy.wait('@getRecentActivity');
    cy.wait('@getRevenueChart');

    // Verify displayed data
    cy.get('body').should('contain', '150');
    cy.get('body').should('contain', '45');
    cy.get('body').should('contain', '12500');
  });
});
```

## 🔧 Configuration

### Factory Configuration

Factories can be configured globally:

```typescript
// Set default values for all factories
const defaultConfig = {
  baseUrl: 'http://localhost:3000',
  apiTimeout: 5000,
  retryAttempts: 3,
};

// Configure factories with defaults
factories.configure(defaultConfig);
```

### Mock Configuration

Mocks can be configured for different environments:

```typescript
// Development mocks
const devMocks = {
  delay: 100,
  errorRate: 0.1,
};

// Production mocks
const prodMocks = {
  delay: 0,
  errorRate: 0,
};
```

## 📈 Benefits

### Consistency

- All tests use the same data structure
- Consistent API responses across tests
- Standardized error handling

### Maintainability

- Centralized test data management
- Easy to update data structures
- Reusable mock configurations

### Reliability

- Deterministic test data generation
- Controlled API responses
- Predictable test behavior

### Scalability

- Easy to add new data types
- Extensible mock system
- Support for complex scenarios

## 🚀 Next Steps

### Immediate Actions

1. **Integrate with existing tests** - Update current tests to use factories
2. **Add more specialized factories** - Create factories for edge cases
3. **Implement data seeding** - Add database seeding capabilities
4. **Add performance testing** - Create factories for load testing

### Future Enhancements

1. **Visual regression testing** - Add factories for UI components
2. **Accessibility testing** - Create factories for accessibility scenarios
3. **Internationalization** - Add support for multiple languages
4. **Real-time data** - Add factories for WebSocket scenarios

---

**Implementation Date:** 2025-07-20  
**Status:** ✅ Complete and Functional  
**Next Phase:** Integration with existing test suite
