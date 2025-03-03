import React, { useCallback, lazy, Suspense } from 'react';
import { InvoiceRates } from '../../types';
import { useData } from '../../hooks/UseData';
import CustomDialog from '../../utils/CustomDialog';
import { deleteRate } from '../../hooks/ApiServices';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const EditInvoiceRateModal = lazy(() => import('../DataModals/EditInvoiceRateModal'));

const InvoiceRatesData: React.FC = () => {
  const { invoice_rates } = useData();

  const [showEditInvoiceRateModal, setShowEditInvoiceRateModal] = React.useState(false);

  const [selectedInvoiceRate, setSelectedInvoiceRate] = React.useState<Partial<InvoiceRates>>({});
  const [invoiceRateToDelete, setInvoiceRateToDelete] =
    React.useState<Partial<InvoiceRates> | null>(null);

  const [mode, setMode] = React.useState<'add' | 'edit'>('add');

  const sorted_invoice_rates = React.useMemo(() => {
    return [...invoice_rates].sort((a, b) =>
      a.rate_preset_name!.localeCompare(b.rate_preset_name!)
    );
  }, [invoice_rates]);

  const editInvoiceRate = (id: number) => {
    setSelectedInvoiceRate(invoice_rates.find((invoiceRate) => invoiceRate.id === id) || {});
    setMode('edit');
    setShowEditInvoiceRateModal(true);
  };

  const handleDeleteInvoiceRate = useCallback(
    (id: number) => {
      const invoiceRate = invoice_rates.find((c) => c.id === id) || null;
      setInvoiceRateToDelete(invoiceRate);
    },
    [invoice_rates]
  );

  const handleConfirmDelete = async () => {
    if (invoiceRateToDelete && invoiceRateToDelete.id !== undefined) {
      try {
        const response = await deleteRate(invoiceRateToDelete.id);
        showSuccessToast(response.data);
        setInvoiceRateToDelete(null);
      } catch (err) {
        console.error('Error deleting invoice rate:', err);
        showErrorToast('There was an error deleting the invoice rate. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setInvoiceRateToDelete(null);
  };

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th className="data_invoice_rate_name">Name</th>
            <th className="data_invoice_rate_description">Description</th>
            <th className="data_invoice_rate_currency">Currency</th>
            <th className="data_invoice_survey_rate">Survey Rate</th>
            <th className="data_invoice_report_rate">Report Rate</th>
            <th className="date_invoice_admin_rate">Admin Rate</th>
            <th className="data_invoice_travel_hourly_rate">Travel Rate</th>
            <th className="data_invoice_travel_km_rate">KM Rate</th>
            <th className="data_invoice_survey_rate_actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted_invoice_rates.map((invoiceRate) => (
            <tr key={invoiceRate.id}>
              <td className="data_invoice_rate_name">{invoiceRate.rate_preset_name}</td>
              <td className="data_invoice_rate_description">
                {invoiceRate.rate_preset_description}
              </td>
              <td className="data_invoice_rate_currency">{invoiceRate.rate_preset_currency}</td>
              <td className="data_invoice_survey_rate">{invoiceRate.survey_hourly_rate}</td>
              <td className="data_invoice_report_rate">{invoiceRate.report_hourly_rate}</td>
              <td className="date_invoice_admin_rate">{invoiceRate.admin_hourly_rate}</td>
              <td className="data_invoice_travel_hourly_rate">{invoiceRate.travel_hourly_rate}</td>
              <td className="data_invoice_travel_km_rate">{invoiceRate.travel_km_rate}</td>
              <td className="data_invoice_survey_rate_actions">
                <button onClick={() => editInvoiceRate(invoiceRate.id!)}>Edit</button>
                <button onClick={() => handleDeleteInvoiceRate(invoiceRate.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CustomDialog
        open={false}
        title={'Delete Invoice Rate'}
        message={`Are you sure you want to delete the invoice rate: ${invoiceRateToDelete?.rate_preset_name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          handleCancelDelete();
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        {showEditInvoiceRateModal && (
          <EditInvoiceRateModal
            onClose={() => setShowEditInvoiceRateModal(false)}
            mode={mode}
            initialData={selectedInvoiceRate}
          />
        )}
      </Suspense>
    </div>
  );
};

export default InvoiceRatesData;
