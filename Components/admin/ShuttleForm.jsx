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

const FEATURES = ['AC', 'WiFi', 'USB Charging', 'Wheelchair Access', 'GPS Tracking'];

export default function ShuttleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  isLoading 
}) {
  const [formData, setFormData] = useState({
    shuttle_number: '',
    name: '',
    capacity: 30,
    vehicle_type: 'standard_bus',
    status: 'active',
    features: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        features: initialData.features || [],
      });
    } else {
      setFormData({
        shuttle_number: '',
        name: '',
        capacity: 30,
        vehicle_type: 'standard_bus',
        status: 'active',
        features: [],
      });
    }
  }, [initialData, isOpen]);

  const toggleFeature = (feature) => {
    const features = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    setFormData({ ...formData, features });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Shuttle' : 'Add New Shuttle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Shuttle Number */}
          <div className="space-y-2">
            <Label>Shuttle Number</Label>
            <Input
              value={formData.shuttle_number}
              onChange={(e) => setFormData({ ...formData, shuttle_number: e.target.value })}
              placeholder="e.g., SH-001"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label>Shuttle Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Campus Express"
            />
          </div>

          {/* Capacity & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select 
                value={formData.vehicle_type}
                onValueChange={(v) => setFormData({ ...formData, vehicle_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mini_bus">Mini Bus (8-15)</SelectItem>
                  <SelectItem value="standard_bus">Standard Bus (16-35)</SelectItem>
                  <SelectItem value="large_bus">Large Bus (36-50)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
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
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((feature) => (
                <Badge
                  key={feature}
                  variant={formData.features.includes(feature) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    formData.features.includes(feature) 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.shuttle_number || !formData.name}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                initialData ? 'Update Shuttle' : 'Create Shuttle'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}