// Filepath: /c:/Users/ewill/Documents/APS App v0.4.2/aps-app/src/components/Fees/InvoicePage.tsx
import React, { useEffect, useState } from 'react';
import { FileRecord, FeeRecord, Company, InvoiceRates } from '../types';
import FeeInvoicePrint from './FeeInvoicePrint';

const InvoicePage: React.FC = () => {
  console.log('InvoicePage component mounting...');

  const [invoiceData, setInvoiceData] = useState<{
    fileDetails: FileRecord;
    feeDetails: FeeRecord;
    companies?: Company[];
    invoiceRates?: InvoiceRates[];
  } | null>(null);

  useEffect(() => {
    console.log('Setting up Invoice Data Listener');

    // Add PDF rendering class to isolate from responsive design
    document.documentElement.classList.add('pdf-rendering');
    document.body.classList.add('pdf-rendering');

    let hasReceivedData = false;

    // Register the Invoice Data Listener
    const handleInvoiceData = (data: {
      fileDetails: FileRecord;
      feeDetails: FeeRecord;
      companies?: Company[];
      invoiceRates?: InvoiceRates[];
    }) => {
      if (!hasReceivedData) {
        console.log('Received invoice data:', data); // Debugging
        setInvoiceData(data);
        hasReceivedData = true;
      }
    };

    window.electronAPI.onInvoiceData(handleInvoiceData);

    // Cleanup the listener on unmount
    return () => {
      // Remove PDF rendering classes
      document.documentElement.classList.remove('pdf-rendering');
      document.body.classList.remove('pdf-rendering');

      // If you have an off method, use it. Otherwise, implement it accordingly.
      // Example:
      // window.electronAPI.offInvoiceData();
    };
  }, []);

  const handleRenderComplete = () => {
    console.log('All content loaded. Sending invoice-rendered event.');
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      window.electronAPI.sendInvoiceRendered();
    }, 100);
  };

  // Handle the case where invoice data is not yet received
  if (!invoiceData) {
    return (
      <div className="invoice-loading">
        <p>Loading Invoice...</p>
      </div>
    );
  }

  const { fileDetails, feeDetails, companies, invoiceRates } = invoiceData;

  console.log('InvoicePage rendering with data:', {
    fileDetails: !!fileDetails,
    feeDetails: !!feeDetails,
    companies: !!companies,
    invoiceRates: !!invoiceRates,
  });

  return (
    <div className="invoice-page">
      <ErrorBoundary>
        <FeeInvoicePrint
          fileDetails={fileDetails}
          feeDetails={feeDetails}
          onRenderComplete={handleRenderComplete}
          companiesOverride={companies}
          invoiceRatesOverride={invoiceRates}
        />
      </ErrorBoundary>
    </div>
  );
};

// Simple error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log('ErrorBoundary rendering fallback');
      // Call onRenderComplete even if there's an error to prevent timeout
      setTimeout(() => {
        window.electronAPI?.sendInvoiceRendered();
      }, 1000);

      return (
        <div style={{ padding: '20px' }}>
          <h1>Error loading invoice</h1>
          <p>There was an error rendering the invoice component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default InvoicePage;
