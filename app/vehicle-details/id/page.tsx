// app/vehicle-details/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/components/UserContext';
import VehicleDetails from '@/components/vehicle-details';
import { Vehicle } from '@/types/vehicle';
// Removed fetchVehicleById as it's not used directly
// import { fetchVehicleById } from '@/lib/vehicle-service';
import { Header } from '@/components/ui/header';
import { vehicleService } from '@/lib/vehicle-service';
export default function VehicleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, signOut, savedVehicles, toggleSaveVehicle } = useUser(); // Get user and handlers

  useEffect(() => {
    if (id) {
      const vehicleId = Array.isArray(id) ? id[0] : id;
      const getVehicle = async () => {
        try {
          setLoading(true);;
          const vehicleData = await vehicleService.getVehicleById(vehicleId as string);
          if (vehicleData) {
            setVehicle(vehicleData);
          } else {
            setError('Vehicle not found');
          }
        } catch (err) {
          console.error('Error fetching vehicle:', err);
          setError('Failed to load vehicle details.');
        } finally {
          setLoading(false);
        }
      };
      getVehicle();
    }
  }, [id]);

  // Navigation handlers for the Header
  const navigationHandlers = {
    onLoginClick: () => router.push('/login'),
    onDashboardClick: () => router.push('/dashboard'),
    onGoHome: () => router.push('/'), // Assuming '/' is your home route
    onShowAllCars: () => router.push('/results'),
    onGoToSellPage: () => router.push('/upload-vehicle'),
    onSignOut: signOut,
  };

  // VehicleDetails component in this page doesn't need onBack, user, savedCars, onSaveCar props
  // as the state management for saved cars and user context is handled by the wrapper and useUser hook
  // We will pass isSaved and onToggleSave directly if the inner component needs it, otherwise it manages its own state.

  if (loading) {
    return <div className="container mx-auto p-4">Loading vehicle details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!vehicle) {
    return <div className="container mx-auto p-4">Vehicle not found.</div>;
  }

  return (
    < >
      {/* Header */}
      <Header user={user} {...navigationHandlers} />
      <div className="pt-16 md:pt-20 container mx-auto p-4">
        <VehicleDetails vehicle={vehicle} />
      </div>
    < />
  );
}
