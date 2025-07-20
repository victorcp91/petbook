/**
 * Test Data Factories for PetBook Application
 *
 * This file contains factories for generating consistent test data
 * across all tests. Factories support customization while providing
 * sensible defaults.
 */

// Types for test data
interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'employee' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface PetData {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed: string;
  birthDate: string;
  weight: number;
  color: string;
  notes?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentData {
  id: string;
  petId: string;
  clientId: string;
  serviceType: 'banho_tosa' | 'vacinacao' | 'consulta' | 'cirurgia' | 'outro';
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStatsData {
  totalPets: number;
  totalClients: number;
  totalAppointments: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentAppointments: AppointmentData[];
  upcomingAppointments: AppointmentData[];
  topServices: ServiceData[];
}

// Utility functions
const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const generateDate = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

const generatePhone = (): string => {
  const ddd = Math.floor(Math.random() * 90) + 10;
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `(${ddd}) ${number.toString().substring(0, 4)}-${number.toString().substring(4)}`;
};

const generateEmail = (name: string): string => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name.toLowerCase().replace(/\s+/g, '.')}@${domain}`;
};

// User Factory
export const createUser = (overrides: Partial<UserData> = {}): UserData => {
  const defaultName = 'Test User';
  return {
    id: generateId(),
    email: generateEmail(defaultName),
    name: defaultName,
    role: 'owner',
    phone: generatePhone(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
    createdAt: generateDate(-30),
    updatedAt: generateDate(),
    ...overrides,
  };
};

// Pet Factory
export const createPet = (overrides: Partial<PetData> = {}): PetData => {
  const species = ['dog', 'cat', 'bird', 'fish', 'other'];
  const breeds = {
    dog: [
      'Golden Retriever',
      'Labrador',
      'German Shepherd',
      'Bulldog',
      'Poodle',
    ],
    cat: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'],
    bird: ['Canary', 'Parakeet', 'Cockatiel', 'Macaw', 'Cockatoo'],
    fish: ['Goldfish', 'Betta', 'Guppy', 'Tetra', 'Angelfish'],
    other: ['Hamster', 'Rabbit', 'Guinea Pig', 'Ferret', 'Turtle'],
  };

  const selectedSpecies =
    overrides.species || species[Math.floor(Math.random() * species.length)];
  const availableBreeds =
    breeds[selectedSpecies as keyof typeof breeds] || breeds.dog;
  const selectedBreed =
    availableBreeds[Math.floor(Math.random() * availableBreeds.length)];

  return {
    id: generateId(),
    name: `Pet ${Math.floor(Math.random() * 1000)}`,
    species: selectedSpecies as PetData['species'],
    breed: selectedBreed,
    birthDate: generateDate(-365 * 2), // 2 years ago
    weight: Math.floor(Math.random() * 50) + 1,
    color: ['Dourado', 'Preto', 'Branco', 'Marrom', 'Cinza'][
      Math.floor(Math.random() * 5)
    ],
    notes: 'Test pet for automated testing',
    ownerId: generateId(),
    createdAt: generateDate(-30),
    updatedAt: generateDate(),
    ...overrides,
  };
};

// Client Factory
export const createClient = (
  overrides: Partial<ClientData> = {}
): ClientData => {
  const names = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Ferreira',
  ];
  const cities = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Salvador',
    'Brasília',
  ];
  const states = ['SP', 'RJ', 'MG', 'BA', 'DF'];

  const selectedName = names[Math.floor(Math.random() * names.length)];
  const selectedCity = cities[Math.floor(Math.random() * cities.length)];
  const selectedState = states[Math.floor(Math.random() * states.length)];

  return {
    id: generateId(),
    name: selectedName,
    email: generateEmail(selectedName),
    phone: generatePhone(),
    address: `Rua ${Math.floor(Math.random() * 1000)}, ${Math.floor(Math.random() * 100)}`,
    city: selectedCity,
    state: selectedState,
    zipCode: `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`,
    notes: 'Test client for automated testing',
    createdAt: generateDate(-60),
    updatedAt: generateDate(),
    ...overrides,
  };
};

// Appointment Factory
export const createAppointment = (
  overrides: Partial<AppointmentData> = {}
): AppointmentData => {
  const serviceTypes: AppointmentData['serviceType'][] = [
    'banho_tosa',
    'vacinacao',
    'consulta',
    'cirurgia',
    'outro',
  ];
  const statuses: AppointmentData['status'][] = [
    'scheduled',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
  ];

  const selectedService =
    serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
  const selectedStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: generateId(),
    petId: generateId(),
    clientId: generateId(),
    serviceType: selectedService,
    appointmentDate: generateDate(Math.floor(Math.random() * 30) + 1), // Future date
    appointmentTime: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 4) * 15}`,
    duration: [30, 60, 90, 120][Math.floor(Math.random() * 4)],
    status: selectedStatus,
    notes: 'Test appointment for automated testing',
    price: Math.floor(Math.random() * 200) + 50,
    createdAt: generateDate(-7),
    updatedAt: generateDate(),
    ...overrides,
  };
};

