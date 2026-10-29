import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bus, 
  Calendar, 
  Clock, 
  MapPin, 
  Shield, 
  Smartphone, 
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'Instant Booking',
    description: 'Book your shuttle seat in seconds with real-time availability updates',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Clock,
    title: 'Live Schedules',
    description: 'View real-time shuttle schedules, routes, and timings',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Safe and secure booking system with encrypted transactions',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access from any device - desktop, tablet, or mobile',
    color: 'bg-purple-50 text-purple-600',
  },
];

const stats = [
  { value: '10K+', label: 'Happy Students' },
  { value: '50+', label: 'Daily Routes' },
  { value: '99%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'admin') {
        window.location.href = createPageUrl('AdminDashboard');
      } else {
        window.location.href = createPageUrl('StudentDashboard');
      }
    } else {
      base44.auth.redirectToLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">UniShuttle</span>
            </div>
            <div className="flex items-center gap-4">
              {loading ? null : user ? (
                <Button onClick={handleGetStarted} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => base44.auth.redirectToLogin()}>
                    Sign In
                  </Button>
                  <Button onClick={() => base44.auth.redirectToLogin()} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
              <Star className="w-3 h-3 mr-1" />
              #1 Campus Transport Solution
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Smart University
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shuttle Booking
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Book your campus shuttle in seconds. Real-time schedules, instant confirmations, 
              and seamless transport management for students and administrators.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                Start Booking
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleGetStarted} className="text-lg px-8 py-6">
                <Calendar className="w-5 h-5 mr-2" />
                View Schedules
              </Button>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Sample Schedule Cards */}
                  {[
                    { route: 'Main Campus → Downtown', time: '08:00 AM', seats: 12 },
                    { route: 'Library → Student Dorms', time: '10:30 AM', seats: 8 },
                    { route: 'Sports Complex → Main Gate', time: '02:00 PM', seats: 15 },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-indigo-50">
                          <Bus className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{item.route}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700">
                          {item.seats} seats
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
                <p className="text-indigo-100 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Powerful features to make your campus commute effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Book your shuttle in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Choose Your Route', description: 'Browse available routes and select your preferred schedule', icon: MapPin },
              { step: 2, title: 'Select Date & Seat', description: 'Pick your travel date and number of seats needed', icon: Calendar },
              { step: 3, title: 'Confirm & Go', description: 'Get instant confirmation and board your shuttle', icon: CheckCircle },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already made their campus commute easier with UniShuttle.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">UniShuttle</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 UniShuttle. Smart Campus Transport Solution.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}