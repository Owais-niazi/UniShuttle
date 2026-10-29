import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { 
  Book, 
  Code, 
  Users, 
  Bus, 
  Calendar, 
  Ticket, 
  Bell,
  Shield,
  Layers,
  GitBranch,
  CheckCircle,
  ArrowRight,
  FileCode,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 mb-4">
            <Book className="w-4 h-4" />
            <span className="font-medium">OOP Project Documentation</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Smart University Shuttle Booking System
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Complete technical documentation including class structure, OOP concepts, and UML diagrams
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white shadow-sm border p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">Class Structure</TabsTrigger>
            <TabsTrigger value="oop">OOP Concepts</TabsTrigger>
            <TabsTrigger value="uml">UML Diagram</TabsTrigger>
            <TabsTrigger value="howto">How to Run</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  <p>
                    The Smart University Shuttle Booking & Management System is a comprehensive web application 
                    designed to streamline campus transportation. It provides a digital platform for students 
                    to book shuttle seats and for administrators to manage the shuttle fleet and schedules.
                  </p>
                  
                  <h3>Key Features</h3>
                  <ul>
                    <li><strong>Real-time Booking:</strong> Students can view available schedules and book seats instantly</li>
                    <li><strong>Seat Management:</strong> Automatic tracking of seat availability with overbooking prevention</li>
                    <li><strong>Notification System:</strong> Automated confirmations for bookings and cancellations</li>
                    <li><strong>Admin Dashboard:</strong> Complete fleet and schedule management capabilities</li>
                    <li><strong>Analytics:</strong> Booking statistics and route popularity insights</li>
                    <li><strong>Responsive Design:</strong> Works seamlessly on desktop and mobile devices</li>
                  </ul>

                  <h3>User Roles</h3>
                  <div className="grid md:grid-cols-2 gap-4 not-prose">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Student</span>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• View shuttle schedules</li>
                        <li>• Book shuttle seats</li>
                        <li>• Cancel bookings</li>
                        <li>• View booking history</li>
                        <li>• Receive notifications</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-900">Admin</span>
                      </div>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Manage shuttle fleet</li>
                        <li>• Create/edit schedules</li>
                        <li>• View all bookings</li>
                        <li>• Access analytics</li>
                        <li>• Set routes and pricing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    Data Entities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'Shuttle', icon: Bus, desc: 'Vehicle information, capacity, features' },
                      { name: 'ShuttleSchedule', icon: Calendar, desc: 'Routes, timings, days of operation' },
                      { name: 'Booking', icon: Ticket, desc: 'Student reservations and status' },
                      { name: 'Notification', icon: Bell, desc: 'System and booking notifications' },
                    ].map((entity, index) => (
                      <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-50">
                            <entity.icon className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{entity.name}</p>
                            <p className="text-sm text-gray-500">{entity.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Class Structure Tab */}
          <TabsContent value="classes">
            <div className="space-y-6">
              {/* User Classes */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    User Class Hierarchy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
{`// Abstract Base Class - User
abstract class User {
  protected id: string;
  protected email: string;
  protected fullName: string;
  protected role: 'student' | 'admin';
  protected createdDate: Date;

  constructor(email: string, fullName: string) {
    this.id = generateId();
    this.email = email;
    this.fullName = fullName;
    this.createdDate = new Date();
  }

  // Abstract method - must be implemented by subclasses
  abstract getDashboardUrl(): string;
  
  // Encapsulated getters
  getId(): string { return this.id; }
  getEmail(): string { return this.email; }
  getFullName(): string { return this.fullName; }
  getRole(): string { return this.role; }
}

// Student Class - Inherits from User
class Student extends User {
  private bookings: Booking[] = [];
  
  constructor(email: string, fullName: string) {
    super(email, fullName);
    this.role = 'student';
  }

  // Method overriding (Polymorphism)
  getDashboardUrl(): string {
    return '/StudentDashboard';
  }

  bookSeat(schedule: ShuttleSchedule, travelDate: Date): Booking {
    // Booking logic with seat validation
  }

  cancelBooking(bookingId: string): boolean {
    // Cancellation logic
  }

  getBookingHistory(): Booking[] {
    return [...this.bookings];
  }
}

// Admin Class - Inherits from User
class Admin extends User {
  constructor(email: string, fullName: string) {
    super(email, fullName);
    this.role = 'admin';
  }

  // Method overriding (Polymorphism)
  getDashboardUrl(): string {
    return '/AdminDashboard';
  }

  createSchedule(scheduleData: ScheduleData): ShuttleSchedule {
    // Schedule creation logic
  }

  updateSchedule(scheduleId: string, data: Partial<ScheduleData>): boolean {
    // Update logic
  }

  deleteSchedule(scheduleId: string): boolean {
    // Deletion logic
  }

  viewAllBookings(): Booking[] {
    // Retrieve all bookings
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Shuttle Class */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="w-5 h-5 text-indigo-600" />
                    Shuttle & Schedule Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
{`// Shuttle Class - Encapsulates vehicle data
class Shuttle {
  private id: string;
  private shuttleNumber: string;
  private name: string;
  private capacity: number;
  private vehicleType: 'mini_bus' | 'standard_bus' | 'large_bus';
  private status: 'active' | 'maintenance' | 'retired';
  private features: string[];

  constructor(data: ShuttleData) {
    this.id = generateId();
    this.shuttleNumber = data.shuttleNumber;
    this.name = data.name;
    this.capacity = data.capacity;
    this.vehicleType = data.vehicleType;
    this.status = 'active';
    this.features = data.features || [];
  }

  // Encapsulated methods
  getCapacity(): number { return this.capacity; }
  isActive(): boolean { return this.status === 'active'; }
  
  setStatus(status: 'active' | 'maintenance' | 'retired'): void {
    this.status = status;
  }

  addFeature(feature: string): void {
    if (!this.features.includes(feature)) {
      this.features.push(feature);
    }
  }
}

// ShuttleSchedule Class
class ShuttleSchedule {
  private id: string;
  private shuttle: Shuttle;
  private routeName: string;
  private origin: string;
  private destination: string;
  private stops: string[];
  private departureTime: string;
  private arrivalTime: string;
  private daysOfOperation: string[];
  private status: 'active' | 'cancelled' | 'delayed';
  private price: number;

  constructor(shuttle: Shuttle, data: ScheduleData) {
    this.id = generateId();
    this.shuttle = shuttle;
    this.routeName = data.routeName;
    this.origin = data.origin;
    this.destination = data.destination;
    this.stops = data.stops || [];
    this.departureTime = data.departureTime;
    this.arrivalTime = data.arrivalTime;
    this.daysOfOperation = data.daysOfOperation;
    this.status = 'active';
    this.price = data.price || 0;
  }

  getAvailableSeats(date: Date, bookings: Booking[]): number {
    const bookedSeats = bookings
      .filter(b => b.getScheduleId() === this.id && 
                   b.getTravelDate() === date &&
                   b.getStatus() === 'confirmed')
      .reduce((sum, b) => sum + b.getSeatsBooked(), 0);
    
    return this.shuttle.getCapacity() - bookedSeats;
  }

  isOperatingOn(day: string): boolean {
    return this.daysOfOperation.includes(day);
  }

  getAllStops(): string[] {
    return [this.origin, ...this.stops, this.destination];
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Booking & Notification Classes */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-indigo-600" />
                    Booking & Notification Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
{`// Booking Class
class Booking {
  private id: string;
  private bookingId: string;
  private studentEmail: string;
  private studentName: string;
  private scheduleId: string;
  private routeName: string;
  private travelDate: Date;
  private boardingPoint: string;
  private dropPoint: string;
  private seatsBooked: number;
  private status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  private bookingTime: Date;
  private cancellationReason?: string;

  constructor(student: Student, schedule: ShuttleSchedule, data: BookingData) {
    this.id = generateId();
    this.bookingId = 'BK-' + Date.now().toString(36).toUpperCase();
    this.studentEmail = student.getEmail();
    this.studentName = student.getFullName();
    this.scheduleId = schedule.getId();
    this.routeName = schedule.getRouteName();
    this.travelDate = data.travelDate;
    this.boardingPoint = data.boardingPoint;
    this.dropPoint = data.dropPoint;
    this.seatsBooked = data.seatsBooked || 1;
    this.status = 'confirmed';
    this.bookingTime = new Date();
  }

  // Getters (Encapsulation)
  getStatus(): string { return this.status; }
  getSeatsBooked(): number { return this.seatsBooked; }
  getTravelDate(): Date { return this.travelDate; }
  getScheduleId(): string { return this.scheduleId; }

  cancel(reason: string): boolean {
    if (this.status === 'confirmed' && this.travelDate >= new Date()) {
      this.status = 'cancelled';
      this.cancellationReason = reason;
      return true;
    }
    return false;
  }

  markCompleted(): void {
    if (this.status === 'confirmed') {
      this.status = 'completed';
    }
  }
}

// Notification Class
class Notification {
  private id: string;
  private userEmail: string;
  private title: string;
  private message: string;
  private type: 'booking_confirmed' | 'booking_cancelled' | 'schedule_update' | 'reminder' | 'system';
  private isRead: boolean;
  private relatedBookingId?: string;
  private createdDate: Date;

  constructor(data: NotificationData) {
    this.id = generateId();
    this.userEmail = data.userEmail;
    this.title = data.title;
    this.message = data.message;
    this.type = data.type;
    this.isRead = false;
    this.relatedBookingId = data.relatedBookingId;
    this.createdDate = new Date();
  }

  markAsRead(): void {
    this.isRead = true;
  }

  // Factory method for creating booking notifications
  static createBookingConfirmation(booking: Booking): Notification {
    return new Notification({
      userEmail: booking.getStudentEmail(),
      title: 'Booking Confirmed!',
      message: \`Your booking \${booking.getBookingId()} has been confirmed.\`,
      type: 'booking_confirmed',
      relatedBookingId: booking.getBookingId()
    });
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Main Controller */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-600" />
                    ShuttleManagementSystem (Main Controller)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
{`// Main Controller Class - Singleton Pattern
class ShuttleManagementSystem {
  private static instance: ShuttleManagementSystem;
  private shuttles: Map<string, Shuttle>;
  private schedules: Map<string, ShuttleSchedule>;
  private bookings: Map<string, Booking>;
  private notifications: Map<string, Notification>;

  private constructor() {
    this.shuttles = new Map();
    this.schedules = new Map();
    this.bookings = new Map();
    this.notifications = new Map();
  }

  // Singleton pattern implementation
  static getInstance(): ShuttleManagementSystem {
    if (!ShuttleManagementSystem.instance) {
      ShuttleManagementSystem.instance = new ShuttleManagementSystem();
    }
    return ShuttleManagementSystem.instance;
  }

  // Shuttle Management
  addShuttle(shuttle: Shuttle): void {
    this.shuttles.set(shuttle.getId(), shuttle);
  }

  getActiveShuttles(): Shuttle[] {
    return Array.from(this.shuttles.values()).filter(s => s.isActive());
  }

  // Schedule Management
  addSchedule(schedule: ShuttleSchedule): void {
    this.schedules.set(schedule.getId(), schedule);
  }

  getActiveSchedules(): ShuttleSchedule[] {
    return Array.from(this.schedules.values()).filter(s => s.getStatus() === 'active');
  }

  // Booking Management with Overbooking Prevention
  createBooking(student: Student, scheduleId: string, data: BookingData): Booking | null {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return null;

    // Check seat availability (prevents overbooking)
    const availableSeats = schedule.getAvailableSeats(
      data.travelDate, 
      Array.from(this.bookings.values())
    );

    if (availableSeats < data.seatsBooked) {
      return null; // Not enough seats
    }

    const booking = new Booking(student, schedule, data);
    this.bookings.set(booking.getId(), booking);

    // Send notification
    const notification = Notification.createBookingConfirmation(booking);
    this.notifications.set(notification.getId(), notification);

    return booking;
  }

  cancelBooking(bookingId: string, reason: string): boolean {
    const booking = this.bookings.get(bookingId);
    if (!booking) return false;

    const cancelled = booking.cancel(reason);
    if (cancelled) {
      // Send cancellation notification
      const notification = Notification.createCancellationNotice(booking);
      this.notifications.set(notification.getId(), notification);
    }
    return cancelled;
  }

  // Analytics Methods
  getTotalBookings(): number {
    return this.bookings.size;
  }

  getBookingsByRoute(routeName: string): Booking[] {
    return Array.from(this.bookings.values())
      .filter(b => b.getRouteName() === routeName);
  }

  getMostPopularRoutes(): Array<{route: string, count: number}> {
    const routeCounts: Map<string, number> = new Map();
    
    this.bookings.forEach(booking => {
      const route = booking.getRouteName();
      routeCounts.set(route, (routeCounts.get(route) || 0) + 1);
    });

    return Array.from(routeCounts.entries())
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count);
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* OOP Concepts Tab */}
          <TabsContent value="oop">
            <div className="grid gap-6">
              {[
                {
                  title: 'Encapsulation',
                  icon: Shield,
                  color: 'bg-blue-50 text-blue-600',
                  description: 'Data hiding and protection through access modifiers',
                  examples: [
                    'Private fields in all classes (id, email, capacity, etc.)',
                    'Public getter/setter methods for controlled access',
                    'Internal state management hidden from external code',
                    'Protected members in User base class for inheritance'
                  ],
                  code: `class Shuttle {
  private capacity: number;  // Hidden from external access
  private status: string;
  
  // Controlled access through methods
  getCapacity(): number { return this.capacity; }
  setStatus(status: string): void {
    // Validation before setting
    if (['active', 'maintenance'].includes(status)) {
      this.status = status;
    }
  }
}`
                },
                {
                  title: 'Inheritance',
                  icon: GitBranch,
                  color: 'bg-purple-50 text-purple-600',
                  description: 'Code reuse through parent-child class relationships',
                  examples: [
                    'User (abstract base) → Student, Admin',
                    'Shared properties inherited (id, email, fullName)',
                    'Common methods defined once in parent class',
                    'extends keyword for class inheritance'
                  ],
                  code: `abstract class User {
  protected id: string;
  protected email: string;
  // Common properties for all users
}

class Student extends User {
  private bookings: Booking[];
  // Inherits id, email from User
  // Adds student-specific properties
}

class Admin extends User {
  // Inherits from User
  // Adds admin-specific capabilities
}`
                },
                {
                  title: 'Polymorphism',
                  icon: Layers,
                  color: 'bg-emerald-50 text-emerald-600',
                  description: 'Same interface, different implementations',
                  examples: [
                    'getDashboardUrl() method overridden in Student and Admin',
                    'Method overriding based on user role',
                    'Runtime behavior determined by actual object type',
                    'Unified interface for different user types'
                  ],
                  code: `abstract class User {
  abstract getDashboardUrl(): string;
}

class Student extends User {
  getDashboardUrl(): string {
    return '/StudentDashboard';  // Student-specific
  }
}

class Admin extends User {
  getDashboardUrl(): string {
    return '/AdminDashboard';  // Admin-specific
  }

// Usage - polymorphic behavior
const user: User = getCurrentUser();
redirect(user.getDashboardUrl()); // Calls correct version`
                },
                {
                  title: 'Abstraction',
                  icon: Code,
                  color: 'bg-amber-50 text-amber-600',
                  description: 'Hiding complexity and showing only essential features',
                  examples: [
                    'Abstract User class with abstract methods',
                    'Interface-like contracts for implementations',
                    'Complex booking logic hidden behind simple API',
                    'ShuttleManagementSystem as a facade'
                  ],
                  code: `// Abstract class - defines contract
abstract class User {
  abstract getDashboardUrl(): string;
  abstract getPermissions(): string[];
}

// Factory method hides creation complexity
class Notification {
  static createBookingConfirmation(booking: Booking) {
    // Complex logic abstracted away
    return new Notification({...});
  }
}

// Simple interface for complex operations
system.createBooking(student, scheduleId, data);
// Hides: validation, seat check, notification`
                },
              ].map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className={concept.color}>
                      <CardTitle className="flex items-center gap-2">
                        <concept.icon className="w-5 h-5" />
                        {concept.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">{concept.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Implementation Examples:</h4>
                        <ul className="space-y-1">
                          {concept.examples.map((example, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-100">{concept.code}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* UML Diagram Tab */}
          <TabsContent value="uml">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-indigo-600" />
                  UML Class Diagram (Text-Based)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono">
{`
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SMART UNIVERSITY SHUTTLE SYSTEM                            │
│                                  UML Class Diagram                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                 ┌──────────────────────┐
                                 │    <<abstract>>      │
                                 │        User          │
                                 ├──────────────────────┤
                                 │ # id: string         │
                                 │ # email: string      │
                                 │ # fullName: string   │
                                 │ # role: string       │
                                 │ # createdDate: Date  │
                                 ├──────────────────────┤
                                 │ + getId(): string    │
                                 │ + getEmail(): string │
                                 │ + getFullName(): str │
                                 │ + getDashboardUrl()* │
                                 └──────────┬───────────┘
                                            │
                          ┌─────────────────┴─────────────────┐
                          │                                   │
                          ▼                                   ▼
         ┌──────────────────────────┐         ┌──────────────────────────┐
         │        Student           │         │         Admin            │
         ├──────────────────────────┤         ├──────────────────────────┤
         │ - bookings: Booking[]    │         │                          │
         ├──────────────────────────┤         ├──────────────────────────┤
         │ + getDashboardUrl(): str │         │ + getDashboardUrl(): str │
         │ + bookSeat(): Booking    │         │ + createSchedule(): Sch  │
         │ + cancelBooking(): bool  │         │ + updateSchedule(): bool │
         │ + getBookingHistory()    │         │ + deleteSchedule(): bool │
         └─────────────┬────────────┘         │ + viewAllBookings(): []  │
                       │                      └──────────────────────────┘
                       │ creates
                       ▼
┌──────────────────────────────┐           ┌──────────────────────────────┐
│          Booking             │           │         Notification         │
├──────────────────────────────┤           ├──────────────────────────────┤
│ - id: string                 │           │ - id: string                 │
│ - bookingId: string          │◄─────────┤│ - userEmail: string          │
│ - studentEmail: string       │  triggers ││ - title: string             │
│ - studentName: string        │           ││ - message: string           │
│ - scheduleId: string         │           ││ - type: NotificationType    │
│ - routeName: string          │           ││ - isRead: boolean           │
│ - travelDate: Date           │           ││ - relatedBookingId: string  │
│ - boardingPoint: string      │           │├──────────────────────────────┤
│ - dropPoint: string          │           ││ + markAsRead(): void        │
│ - seatsBooked: number        │           ││ + createBookingConfirm()    │
│ - status: BookingStatus      │           │└──────────────────────────────┘
├──────────────────────────────┤
│ + getStatus(): string        │
│ + cancel(reason): boolean    │
│ + markCompleted(): void      │
└─────────────┬────────────────┘
              │ references
              ▼
┌──────────────────────────────┐           ┌──────────────────────────────┐
│       ShuttleSchedule        │           │          Shuttle             │
├──────────────────────────────┤           ├──────────────────────────────┤
│ - id: string                 │           │ - id: string                 │
│ - shuttle: Shuttle           │◄──────────┤│ - shuttleNumber: string     │
│ - routeName: string          │  assigned ││ - name: string              │
│ - origin: string             │    to     ││ - capacity: number          │
│ - destination: string        │           ││ - vehicleType: VehicleType  │
│ - stops: string[]            │           ││ - status: ShuttleStatus     │
│ - departureTime: string      │           ││ - features: string[]        │
│ - arrivalTime: string        │           │├──────────────────────────────┤
│ - daysOfOperation: string[]  │           ││ + getCapacity(): number     │
│ - status: ScheduleStatus     │           ││ + isActive(): boolean       │
│ - price: number              │           ││ + setStatus(): void         │
├──────────────────────────────┤           ││ + addFeature(): void        │
│ + getAvailableSeats(): num   │           │└──────────────────────────────┘
│ + isOperatingOn(day): bool   │
│ + getAllStops(): string[]    │
└──────────────────────────────┘


                    ┌─────────────────────────────────────────┐
                    │    ShuttleManagementSystem              │
                    │         <<singleton>>                   │
                    ├─────────────────────────────────────────┤
                    │ - instance: ShuttleManagementSystem     │
                    │ - shuttles: Map<string, Shuttle>        │
                    │ - schedules: Map<string, Schedule>      │
                    │ - bookings: Map<string, Booking>        │
                    │ - notifications: Map<string, Notif>     │
                    ├─────────────────────────────────────────┤
                    │ + getInstance(): ShuttleManagementSys   │
                    │ + addShuttle(shuttle): void             │
                    │ + getActiveShuttles(): Shuttle[]        │
                    │ + addSchedule(schedule): void           │
                    │ + createBooking(data): Booking          │
                    │ + cancelBooking(id, reason): boolean    │
                    │ + getTotalBookings(): number            │
                    │ + getMostPopularRoutes(): RouteStats[]  │
                    └─────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════
                                    LEGEND
═══════════════════════════════════════════════════════════════════════════════════════
    ────────►  Inheritance (extends)          # Protected member
    ────────▷  Composition/Association        - Private member
    <<...>>    Stereotype                     + Public member
    *          Abstract method                () Method return type
═══════════════════════════════════════════════════════════════════════════════════════
`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* How to Run Tab */}
          <TabsContent value="howto">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-indigo-600" />
                    Instructions to Run the Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  <h3>Accessing the Application</h3>
                  <ol>
                    <li>Navigate to the application URL in your web browser</li>
                    <li>You will see the landing page with options to sign in or get started</li>
                    <li>Click "Get Started" or "Sign In" to authenticate</li>
                    <li>Based on your role (Student/Admin), you'll be redirected to the appropriate dashboard</li>
                  </ol>

                  <h3>Student Workflow</h3>
                  <ol>
                    <li><strong>View Schedules:</strong> Browse available shuttle schedules on the dashboard</li>
                    <li><strong>Book a Seat:</strong> Click "Book Now" on any available schedule</li>
                    <li><strong>Select Details:</strong> Choose travel date, boarding point, and seats</li>
                    <li><strong>Confirm:</strong> Click "Confirm Booking" to complete</li>
                    <li><strong>Manage Bookings:</strong> View and cancel bookings from "My Bookings" tab</li>
                  </ol>

                  <h3>Admin Workflow</h3>
                  <ol>
                    <li><strong>Manage Shuttles:</strong> Add, edit, or remove shuttle vehicles</li>
                    <li><strong>Manage Schedules:</strong> Create and modify routes and timings</li>
                    <li><strong>View Bookings:</strong> Monitor all student booking records</li>
                    <li><strong>Analytics:</strong> Access booking statistics and route popularity</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    Sample Test Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The system comes pre-loaded with sample data for testing:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sample Shuttles</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge>SH-001</Badge>
                          Campus Express (35 seats)
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>SH-002</Badge>
                          Green Line (25 seats)
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>SH-003</Badge>
                          Quick Connect (15 seats)
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge>SH-004</Badge>
                          Blue Rider (45 seats)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sample Routes</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-indigo-500" />
                          Main Campus → Downtown
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-indigo-500" />
                          Student Dorms → Main Campus
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-indigo-500" />
                          Library → Science Park
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-indigo-500" />
                          Campus Ring Route
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Project Requirements Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">OOP Principles</h4>
                      <ul className="space-y-2">
                        {[
                          'Encapsulation with private/protected fields',
                          'Inheritance (User → Student, Admin)',
                          'Polymorphism (method overriding)',
                          'Abstraction (abstract User class)',
                          'Proper access modifiers',
                          'Constructors in all classes'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">System Features</h4>
                      <ul className="space-y-2">
                        {[
                          'Real-time seat availability',
                          'Overbooking prevention',
                          'Booking confirmations',
                          'Admin schedule management',
                          'Student booking history',
                          'Responsive mobile design'
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}