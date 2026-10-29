import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Play, Square, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Simulate movement along campus routes in Gulshan-e-Iqbal Block 7, Karachi
const campusRoutes = {
  route1: [
    { lat: 24.9227, lng: 67.0854, speed: 25, status: 'moving' },
    { lat: 24.9237, lng: 67.0864, speed: 30, status: 'moving' },
    { lat: 24.9247, lng: 67.0874, speed: 28, status: 'moving' },
    { lat: 24.9257, lng: 67.0884, speed: 0, status: 'stopped' },
  ],
  route2: [
    { lat: 24.9207, lng: 67.0834, speed: 20, status: 'moving' },
    { lat: 24.9217, lng: 67.0844, speed: 25, status: 'moving' },
    { lat: 24.9227, lng: 67.0854, speed: 22, status: 'moving' },
  ],
  route3: [
    { lat: 24.9197, lng: 67.0814, speed: 18, status: 'moving' },
    { lat: 24.9207, lng: 67.0824, speed: 20, status: 'moving' },
    { lat: 24.9217, lng: 67.0834, speed: 0, status: 'stopped' },
  ],
};

let simulationInterval = null;
let currentIndex = {};

export default function LocationSimulator() {
  const queryClient = useQueryClient();
  const [isRunning, setIsRunning] = React.useState(false);

  const { data: shuttles = [] } = useQuery({
    queryKey: ['shuttles'],
    queryFn: () => base44.entities.Shuttle.list(),
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (locationData) => {
      // Check if location exists for this shuttle
      const existing = await base44.entities.ShuttleLocation.filter({ shuttle_id: locationData.shuttle_id });
      
      if (existing && existing.length > 0) {
        // Update existing location
        return base44.entities.ShuttleLocation.update(existing[0].id, locationData);
      } else {
        // Create new location
        return base44.entities.ShuttleLocation.create(locationData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shuttleLocations'] });
    },
  });

  const startSimulation = () => {
    if (shuttles.length === 0) {
      toast.error('No shuttles available to simulate');
      return;
    }

    setIsRunning(true);
    toast.success('GPS simulation started');

    // Initialize indices
    shuttles.slice(0, 3).forEach((shuttle, idx) => {
      currentIndex[shuttle.id] = 0;
    });

    simulationInterval = setInterval(() => {
      shuttles.slice(0, 3).forEach((shuttle, idx) => {
        const routes = Object.values(campusRoutes);
        const route = routes[idx % routes.length];
        
        if (!currentIndex[shuttle.id]) currentIndex[shuttle.id] = 0;
        
        const point = route[currentIndex[shuttle.id] % route.length];
        const heading = Math.floor(Math.random() * 360);

        updateLocationMutation.mutate({
          shuttle_id: shuttle.id,
          latitude: point.lat + (Math.random() - 0.5) * 0.001,
          longitude: point.lng + (Math.random() - 0.5) * 0.001,
          speed: point.speed,
          heading: heading,
          status: point.status,
        });

        currentIndex[shuttle.id]++;
      });
    }, 3000); // Update every 3 seconds
  };

  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
      setIsRunning(false);
      toast.info('GPS simulation stopped');
    }
  };

  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, []);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-600" />
          GPS Location Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Simulate real-time GPS tracking for active shuttles. This will update shuttle locations every 3 seconds.
        </p>
        <div className="flex gap-2">
          {!isRunning ? (
            <Button 
              onClick={startSimulation}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Simulation
            </Button>
          ) : (
            <Button 
              onClick={stopSimulation}
              variant="destructive"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Simulation
            </Button>
          )}
        </div>
        {isRunning && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-700 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              GPS simulation is running...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}