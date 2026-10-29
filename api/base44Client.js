const DB_VERSION = 'v1';
const AUTH_KEY = 'unishuttle_current_user';

const DEMO_USERS = {
  student: {
    id: 'user-student',
    email: 'ayesha@university.edu',
    full_name: 'Ayesha Khan',
    role: 'student',
  },
  admin: {
    id: 'user-admin',
    email: 'admin@university.edu',
    full_name: 'Admin User',
    role: 'admin',
  },
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function storageKey(entity) {
  return `unishuttle_${DB_VERSION}_${entity}`;
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function now() {
  return new Date().toISOString();
}

function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function sortRecords(records, sort) {
  if (!sort) return records;
  const descending = sort.startsWith('-');
  const field = descending ? sort.slice(1) : sort;
  return [...records].sort((a, b) => {
    const av = a[field] ?? '';
    const bv = b[field] ?? '';
    if (av < bv) return descending ? 1 : -1;
    if (av > bv) return descending ? -1 : 1;
    return 0;
  });
}

function seedIfEmpty(entity, records) {
  const key = storageKey(entity);
  if (localStorage.getItem(key) === null) {
    write(key, records);
  }
}

function seedDatabase() {
  seedIfEmpty('Shuttle', [
    {
      id: 'shuttle-1',
      shuttle_number: 'SH-001',
      name: 'Campus Express',
      capacity: 30,
      vehicle_type: 'standard_bus',
      status: 'active',
      features: ['AC', 'WiFi', 'USB Charging', 'GPS Tracking'],
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'shuttle-2',
      shuttle_number: 'SH-002',
      name: 'North Loop',
      capacity: 20,
      vehicle_type: 'mini_bus',
      status: 'active',
      features: ['AC', 'GPS Tracking'],
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'shuttle-3',
      shuttle_number: 'SH-003',
      name: 'City Link',
      capacity: 45,
      vehicle_type: 'large_bus',
      status: 'active',
      features: ['AC', 'WiFi', 'USB Charging'],
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'shuttle-4',
      shuttle_number: 'SH-004',
      name: 'Library Shuttle',
      capacity: 16,
      vehicle_type: 'mini_bus',
      status: 'maintenance',
      features: ['AC'],
      created_date: now(),
      updated_date: now(),
    },
  ]);

  seedIfEmpty('ShuttleSchedule', [
    {
      id: 'schedule-1',
      shuttle_id: 'shuttle-1',
      route_name: 'Main Campus - Downtown',
      origin: 'Main Campus',
      destination: 'Downtown',
      stops: ['Library', 'City Center'],
      departure_time: '08:00',
      arrival_time: '08:45',
      days_of_operation: ALL_DAYS,
      status: 'active',
      available_seats: 30,
      price: 2.5,
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'schedule-2',
      shuttle_id: 'shuttle-2',
      route_name: 'Dorms - Main Campus',
      origin: 'Student Dorms',
      destination: 'Main Campus',
      stops: ['Sports Complex'],
      departure_time: '07:30',
      arrival_time: '07:55',
      days_of_operation: WEEKDAYS,
      status: 'active',
      available_seats: 20,
      price: 1.5,
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'schedule-3',
      shuttle_id: 'shuttle-3',
      route_name: 'Main Campus - City Mall',
      origin: 'Main Campus',
      destination: 'City Mall',
      stops: ['Student Center', 'North Gate'],
      departure_time: '10:00',
      arrival_time: '10:40',
      days_of_operation: ALL_DAYS,
      status: 'active',
      available_seats: 45,
      price: 3,
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'schedule-4',
      shuttle_id: 'shuttle-1',
      route_name: 'Library - Student Dorms',
      origin: 'Library',
      destination: 'Student Dorms',
      stops: ['Cafeteria'],
      departure_time: '14:00',
      arrival_time: '14:25',
      days_of_operation: WEEKDAYS,
      status: 'active',
      available_seats: 30,
      price: 1,
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'schedule-5',
      shuttle_id: 'shuttle-2',
      route_name: 'Sports Complex - Main Gate',
      origin: 'Sports Complex',
      destination: 'Main Gate',
      stops: [],
      departure_time: '16:30',
      arrival_time: '16:50',
      days_of_operation: ALL_DAYS,
      status: 'active',
      available_seats: 20,
      price: 2,
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'schedule-6',
      shuttle_id: 'shuttle-3',
      route_name: 'Downtown - Main Campus',
      origin: 'Downtown',
      destination: 'Main Campus',
      stops: ['City Center', 'Library'],
      departure_time: '18:00',
      arrival_time: '18:45',
      days_of_operation: ALL_DAYS,
      status: 'active',
      available_seats: 45,
      price: 2.5,
      created_date: now(),
      updated_date: now(),
    },
  ]);

  seedIfEmpty('Booking', [
    {
      id: 'booking-1',
      booking_id: 'BK-DEMO001',
      student_email: 'ayesha@university.edu',
      student_name: 'Ayesha Khan',
      schedule_id: 'schedule-1',
      shuttle_id: 'shuttle-1',
      route_name: 'Main Campus - Downtown',
      travel_date: dateOffset(0),
      boarding_point: 'Main Campus',
      drop_point: 'Downtown',
      seats_booked: 2,
      status: 'confirmed',
      booking_time: now(),
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'booking-2',
      booking_id: 'BK-DEMO002',
      student_email: 'ayesha@university.edu',
      student_name: 'Ayesha Khan',
      schedule_id: 'schedule-2',
      shuttle_id: 'shuttle-2',
      route_name: 'Dorms - Main Campus',
      travel_date: dateOffset(1),
      boarding_point: 'Student Dorms',
      drop_point: 'Main Campus',
      seats_booked: 1,
      status: 'confirmed',
      booking_time: now(),
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'booking-3',
      booking_id: 'BK-DEMO003',
      student_email: 'bilal@university.edu',
      student_name: 'Bilal Ahmed',
      schedule_id: 'schedule-3',
      shuttle_id: 'shuttle-3',
      route_name: 'Main Campus - City Mall',
      travel_date: dateOffset(0),
      boarding_point: 'Main Campus',
      drop_point: 'City Mall',
      seats_booked: 1,
      status: 'confirmed',
      booking_time: now(),
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'booking-4',
      booking_id: 'BK-DEMO004',
      student_email: 'ayesha@university.edu',
      student_name: 'Ayesha Khan',
      schedule_id: 'schedule-4',
      shuttle_id: 'shuttle-1',
      route_name: 'Library - Student Dorms',
      travel_date: dateOffset(-1),
      boarding_point: 'Library',
      drop_point: 'Student Dorms',
      seats_booked: 1,
      status: 'completed',
      booking_time: now(),
      created_date: now(),
      updated_date: now(),
    },
  ]);

  seedIfEmpty('Notification', [
    {
      id: 'notification-1',
      user_email: 'ayesha@university.edu',
      title: 'Booking Confirmed!',
      message: 'Your booking BK-DEMO001 for Main Campus - Downtown has been confirmed.',
      type: 'booking_confirmed',
      is_read: false,
      related_booking_id: 'BK-DEMO001',
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'notification-2',
      user_email: 'ayesha@university.edu',
      title: 'Shuttle Reminder',
      message: 'Your shuttle from Student Dorms departs tomorrow at 07:30.',
      type: 'reminder',
      is_read: false,
      related_booking_id: 'BK-DEMO002',
      created_date: now(),
      updated_date: now(),
    },
  ]);

  seedIfEmpty('ShuttleLocation', [
    {
      id: 'location-1',
      shuttle_id: 'shuttle-1',
      latitude: 24.9227,
      longitude: 67.0854,
      speed: 25,
      heading: 45,
      status: 'moving',
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'location-2',
      shuttle_id: 'shuttle-2',
      latitude: 24.9207,
      longitude: 67.0834,
      speed: 20,
      heading: 120,
      status: 'moving',
      created_date: now(),
      updated_date: now(),
    },
    {
      id: 'location-3',
      shuttle_id: 'shuttle-3',
      latitude: 24.9247,
      longitude: 67.0874,
      speed: 0,
      heading: 270,
      status: 'stopped',
      created_date: now(),
      updated_date: now(),
    },
  ]);
}

function createEntityApi(entity) {
  const key = storageKey(entity);

  const getAll = () => read(key, []);

  return {
    async list(sort) {
      return sortRecords(getAll(), sort);
    },
    async filter(query = {}, sort) {
      const records = getAll().filter((record) =>
        Object.entries(query).every(([field, value]) => record[field] === value)
      );
      return sortRecords(records, sort);
    },
    async get(id) {
      return getAll().find((record) => record.id === id) || null;
    },
    async create(data) {
      const records = getAll();
      const timestamp = now();
      const record = {
        ...data,
        id: data.id || uid(),
        created_date: data.created_date || timestamp,
        updated_date: timestamp,
      };
      write(key, [record, ...records]);
      return record;
    },
    async update(id, data) {
      const records = getAll();
      let updated = null;
      const next = records.map((record) => {
        if (record.id !== id) return record;
        updated = { ...record, ...data, updated_date: now() };
        return updated;
      });
      write(key, next);
      return updated;
    },
    async delete(id) {
      write(key, getAll().filter((record) => record.id !== id));
      return { id };
    },
  };
}

seedDatabase();

export const base44 = {
  auth: {
    async isAuthenticated() {
      return !!read(AUTH_KEY, null);
    },
    async me() {
      return read(AUTH_KEY, null);
    },
    redirectToLogin() {
      window.location.href = '/Login';
    },
    async login(role = 'student') {
      const user = DEMO_USERS[role] || DEMO_USERS.student;
      write(AUTH_KEY, user);
      return user;
    },
    logout() {
      localStorage.removeItem(AUTH_KEY);
      window.location.href = '/';
    },
  },
  entities: {
    Shuttle: createEntityApi('Shuttle'),
    ShuttleSchedule: createEntityApi('ShuttleSchedule'),
    Booking: createEntityApi('Booking'),
    Notification: createEntityApi('Notification'),
    ShuttleLocation: createEntityApi('ShuttleLocation'),
  },
};
