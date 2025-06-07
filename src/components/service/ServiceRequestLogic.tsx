import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useApp } from '@/contexts/AppContext';
import { serviceMessages } from './constants/serviceMessages';
import { ServiceType } from './types/serviceRequestState';
import { useServiceValidation } from './hooks/useServiceValidation';
import { useRequestSimulation } from './hooks/useRequestSimulation';
import { useRequestActions } from './hooks/useRequestActions';
import { usePriceQuoteSnapshot } from '@/hooks/usePriceQuoteSnapshot';
import { UserHistoryService } from '@/services/userHistoryService';
import { SimulatedEmployeeBlacklistService } from '@/services/simulatedEmployeeBlacklistService';

// Request states following Uber Eats/Glovo pattern
type RequestState = 'idle' | 'searching' | 'quote_received' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export const useServiceRequest = (
  type: ServiceType,
  userLocation: { lat: number; lng: number }
) => {
  const { setOngoingRequest, ongoingRequest, user } = useApp();
  const { validateMessage } = useServiceValidation();
  const { simulateEmployeeResponse, handleAccept, addEmployeeToBlacklist } = useRequestSimulation();
  const {
    handleCancelRequest: cancelRequest,
    handleContactSupport
  } = useRequestActions();
  const { storeSnapshot, loadSnapshot, storedSnapshot, moveToFinished } = usePriceQuoteSnapshot();

  // Core state management
  const [message, setMessage] = useState(() => serviceMessages[type] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>('idle');
  
  // Employee and pricing state
  const [assignedEmployee, setAssignedEmployee] = useState<string>('');
  const [priceQuote, setPriceQuote] = useState<number>(0);
  const [employeeLocation, setEmployeeLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [eta, setEta] = useState<string | null>(null);
  
  // Decline tracking
  const [hasDeclinedOnce, setHasDeclinedOnce] = useState<boolean>(false);
  const [showWaitingForRevision, setShowWaitingForRevision] = useState(false);

  // Derived states for backward compatibility
  const showRealTimeUpdate = requestState !== 'idle';
  const showPriceQuote = requestState === 'quote_received';
  const status = requestState === 'searching' ? 'pending' : 
                requestState === 'accepted' || requestState === 'in_progress' ? 'accepted' : 
                requestState === 'cancelled' ? 'declined' : 'pending';

  // Reset state when ongoing request changes
  useEffect(() => {
    if (!ongoingRequest) {
      setRequestState('idle');
      setAssignedEmployee('');
      setHasDeclinedOnce(false);
      setPriceQuote(0);
      setEmployeeLocation(undefined);
      setEta(null);
      setShowWaitingForRevision(false);
    }
  }, [ongoingRequest]);

  // Sync with ongoing request
  useEffect(() => {
    if (ongoingRequest) {
      if (ongoingRequest.priceQuote !== undefined && ongoingRequest.priceQuote >= 0) {
        setPriceQuote(ongoingRequest.priceQuote);
        if (requestState === 'searching') {
          setRequestState('quote_received');
        }
      }
      if (ongoingRequest.employeeName && !assignedEmployee) {
        setAssignedEmployee(ongoingRequest.employeeName);
      }
      if (ongoingRequest.status === 'accepted' && requestState !== 'accepted' && requestState !== 'in_progress') {
        setRequestState('accepted');
      }
    }
  }, [ongoingRequest, requestState, assignedEmployee]);

  const handleSubmit = useCallback(() => {
    if (!validateMessage(message, type)) {
      return;
    }

    setIsSubmitting(true);
    setRequestState('searching');
    
    setTimeout(() => {
      const requestId = Date.now().toString();
      
      const newOngoingRequest = {
        id: requestId,
        type,
        status: 'pending' as const,
        timestamp: new Date().toLocaleString(),
        location: 'Sofia Center, Bulgaria'
      };
      
      setOngoingRequest(newOngoingRequest);
      setIsSubmitting(false);
      
      toast({
        title: "Request Sent",
        description: "Searching for available technician..."
      });

      // Find employee and get quote
      simulateEmployeeResponse(
        requestId,
        new Date().toISOString(),
        type,
        userLocation,
        async (quote: number, employeeName: string) => {
          console.log('Quote received:', quote, 'from:', employeeName);
          
          // Only update if we're still in searching state
          if (requestState === 'searching') {
            setPriceQuote(quote);
            setAssignedEmployee(employeeName);
            setRequestState('quote_received');
            
            await storeSnapshot(requestId, type, quote, employeeName, false);
            
            setOngoingRequest(prev => prev ? {
              ...prev,
              priceQuote: quote,
              employeeName: employeeName
            } : null);
            
            toast({
              title: "Quote Received",
              description: `${employeeName} sent you a quote for ${quote} BGN`
            });
          }
        },
        () => {
          // No employee available
          setRequestState('cancelled');
          setOngoingRequest(null);
          toast({
            title: "No technicians available",
            description: "Please try again later.",
            variant: "destructive"
          });
        }
      );
    }, 1500);
  }, [validateMessage, message, type, setOngoingRequest, simulateEmployeeResponse, userLocation, storeSnapshot, requestState]);

  const handleAcceptQuote = useCallback(async () => {
    if (!user || !ongoingRequest || !assignedEmployee || requestState !== 'quote_received') return;
    
    console.log('Accepting quote from:', assignedEmployee);
    
    setRequestState('accepted');
    
    // Generate employee starting location
    const employeeStartLocation = {
      lat: userLocation.lat + (Math.random() - 0.5) * 0.02,
      lng: userLocation.lng + (Math.random() - 0.5) * 0.02
    };
    
    setEmployeeLocation(employeeStartLocation);
    
    setOngoingRequest(prev => prev ? { 
      ...prev, 
      status: 'accepted' as const,
      employeeLocation: employeeStartLocation
    } : null);
    
    toast({
      title: "Quote Accepted",
      description: `${assignedEmployee} is on the way to your location.`
    });

    // Start service simulation
    await handleAccept(
      ongoingRequest.id,
      priceQuote,
      assignedEmployee,
      user.username,
      userLocation,
      employeeStartLocation,
      15, // 15 seconds ETA
      (remaining) => {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        setEta(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      },
      (location) => {
        setEmployeeLocation(location);
      },
      async () => {
        // Service completion
        setRequestState('completed');
        
        toast({
          title: "Service Completed",
          description: `Your ${type} service has been completed successfully.`
        });
        
        // Add to user history
        try {
          await UserHistoryService.addHistoryEntry({
            user_id: user.username,
            username: user.username,
            service_type: type,
            status: 'completed',
            employee_name: assignedEmployee,
            price_paid: priceQuote,
            service_fee: 5,
            total_price: priceQuote + 5,
            request_date: new Date().toISOString(),
            completion_date: new Date().toISOString(),
            address_street: 'Sofia Center, Bulgaria',
            latitude: userLocation.lat,
            longitude: userLocation.lng
          });
        } catch (error) {
          console.error('Error recording completion:', error);
        }
        
        // Clean up
        setOngoingRequest(null);
        setRequestState('idle');
      }
    );
  }, [user, ongoingRequest, assignedEmployee, requestState, userLocation, setOngoingRequest, handleAccept, priceQuote, type]);

  const handleDeclineQuote = useCallback(async (isSecondDecline: boolean = false) => {
    if (!user || !assignedEmployee || !ongoingRequest || requestState !== 'quote_received') return;
    
    console.log('Declining quote from:', assignedEmployee, 'Second decline:', isSecondDecline);
    
    if (!hasDeclinedOnce && !isSecondDecline) {
      // First decline - same employee sends revision
      setHasDeclinedOnce(true);
      setRequestState('searching');
      setShowWaitingForRevision(true);
      
      toast({
        title: "Quote Declined",
        description: `${assignedEmployee} will send you a revised quote.`
      });
      
      // Show waiting screen for 2 seconds, then revised quote from SAME employee
      setTimeout(() => {
        setShowWaitingForRevision(false);
        
        // Generate revised quote (lower than original)
        const revisedQuote = Math.max(10, priceQuote - Math.floor(Math.random() * 15) - 5);
        setPriceQuote(revisedQuote);
        setRequestState('quote_received');
        
        setOngoingRequest(prev => prev ? {
          ...prev,
          priceQuote: revisedQuote,
          employeeName: assignedEmployee
        } : null);
        
        toast({
          title: "Revised Quote Received",
          description: `${assignedEmployee} sent a revised quote of ${revisedQuote} BGN.`
        });
      }, 2000);
      
    } else {
      // Second decline - blacklist employee and find new one
      console.log('Second decline - blacklisting employee:', assignedEmployee);
      
      try {
        await addEmployeeToBlacklist(ongoingRequest.id, assignedEmployee, user.username);
      } catch (error) {
        console.error('Error adding employee to blacklist:', error);
      }
      
      // Record decline in history
      try {
        await UserHistoryService.addHistoryEntry({
          user_id: user.username,
          username: user.username,
          service_type: type,
          status: 'declined',
          employee_name: assignedEmployee,
          request_date: new Date().toISOString(),
          completion_date: new Date().toISOString(),
          address_street: 'Sofia Center, Bulgaria',
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          decline_reason: 'User declined quote twice'
        });
      } catch (error) {
        console.error('Error recording decline:', error);
      }
      
      // Reset and find new employee
      const previousEmployee = assignedEmployee;
      setAssignedEmployee('');
      setHasDeclinedOnce(false);
      setRequestState('searching');
      
      toast({
        title: "Quote Declined",
        description: "Looking for another available technician..."
      });
      
      // Find new employee
      setTimeout(() => {
        simulateEmployeeResponse(
          ongoingRequest.id,
          new Date().toISOString(),
          type,
          userLocation,
          (quote: number, employeeName: string) => {
            console.log('New quote from new employee:', employeeName, 'Amount:', quote);
            setPriceQuote(quote);
            setAssignedEmployee(employeeName);
            setRequestState('quote_received');
            
            setOngoingRequest(prev => prev ? {
              ...prev,
              priceQuote: quote,
              employeeName: employeeName
            } : null);
          },
          () => {
            // No more employees available
            setRequestState('cancelled');
            setOngoingRequest(null);
            toast({
              title: "No technicians available",
              description: "All technicians are currently busy. Please try again later.",
              variant: "destructive"
            });
          }
        );
      }, 2000);
    }
  }, [user, assignedEmployee, hasDeclinedOnce, priceQuote, setOngoingRequest, type, userLocation, ongoingRequest, addEmployeeToBlacklist, simulateEmployeeResponse, requestState]);
  
  const handleCancelRequest = useCallback(async () => {
    if (ongoingRequest) {
      await SimulatedEmployeeBlacklistService.clearBlacklistForRequest(ongoingRequest.id);
    }
    setRequestState('cancelled');
    setOngoingRequest(null);
    cancelRequest(() => {});
  }, [cancelRequest, ongoingRequest, setOngoingRequest]);

  const showStoredPriceQuote = useCallback(() => {
    if (storedSnapshot) {
      setRequestState('quote_received');
    }
  }, [storedSnapshot]);

  const setShowPriceQuote = useCallback((show: boolean) => {
    if (show && requestState === 'idle') {
      setRequestState('quote_received');
    } else if (!show && requestState === 'quote_received') {
      setRequestState('searching');
    }
  }, [requestState]);

  return useMemo(() => ({
    message,
    setMessage,
    isSubmitting,
    showRealTimeUpdate,
    showPriceQuote,
    setShowPriceQuote,
    priceQuote,
    employeeLocation,
    status,
    declineReason: '',
    currentEmployeeName: assignedEmployee,
    hasDeclinedOnce,
    eta,
    showWaitingForRevision,
    handleSubmit,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleContactSupport,
    storedSnapshot,
    showStoredPriceQuote
  }), [
    message,
    isSubmitting,
    showRealTimeUpdate,
    showPriceQuote,
    setShowPriceQuote,
    priceQuote,
    employeeLocation,
    status,
    assignedEmployee,
    hasDeclinedOnce,
    eta,
    showWaitingForRevision,
    handleSubmit,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleContactSupport,
    storedSnapshot,
    showStoredPriceQuote
  ]);
};