import React from 'react';
import { useTranslation } from '@/utils/translations';
import { useApp } from '@/contexts/AppContext';
import { Button } from "@/components/ui/button";
import PriceBreakdown from './PriceBreakdown';

interface PriceQuoteContentProps {
  serviceType: string;
  priceQuote: number;
  employeeName: string;
  hasDeclinedOnce: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onCancelRequest: () => void;
}

const PriceQuoteContent: React.FC<PriceQuoteContentProps> = ({
  serviceType,
  priceQuote,
  employeeName,
  hasDeclinedOnce,
  onAccept,
  onDecline,
  onCancelRequest
}) => {
  const { language } = useApp();
  const t = useTranslation(language);
  
  const serviceFee = 5;
  const totalPrice = priceQuote + serviceFee;

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-secondary p-3">
        <h3 className="font-medium mb-2">Service Request</h3>
        <p className="text-sm">{t(serviceType)}</p>
      </div>
      
      <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
        <h3 className="font-medium mb-2">
          Price Quote from: {employeeName || 'Technician'}
        </h3>
        <PriceBreakdown
          priceQuote={priceQuote}
          serviceFee={serviceFee}
          totalPrice={totalPrice}
        />
      </div>

      {hasDeclinedOnce && (
        <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            This is a revised quote from {employeeName || 'the technician'} based on your previous decline.
          </p>
        </div>
      )}
      
      <div className="flex flex-col gap-2 mt-6">
        <Button 
          onClick={onAccept}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Accept Quote
        </Button>
        <Button 
          onClick={onDecline}
          variant="outline"
          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
        >
          {hasDeclinedOnce ? 'Final Decline' : 'Request Revision'}
        </Button>
        <Button 
          onClick={onCancelRequest}
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-50"
        >
          Cancel Request
        </Button>
      </div>
    </div>
  );
};

export default PriceQuoteContent;