// Service Factory
export const createService = (
  overrides: Partial<ServiceData> = {}
): ServiceData => {
  const services = [
    {
      name: 'Banho e Tosa',
      description: 'Banho completo com tosa',
      price: 80,
      duration: 90,
    },
    {
      name: 'Vacinação',
      description: 'Aplicação de vacinas',
      price: 120,
      duration: 30,
    },
    {
      name: 'Consulta Veterinária',
      description: 'Consulta com veterinário',
      price: 150,
      duration: 60,
    },
    {
      name: 'Cirurgia',
      description: 'Procedimento cirúrgico',
      price: 500,
      duration: 120,
    },
    {
      name: 'Exame Laboratorial',
      description: 'Exames de sangue e outros',
      price: 200,
      duration: 45,
    },
  ];

  const selectedService = services[Math.floor(Math.random() * services.length)];

  return {
    id: generateId(),
    name: selectedService.name,
    description: selectedService.description,
    price: selectedService.price,
    duration: selectedService.duration,
    category: ['Grooming', 'Saúde', 'Cirurgia', 'Exames'][
      Math.floor(Math.random() * 4)
    ],
    isActive: true,
    createdAt: generateDate(-90),
    updatedAt: generateDate(),
    ...overrides,
  };
};

// Dashboard Stats Factory
export const createDashboardStats = (
  overrides: Partial<DashboardStatsData> = {}
): DashboardStatsData => {
  const recentAppointments = Array.from({ length: 5 }, () =>
    createAppointment({ status: 'completed' })
  );
  const upcomingAppointments = Array.from({ length: 3 }, () =>
    createAppointment({ status: 'scheduled' })
  );
  const topServices = Array.from({ length: 4 }, () => createService());

  return {
    totalPets: Math.floor(Math.random() * 200) + 50,
    totalClients: Math.floor(Math.random() * 100) + 25,
    totalAppointments: Math.floor(Math.random() * 500) + 100,
    totalRevenue: Math.floor(Math.random() * 50000) + 10000,
    monthlyGrowth: Math.floor(Math.random() * 30) + 5,
    recentAppointments,
    upcomingAppointments,
    topServices,
    ...overrides,
  };
};

// Collection Factories
export const createUserCollection = (count: number = 5): UserData[] => {
  return Array.from({ length: count }, () => createUser());
};

export const createPetCollection = (count: number = 10): PetData[] => {
  return Array.from({ length: count }, () => createPet());
};

export const createClientCollection = (count: number = 15): ClientData[] => {
  return Array.from({ length: count }, () => createClient());
};

export const createAppointmentCollection = (
  count: number = 20
): AppointmentData[] => {
  return Array.from({ length: count }, () => createAppointment());
};

export const createServiceCollection = (count: number = 8): ServiceData[] => {
  return Array.from({ length: count }, () => createService());
};

// Specialized Factories
export const createOwnerUser = (
  overrides: Partial<UserData> = {}
): UserData => {
  return createUser({ role: 'owner', ...overrides });
};

export const createEmployeeUser = (
  overrides: Partial<UserData> = {}
): UserData => {
  return createUser({ role: 'employee', ...overrides });
};

export const createDogPet = (overrides: Partial<PetData> = {}): PetData => {
  return createPet({ species: 'dog', ...overrides });
};

export const createCatPet = (overrides: Partial<PetData> = {}): PetData => {
  return createPet({ species: 'cat', ...overrides });
};

export const createScheduledAppointment = (
  overrides: Partial<AppointmentData> = {}
): AppointmentData => {
  return createAppointment({ status: 'scheduled', ...overrides });
};

export const createCompletedAppointment = (
  overrides: Partial<AppointmentData> = {}
): AppointmentData => {
  return createAppointment({ status: 'completed', ...overrides });
};

// Export all factories for use in tests
export const factories = {
  createUser,
  createPet,
  createClient,
  createAppointment,
  createService,
  createDashboardStats,
  createUserCollection,
  createPetCollection,
  createClientCollection,
  createAppointmentCollection,
  createServiceCollection,
  createOwnerUser,
  createEmployeeUser,
  createDogPet,
  createCatPet,
  createScheduledAppointment,
  createCompletedAppointment,
};
