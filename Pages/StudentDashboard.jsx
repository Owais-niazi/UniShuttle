import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin,
  Ticket,
  Filter,
  RefreshCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ShuttleCard from '@/components/shuttle/ShuttleCard';
import BookingModal from '@/components/shuttle/BookingModal';
import BookingCard from '@/components/shuttle/BookingCard';
import NotificationBell from '@/components/shuttle/NotificationBell';
import LiveShuttleMap from '@/components/map/LiveShuttleMap';

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await base44.auth.me();
      if (!userData) {
        base44.auth.redirectToLogin();
        return;
      }
      setUser(userData);
    };
    loadUser();
  }, []);

  // Fetch schedules
  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => base44.entities.ShuttleSchedule.list(),
  });

  // Fetch shuttles
  const { data: shuttles = [] } = useQuery({
    queryKey: ['shuttles'],
    queryFn: () => base44.entities.Shuttle.list(),
  });

  // Fetch all bookings to calculate seat availability
  const { data: allBookings = [] } = useQuery({
    queryKey: ['allBookings'],
    queryFn: () => base44.entities.Booking.list(),
  });

  // Fetch user's bookings
  const { data: myBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['myBookings', user?.email],
    queryFn: () => base44.entities.Booking.filter({ student_email: user?.email }),
    enabled: !!user?.email,
  });

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: () => base44.entities.Notification.filter({ user_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
  });

  // Calculate booked seats per schedule
  const getBookedSeats = (scheduleId) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return allBookings
      .filter(b => b.schedule_id === scheduleId && b.status === 'confirmed' && b.travel_date >= today)
      .reduce((sum, b) => sum + (b.seats_booked || 1), 0);
  };

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;
      const shuttle = shuttles.find(s => s.id === selectedSchedule.shuttle_id);
      
      // Create booking
      await base44.entities.Booking.create({
        booking_id: bookingId,
        student_email: user.email,
        student_name: user.full_name,
        schedule_id: selectedSchedule.id,
        shuttle_id: selectedSchedule.shuttle_id,
        route_name: selectedSchedule.route_name,
        travel_date: format(bookingData.travel_date, 'yyyy-MM-dd'),
        boarding_point: bookingData.boarding_point,
        drop_point: bookingData.drop_point,
        seats_booked: bookingData.seats_booked,
        status: 'confirmed',
        booking_time: new Date().toISOString(),
      });

      // Create notification
      await base44.entities.Notification.create({
        user_email: user.email,
        title: 'Booking Confirmed!',
        message: `Your booking for ${selectedSchedule.route_name} on ${format(bookingData.travel_date, 'MMM dd, yyyy')} has been confirmed. Booking ID: ${bookingId}`,
        type: 'booking_confirmed',
        related_booking_id: bookingId,
      });

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (booking) => {
      await base44.entities.Booking.update(booking.id, { 
        status: 'cancelled',
        cancellation_reason: 'Cancelled by student'
      });

      await base44.entities.Notification.create({
        user_email: user.email,
        title: 'Booking Cancelled',
        message: `Your booking ${booking.booking_id} for ${booking.route_name} has been cancelled.`,
        type: 'booking_cancelled',
        related_booking_id: booking.booking_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    await base44.entities.Notification.update(notificationId, { is_read: true });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const markAllNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => 
      base44.entities.Notification.update(n.id, { is_read: true })
    ));
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  // Get unique routes for filter
  const uniqueRoutes = [...new Set(schedules.map(s => s.route_name))];

  // Filter schedules
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.route_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         schedule.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         schedule.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoute = selectedRoute === 'all' || schedule.route_name === selectedRoute;
    return matchesSearch && matchesRoute && schedule.status === 'active';
  });

  const handleBook = (schedule) => {
    setSelectedSchedule(schedule);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    const result = await createBookingMutation.mutateAsync(bookingData);
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UniShuttle</h1>
                <p className="text-xs text-gray-500">Smart Campus Transport</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell 
                notifications={notifications}
                onMarkRead={markNotificationRead}
                onMarkAllRead={markAllNotificationsRead}
              />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {user?.full_name?.charAt(0) || 'S'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.full_name || 'Student'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
          </h2>
          <p className="text-gray-600 mt-1">Book your campus shuttle in seconds</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50">
                <Bus className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
                <p className="text-xs text-gray-500">Available Routes</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <Ticket className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {myBookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-xs text-gray-500">Active Bookings</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {myBookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-xs text-gray-500">Completed Trips</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{format(new Date(), 'HH:mm')}</p>
                <p className="text-xs text-gray-500">Current Time</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schedules" className="space-y-6">
          <TabsList className="bg-white shadow-sm border border-gray-100 p-1">
            <TabsTrigger value="schedules" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Bus className="w-4 h-4 mr-2" />
              Schedules
            </TabsTrigger>
            <TabsTrigger value="live-map" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Ticket className="w-4 h-4 mr-2" />
              My Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedules" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search routes, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-full sm:w-48 bg-white">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Filter by route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {uniqueRoutes.map(route => (
                    <SelectItem key={route} value={route}>{route}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['schedules'] })}
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Schedules Grid */}
            {schedulesLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="text-center py-16">
                <Bus className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No schedules found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredSchedules.map((schedule, index) => {
                    const shuttle = shuttles.find(s => s.id === schedule.shuttle_id);
                    const bookedSeats = getBookedSeats(schedule.id);
                    return (
                      <ShuttleCard
                        key={schedule.id}
                        schedule={schedule}
                        shuttle={shuttle}
                        bookedSeats={bookedSeats}
                        onBook={handleBook}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="live-map" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Live Shuttle Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Track active shuttles in real-time. Click on markers to see shuttle details.
                </p>
                <LiveShuttleMap height="600px" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            {bookingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : myBookings.length === 0 ? (
              <div className="text-center py-16">
                <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No bookings yet</h3>
                <p className="text-gray-500">Book your first shuttle ride!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {myBookings.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={(b) => cancelBookingMutation.mutate(b)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        schedule={selectedSchedule}
        shuttle={shuttles.find(s => s.id === selectedSchedule?.shuttle_id)}
        onConfirm={handleConfirmBooking}
        isLoading={createBookingMutation.isPending}
      />
    </div>
  );
}