import { useEmployeeSimulation } from '@/hooks/useEmployeeSimulation';
import { ServiceType } from '../types/serviceRequestState';
import { toast } from "@/components/ui/use-toast";
import { UserHistoryService } from '@/services/userHistoryService';
import { useApp } from '@/contexts/AppContext';
import { useMemo, useCallback } from 'react';
import { SimulatedEmployeeBlacklistService } from '@/services/simulatedEmployeeBlacklistService';

export const useRequestSimulation = () => {
  const { loadEmployees, getAvailableEmployee } = useEmployeeSimulation();
  const { user } = useApp();

  const simulateEmployeeResponse = useCallback(async (
    requestId: string,
    timestamp: string,
    type: ServiceType,
    userLocation: { lat: number; lng: number },
    onQuoteReceived: (quote: number, employeeName: string) => void,
    onNoEmployeeAvailable: () => void
  ) => {
    try {
      await loadEmployees();
      const employee = await getAvailableEmployee(requestId);
      
      if (!employee) {
        onNoEmployeeAvailable();
        return;
      }

      // Simulate employee response delay (2-5 seconds)
      setTimeout(() => {
        const basePrices = {
          'flat-tyre': 40,
          'out-of-fuel': 30,
          'car-battery': 60,
          'tow-truck': 100,
          'emergency': 80,
          'other-car-problems': 50,
          'support': 50
        };
        
        const basePrice = basePrices[type] || 50;
        const randomPrice = basePrice + Math.floor(Math.random() * 20) - 10;
        const finalPrice = Math.max(20, randomPrice);
        
        onQuoteReceived(finalPrice, employee.full_name);
      }, 2000 + Math.random() * 3000);
      
    } catch (error) {
      console.error('Error in employee simulation:', error);
      onNoEmployeeAvailable();
    }
  }, [loadEmployees, getAvailableEmployee]);

  const handleAccept = useCallback(async (
    requestId: string,
    priceQuote: number,
    employeeName: string,
    userId: string,
    userLocation: { lat: number; lng: number },
    employeeStartLocation: { lat: number; lng: number },
    etaSeconds: number,
    onEtaUpdate: (remaining: number) => void,
    onLocationUpdate: (location: { lat: number; lng: number }) => void,
    onCompletion: () => void
  ) => {
    if (!user) return;
    
    // Start ETA countdown
    let remainingTime = etaSeconds;
    const etaInterval = setInterval(() => {
      remainingTime--;
      onEtaUpdate(remainingTime);
      
      if (remainingTime <= 0) {
        clearInterval(etaInterval);
      }
    }, 1000);

    // Simulate employee movement towards user
    let currentLocation = { ...employeeStartLocation };
    const totalSteps = etaSeconds / 2;
    let step = 0;
    
    const movementInterval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      
      currentLocation = {
        lat: employeeStartLocation.lat + (userLocation.lat - employeeStartLocation.lat) * progress,
        lng: employeeStartLocation.lng + (userLocation.lng - employeeStartLocation.lng) * progress
      };
      
      onLocationUpdate(currentLocation);
      
      if (step >= totalSteps) {
        clearInterval(movementInterval);
        setTimeout(onCompletion, 5000);
      }
    }, 2000);
    
    // Cleanup intervals after maximum time
    setTimeout(() => {
      clearInterval(etaInterval);
      clearInterval(movementInterval);
    }, (etaSeconds + 10) * 1000);
  }, [user]);

  const addEmployeeToBlacklist = useCallback(async (
    requestId: string,
    employeeName: string,
    userId: string
  ) => {
    try {
      await SimulatedEmployeeBlacklistService.addToBlacklist(requestId, employeeName, userId);
    } catch (error) {
      console.error('Error adding employee to blacklist:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    simulateEmployeeResponse,
    handleAccept,
    addEmployeeToBlacklist
  }), [simulateEmployeeResponse, handleAccept, addEmployeeToBlacklist]);
};