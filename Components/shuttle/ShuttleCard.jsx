import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, Users, Clock, MapPin, Wifi, Wind, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const featureIcons = {
  'AC': Wind,
  'WiFi': Wifi,
};

export default function ShuttleCard({ schedule, shuttle, onBook, bookedSeats = 0 }) {
  const availableSeats = (shuttle?.capacity || 0) - bookedSeats;
  const isAvailable = availableSeats > 0 && schedule?.status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50">
                <Bus className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {schedule?.route_name}
                </CardTitle>
                <p className="text-sm text-gray-500">{shuttle?.name || 'Shuttle'}</p>
              </div>
            </div>
            <Badge 
              variant={isAvailable ? "default" : "destructive"}
              className={isAvailable ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
            >
              {availableSeats} seats left
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">{schedule?.origin}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span className="font-medium">{schedule?.destination}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{schedule?.departure_time} - {schedule?.arrival_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{shuttle?.capacity} total seats</span>
            </div>
          </div>

          {schedule?.stops?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {schedule.stops.map((stop, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                  {stop}
                </Badge>
              ))}
            </div>
          )}

          {shuttle?.features?.length > 0 && (
            <div className="flex gap-3 pt-2 border-t">
              {shuttle.features.map((feature, idx) => {
                const Icon = featureIcons[feature] || Bus;
                return (
                  <div key={idx} className="flex items-center gap-1 text-xs text-gray-500">
                    <Icon className="w-3 h-3" />
                    <span>{feature}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            {schedule?.price !== undefined && (
              <span className="text-lg font-bold text-indigo-600">
                ${schedule.price.toFixed(2)}
              </span>
            )}
            <Button 
              onClick={() => onBook(schedule)}
              disabled={!isAvailable}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6"
            >
              {isAvailable ? 'Book Now' : 'Fully Booked'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}