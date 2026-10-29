import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bus, 
  Calendar,
  Users,
  Ticket,
  Plus,
  Pencil,
  Trash2,
  Search,
  Download,
  TrendingUp,
  Clock,
  MapPin,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import StatsCard from '@/components/admin/StatsCard';
import ScheduleForm from '@/components/admin/ScheduleForm';
import ShuttleForm from '@/components/admin/ShuttleForm';
import LiveShuttleMap from '@/components/map/LiveShuttleMap';
import LocationSimulator from '@/components/map/LocationSimulator';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [isShuttleFormOpen, setIsShuttleFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingShuttle, setEditingShuttle] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, item: null });
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

  // Fetch data
  const { data: shuttles = [], isLoading: shuttlesLoading } = useQuery({
    queryKey: ['shuttles'],
    queryFn: () => base44.entities.Shuttle.list(),
  });

  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => base44.entities.ShuttleSchedule.list(),
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.Booking.list('-created_date'),
  });

  // Mutations
  const createScheduleMutation = useMutation({
    mutationFn: (data) => base44.entities.ShuttleSchedule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsScheduleFormOpen(false);
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ShuttleSchedule.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsScheduleFormOpen(false);
      setEditingSchedule(null);
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id) => base44.entities.ShuttleSchedule.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  const createShuttleMutation = useMutation({
    mutationFn: (data) => base44.entities.Shuttle.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shuttles'] });
      setIsShuttleFormOpen(false);
    },
  });

  const updateShuttleMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Shuttle.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shuttles'] });
      setIsShuttleFormOpen(false);
      setEditingShuttle(null);
    },
  });

  const deleteShuttleMutation = useMutation({
    mutationFn: (id) => base44.entities.Shuttle.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shuttles'] });
    },
  });

  // Stats
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const todayBookings = bookings.filter(b => 
    b.travel_date === format(new Date(), 'yyyy-MM-dd') && b.status === 'confirmed'
  );
  const activeShuttles = shuttles.filter(s => s.status === 'active');
  const totalCapacity = activeShuttles.reduce((sum, s) => sum + (s.capacity || 0), 0);

  // Handle form submissions
  const handleScheduleSubmit = (data) => {
    if (editingSchedule) {
      updateScheduleMutation.mutate({ id: editingSchedule.id, data });
    } else {
      createScheduleMutation.mutate(data);
    }
  };

  const handleShuttleSubmit = (data) => {
    if (editingShuttle) {
      updateShuttleMutation.mutate({ id: editingShuttle.id, data });
    } else {
      createShuttleMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (deleteConfirm.type === 'schedule') {
      deleteScheduleMutation.mutate(deleteConfirm.item.id);
    } else if (deleteConfirm.type === 'shuttle') {
      deleteShuttleMutation.mutate(deleteConfirm.item.id);
    }
    setDeleteConfirm({ open: false, type: null, item: null });
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking =>
    booking.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.booking_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.route_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <h1 className="text-xl font-bold text-gray-900">UniShuttle Admin</h1>
                <p className="text-xs text-gray-500">Management Console</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-indigo-100 text-indigo-700">Admin</Badge>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.full_name || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Shuttles"
            value={activeShuttles.length}
            icon={Bus}
            color="indigo"
            delay={0}
          />
          <StatsCard
            title="Active Schedules"
            value={schedules.filter(s => s.status === 'active').length}
            icon={Calendar}
            color="purple"
            delay={1}
          />
          <StatsCard
            title="Today's Bookings"
            value={todayBookings.length}
            icon={Ticket}
            color="emerald"
            delay={2}
          />
          <StatsCard
            title="Total Capacity"
            value={totalCapacity}
            icon={Users}
            color="amber"
            delay={3}
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="schedules" className="space-y-6">
          <TabsList className="bg-white shadow-sm border border-gray-100 p-1">
            <TabsTrigger value="schedules" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedules
            </TabsTrigger>
            <TabsTrigger value="shuttles" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Bus className="w-4 h-4 mr-2" />
              Shuttles
            </TabsTrigger>
            <TabsTrigger value="live-tracking" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Live Tracking
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Ticket className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Schedules Tab */}
          <TabsContent value="schedules">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Shuttle Schedules</CardTitle>
                <Button 
                  onClick={() => { setEditingSchedule(null); setIsScheduleFormOpen(true); }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </CardHeader>
              <CardContent>
                {schedulesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Origin → Destination</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map(schedule => {
                        const shuttle = shuttles.find(s => s.id === schedule.shuttle_id);
                        return (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">
                              <div>
                                <p>{schedule.route_name}</p>
                                <p className="text-xs text-gray-500">{shuttle?.name || 'N/A'}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-3 h-3 text-indigo-500" />
                                {schedule.origin} → {schedule.destination}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {schedule.departure_time} - {schedule.arrival_time}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {schedule.days_of_operation?.slice(0, 3).map(day => (
                                  <Badge key={day} variant="outline" className="text-xs">
                                    {day.slice(0, 2)}
                                  </Badge>
                                ))}
                                {schedule.days_of_operation?.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{schedule.days_of_operation.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                schedule.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                schedule.status === 'delayed' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }>
                                {schedule.status}
                              </Badge>
                            </TableCell>
                            <TableCell>${schedule.price?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => { setEditingSchedule(schedule); setIsScheduleFormOpen(true); }}
                                >
                                  <Pencil className="w-4 h-4 text-gray-500" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setDeleteConfirm({ open: true, type: 'schedule', item: schedule })}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shuttles Tab */}
          <TabsContent value="shuttles">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Fleet Management</CardTitle>
                <Button 
                  onClick={() => { setEditingShuttle(null); setIsShuttleFormOpen(true); }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shuttle
                </Button>
              </CardHeader>
              <CardContent>
                {shuttlesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shuttle</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shuttles.map(shuttle => (
                        <TableRow key={shuttle.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{shuttle.name}</p>
                              <p className="text-xs text-gray-500">{shuttle.shuttle_number}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {shuttle.vehicle_type?.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              {shuttle.capacity}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {shuttle.features?.map(feature => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              shuttle.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                              shuttle.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }>
                              {shuttle.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => { setEditingShuttle(shuttle); setIsShuttleFormOpen(true); }}
                              >
                                <Pencil className="w-4 h-4 text-gray-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setDeleteConfirm({ open: true, type: 'shuttle', item: shuttle })}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Tracking Tab */}
          <TabsContent value="live-tracking">
            <div className="space-y-6">
              <LocationSimulator />
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Fleet Tracking - All Active Shuttles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Real-time GPS tracking of all active shuttles. Locations update automatically every 5 seconds.
                  </p>
                  <LiveShuttleMap height="600px" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Student Booking Records</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Travel Date</TableHead>
                        <TableHead>Seats</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Booked On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map(booking => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">{booking.booking_id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.student_name}</p>
                              <p className="text-xs text-gray-500">{booking.student_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{booking.route_name}</TableCell>
                          <TableCell>
                            {format(new Date(booking.travel_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>{booking.seats_booked || 1}</TableCell>
                          <TableCell>
                            <Badge className={
                              booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {format(new Date(booking.created_date), 'MMM dd, HH:mm')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Booking Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                      <span className="text-gray-600">Total Bookings</span>
                      <span className="text-2xl font-bold text-gray-900">{bookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-emerald-50">
                      <span className="text-gray-600">Confirmed</span>
                      <span className="text-2xl font-bold text-emerald-600">{confirmedBookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-red-50">
                      <span className="text-gray-600">Cancelled</span>
                      <span className="text-2xl font-bold text-red-600">
                        {bookings.filter(b => b.status === 'cancelled').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-50">
                      <span className="text-gray-600">Completed</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {bookings.filter(b => b.status === 'completed').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="w-5 h-5 text-indigo-600" />
                    Route Popularity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      bookings.reduce((acc, b) => {
                        acc[b.route_name] = (acc[b.route_name] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([route, count], index) => (
                        <div key={route} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500'][index]
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{route}</p>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500'][index]
                                }`}
                                style={{ width: `${(count / bookings.length) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-500">{count}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Schedule Form Modal */}
      <ScheduleForm
        isOpen={isScheduleFormOpen}
        onClose={() => { setIsScheduleFormOpen(false); setEditingSchedule(null); }}
        onSubmit={handleScheduleSubmit}
        shuttles={shuttles}
        initialData={editingSchedule}
        isLoading={createScheduleMutation.isPending || updateScheduleMutation.isPending}
      />

      {/* Shuttle Form Modal */}
      <ShuttleForm
        isOpen={isShuttleFormOpen}
        onClose={() => { setIsShuttleFormOpen(false); setEditingShuttle(null); }}
        onSubmit={handleShuttleSubmit}
        initialData={editingShuttle}
        isLoading={createShuttleMutation.isPending || updateShuttleMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteConfirm.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}