import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  Ticket,
  X,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const statusConfig = {
  confirmed: { 
    icon: CheckCircle, 
    color: 'bg-emerald-100 text-emerald-700',
    label: 'Confirmed'
  },
  cancelled: { 
    icon: XCircle, 
    color: 'bg-red-100 text-red-700',
    label: 'Cancelled'
  },
  completed: { 
    icon: CheckCircle, 
    color: 'bg-blue-100 text-blue-700',
    label: 'Completed'
  },
  no_show: { 
    icon: AlertCircle, 
    color: 'bg-yellow-100 text-yellow-700',
    label: 'No Show'
  },
};

export default function BookingCard({ booking, onCancel, showCancel = true }) {
  const status = statusConfig[booking.status] || statusConfig.confirmed;
  const StatusIcon = status.icon;
  const canCancel = booking.status === 'confirmed' && new Date(booking.travel_date) >= new Date();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <div className={`h-1 ${booking.status === 'confirmed' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gray-300'}`} />
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50">
                <Bus className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{booking.route_name}</h3>
                  <Badge className={status.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {format(new Date(booking.travel_date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Ticket className="w-4 h-4 text-gray-400" />
                    {booking.booking_id}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>{booking.boarding_point}</span>
                  <span className="text-gray-400">→</span>
                  <MapPin className="w-4 h-4 text-pink-500" />
                  <span>{booking.drop_point}</span>
                </div>

                <div className="text-sm text-gray-500">
                  {booking.seats_booked} seat{booking.seats_booked > 1 ? 's' : ''} booked
                </div>
              </div>
            </div>

            {showCancel && canCancel && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onCancel(booking)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}