import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Calendar } from "@/Components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Bus, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingModal({ 
  isOpen, 
  onClose, 
  schedule, 
  shuttle,
  onConfirm,
  isLoading 
}) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    travel_date: new Date(),
    boarding_point: schedule?.origin || '',
    drop_point: schedule?.destination || '',
    seats_booked: 1,
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBookingData({
        travel_date: new Date(),
        boarding_point: schedule?.origin || '',
        drop_point: schedule?.destination || '',
        seats_booked: 1,
      });
    }
  }, [isOpen, schedule?.id]);

  const allStops = [schedule?.origin, ...(schedule?.stops || []), schedule?.destination].filter(Boolean);

  const handleConfirm = async () => {
    const success = await onConfirm(bookingData);
    if (success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setStep(1);
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBookingSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-indigo-600" />
            Book Shuttle
          </DialogTitle>
          <DialogDescription>
            {schedule?.route_name}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {bookingSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Booking Confirmed!</h3>
              <p className="text-sm text-gray-500 mt-1">Check your notifications for details</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-4"
            >
              {/* Route Info */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>{schedule?.origin}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    <span>{schedule?.destination}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{schedule?.departure_time} - {schedule?.arrival_time}</span>
                </div>
              </div>

              {/* Travel Date */}
              <div className="space-y-2">
                <Label>Travel Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(bookingData.travel_date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingData.travel_date}
                      onSelect={(date) => setBookingData({ ...bookingData, travel_date: date })}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Boarding Point */}
              <div className="space-y-2">
                <Label>Boarding Point</Label>
                <Select 
                  value={bookingData.boarding_point}
                  onValueChange={(v) => setBookingData({ ...bookingData, boarding_point: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select boarding point" />
                  </SelectTrigger>
                  <SelectContent>
                    {allStops.map((stop, idx) => (
                      <SelectItem key={idx} value={stop}>{stop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Drop Point */}
              <div className="space-y-2">
                <Label>Drop Point</Label>
                <Select 
                  value={bookingData.drop_point}
                  onValueChange={(v) => setBookingData({ ...bookingData, drop_point: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select drop point" />
                  </SelectTrigger>
                  <SelectContent>
                    {allStops.map((stop, idx) => (
                      <SelectItem key={idx} value={stop}>{stop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Seats */}
              <div className="space-y-2">
                <Label>Number of Seats</Label>
                <Select 
                  value={String(bookingData.seats_booked)}
                  onValueChange={(v) => setBookingData({ ...bookingData, seats_booked: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select seats" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={String(num)}>{num} seat{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Summary */}
              {schedule?.price !== undefined && (
                <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-xl font-bold text-indigo-600">
                    ${(schedule.price * bookingData.seats_booked).toFixed(2)}
                  </span>
                </div>
              )}

              <Button 
                onClick={handleConfirm}
                disabled={isLoading || !bookingData.boarding_point || !bookingData.drop_point}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}