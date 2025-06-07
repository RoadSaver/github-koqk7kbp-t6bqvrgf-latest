import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SimulatedEmployeeBlacklistService } from '@/services/simulatedEmployeeBlacklistService';

interface EmployeeSimulation {
  id: number;
  employee_number: number;
  full_name: string;
  created_at: string;
}

export const useEmployeeSimulation = () => {
  const [employees, setEmployees] = useState<EmployeeSimulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = useMemo(() => async () => {
    try {
      const { data, error } = await supabase
        .from('employee_simulation')
        .select('id, employee_number, full_name, created_at')
        .order('employee_number', { ascending: true });

      if (error) {
        console.error('Error loading employees:', error);
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error('Error in loadEmployees:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const getAvailableEmployee = useMemo(() => async (requestId: string, excludedNames: string[] = []): Promise<EmployeeSimulation | null> => {
    try {
      // Get blacklisted employees for this specific request
      const blacklistedEmployees = await SimulatedEmployeeBlacklistService.getBlacklistedEmployees(requestId);
      
      // Combine excluded names with blacklisted employees
      const allExcludedNames = [...excludedNames, ...blacklistedEmployees];
      
      const availableEmployees = employees.filter(emp => 
        !allExcludedNames.includes(emp.full_name)
      );
      
      if (availableEmployees.length === 0) {
        return null;
      }
      
      return availableEmployees[Math.floor(Math.random() * availableEmployees.length)];
    } catch (error) {
      console.error('Error getting available employee:', error);
      return null;
    }
  }, [employees]);

  return {
    employees,
    isLoading,
    getAvailableEmployee,
    loadEmployees
  };
};