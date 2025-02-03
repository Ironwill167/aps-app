// Filepath: /c:/Users/ewill/Documents/APS App v0.4.2/aps-app/src/components/Fees/InvoicePage.tsx
import React, { useEffect, useState } from 'react';
import { FileRecord, FeeRecord } from '../types';
import FeeInvoicePrint from './FeeInvoicePrint';

const InvoicePage: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<{
    fileDetails: FileRecord;
    feeDetails: FeeRecord;
  } | null>(null);

  useEffect(() => {
    console.log('Setting up Invoice Data Listener');
    // Register the Invoice Data Listener
    window.electronAPI.onInvoiceData((data) => {
      console.log('Received invoice data:', data); // Debugging
      setInvoiceData(data);
    });

    // Cleanup the listener on unmount
    return () => {
      // If you have an off method, use it. Otherwise, implement it accordingly.
      // Example:
      // window.electronAPI.offInvoiceData();
    };
  }, []);

  const handleRenderComplete = () => {
    console.log('All content loaded. Sending invoice-rendered event.');
    window.electronAPI.sendInvoiceRendered();
  };

  // Handle the case where invoice data is not yet received
  if (!invoiceData) {
    return (
      <div className="invoice-loading">
        <p>Loading Invoice...</p>
      </div>
    );
  }

  const { fileDetails, feeDetails } = invoiceData;

  return (
    <div className="invoice-page">
      <FeeInvoicePrint
        fileDetails={fileDetails}
        feeDetails={feeDetails}
        onRenderComplete={handleRenderComplete}
      />
    </div>
  );
};

export default InvoicePage;
