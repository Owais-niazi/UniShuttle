import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  shuttles = [],
  initialData = null,
  isLoading 
}) {
  const [formData, setFormData] = useState({
    shuttle_id: '',
    route_name: '',
    origin: '',
    destination: '',
    stops: [],
    departure_time: '',
    arrival_time: '',
    days_of_operation: [],
    price: 0,
    status: 'active',
  });
  const [newStop, setNewStop] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        stops: initialData.stops || [],
        days_of_operation: initialData.days_of_operation || [],
      });
    } else {
      setFormData({
        shuttle_id: '',
        route_name: '',
        origin: '',
        destination: '',
        stops: [],
        departure_time: '',
        arrival_time: '',
        days_of_operation: [],
        price: 0,
        status: 'active',
      });
    }
  }, [initialData, isOpen]);

  const addStop = () => {
    if (newStop.trim()) {
      setFormData({
        ...formData,
        stops: [...formData.stops, newStop.trim()],
      });
      setNewStop('');
    }
  };

  const removeStop = (index) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((_, i) => i !== index),
    });
  };

  const toggleDay = (day) => {
    const days = formData.days_of_operation.includes(day)
      ? formData.days_of_operation.filter(d => d !== day)
      : [...formData.days_of_operation, day];
    setFormData({ ...formData, days_of_operation: days });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedShuttle = shuttles.find(s => s.id === formData.shuttle_id);
    onSubmit({
      ...formData,
      available_seats: selectedShuttle?.capacity || 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Schedule' : 'Add New Schedule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Shuttle Selection */}
          <div className="space-y-2">
            <Label>Shuttle</Label>
            <Select 
              value={formData.shuttle_id}
              onValueChange={(v) => setFormData({ ...formData, shuttle_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shuttle" />
              </SelectTrigger>
              <SelectContent>
                {shuttles.filter(s => s.status === 'active').map((shuttle) => (
                  <SelectItem key={shuttle.id} value={shuttle.id}>
                    {shuttle.name} ({shuttle.shuttle_number}) - {shuttle.capacity} seats
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Route Name */}
          <div className="space-y-2">
            <Label>Route Name</Label>
            <Input
              value={formData.route_name}
              onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
              placeholder="e.g., Main Campus to Downtown"
            />
          </div>

          {/* Origin & Destination */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origin</Label>
              <Input
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="Starting point"
              />
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="End point"
              />
            </div>
          </div>

          {/* Stops */}
          <div className="space-y-2">
            <Label>Intermediate Stops</Label>
            <div className="flex gap-2">
              <Input
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                placeholder="Add a stop"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStop())}
              />
              <Button type="button" variant="outline" onClick={addStop}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.stops.map((stop, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {stop}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeStop(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departure Time</Label>
              <Input
                type="time"
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Arrival Time</Label>
              <Input
                type="time"
                value={formData.arrival_time}
                onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
              />
            </div>
          </div>

          {/* Days of Operation */}
          <div className="space-y-2">
            <Label>Days of Operation</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <Badge
                  key={day}
                  variant={formData.days_of_operation.includes(day) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    formData.days_of_operation.includes(day) 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.shuttle_id || !formData.route_name}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                initialData ? 'Update Schedule' : 'Create Schedule'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}