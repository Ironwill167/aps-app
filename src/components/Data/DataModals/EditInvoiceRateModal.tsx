import React, { useState } from 'react';
import { InvoiceRates } from '../../types';
import { useAddInvoiceRate, useUpdateInvoiceRate } from '../../hooks/UseMutations';
import { validateAndParseNumber, handleNumberInputKeyDown } from '../../utils/NumberUtils';

interface EditInvoiceRateModalProps {
  mode: string;
  initialData?: Partial<InvoiceRates>;
  onClose: () => void;
}

const EditInvoiceRateModal: React.FC<EditInvoiceRateModalProps> = ({
  mode,
  initialData = {},
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<InvoiceRates>>({ ...initialData });
  const addInvoiceRateMutation = useAddInvoiceRate();
  const editInvoiceRateMutation = useUpdateInvoiceRate();

  // State to store the raw string inputs that the user types
  const [rawValues, setRawValues] = useState<Record<string, string>>({
    survey_hourly_rate: formData.survey_hourly_rate?.toString() || '',
    report_hourly_rate: formData.report_hourly_rate?.toString() || '',
    admin_hourly_rate: formData.admin_hourly_rate?.toString() || '',
    travel_hourly_rate: formData.travel_hourly_rate?.toString() || '',
    travel_km_rate: formData.travel_km_rate?.toString() || '',
  });

  // Handle changes in the text box but store them as raw strings
  const handleRawChange = (key: string, value: string) => {
    // Optional: we can block invalid characters in real-time, or let handleNumberInputKeyDown do it
    setRawValues({
      ...rawValues,
      [key]: value,
    });
  };

  // When user leaves the field, parse and store the numeric value
  const handleNumericBlur = (key: keyof InvoiceRates) => {
    const rawValue = rawValues[key as string] || '';
    const numericVal = validateAndParseNumber(rawValue);
    setFormData({
      ...formData,
      [key]: numericVal,
    });
  };

  const handleSubmit = async (data: Partial<InvoiceRates>) => {
    if (mode === 'add') {
      console.log('Adding Invoice Rate: ', data);
      const response = await addInvoiceRateMutation.mutateAsync(data as Partial<InvoiceRates>);
      onClose();
      console.log('Add Invoice Rate Response: ', response);
      return response;
    } else if (mode === 'edit') {
      console.log('Editing Invoice Rate: ', data);
      const response = await editInvoiceRateMutation.mutateAsync({
        id: formData.id!,
        updatedRate: data,
      });
      onClose();
      console.log('Edit Invoice Rate Response: ', response);
      return response;
    } else {
      // edit invoice rate
    }
  };

  return (
    <div className="edit-file-doc-modal">
      <div className="edit-file-doc-modal-content">
        <div className="edit-file-doc-modal-header">
          <p>{mode === 'add' ? `Add New Invoice Rate` : `Edit Invoice Rate`}</p>
        </div>
        <form>
          <div className="edit-file-doc-modal-body">
            <div className="file-doc-modal-row file-doc-modal-name">
              <label htmlFor="file-doc-name">Preset Name:</label>
              <input
                type="text"
                id="file-doc-name"
                name="file-doc-name"
                value={formData.rate_preset_name || ''}
                onChange={(e) => setFormData({ ...formData, rate_preset_name: e.target.value })}
              />
            </div>
            <div className="file-doc-modal-row file-doc-modal-description">
              <label htmlFor="file-doc-description">Description:</label>
              <textarea
                id="file-doc-description"
                name="file-doc-description"
                value={formData.rate_preset_description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, rate_preset_description: e.target.value })
                }
              />
            </div>
            <div className="file-doc-modal-row file-doc-modal-invoice-rate-currency">
              <label>Currency:</label>
              <select
                value={formData.rate_preset_currency || ''}
                onChange={(e) => setFormData({ ...formData, rate_preset_currency: e.target.value })}
              >
                <option value="">Select Currency</option>
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AUD">AUD</option>
                <option value="NZD">NZD</option>
              </select>
            </div>
            <div className="file-doc-modal-invoice-rates">
              {/* Survey Rate */}
              <div className="file-doc-modal-invoice-rates-row">
                <label htmlFor="file-doc-survey-hourly-rate">Survey Rate:</label>
                <input
                  type="text"
                  name="file-doc-survey-hourly-rate"
                  value={rawValues.survey_hourly_rate}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => handleRawChange('survey_hourly_rate', e.target.value)}
                  onBlur={() => handleNumericBlur('survey_hourly_rate')}
                />
              </div>

              {/* Report Rate */}
              <div className="file-doc-modal-invoice-rates-row">
                <label htmlFor="file-doc-report-hourly-rate">Report Rate:</label>
                <input
                  type="text"
                  name="file-doc-report-hourly-rate"
                  value={rawValues.report_hourly_rate}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => handleRawChange('report_hourly_rate', e.target.value)}
                  onBlur={() => handleNumericBlur('report_hourly_rate')}
                />
              </div>

              {/* Admin Rate */}
              <div className="file-doc-modal-invoice-rates-row">
                <label htmlFor="file-doc-admin-hourly-rate">Admin Rate:</label>
                <input
                  type="text"
                  name="file-doc-admin-hourly-rate"
                  value={rawValues.admin_hourly_rate}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => handleRawChange('admin_hourly_rate', e.target.value)}
                  onBlur={() => handleNumericBlur('admin_hourly_rate')}
                />
              </div>

              {/* Travel Rate */}
              <div className="file-doc-modal-invoice-rates-row">
                <label htmlFor="file-doc-travel-hourly-rate">Travel Rate:</label>
                <input
                  type="text"
                  name="file-doc-travel-hourly-rate"
                  value={rawValues.travel_hourly_rate}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => handleRawChange('travel_hourly_rate', e.target.value)}
                  onBlur={() => handleNumericBlur('travel_hourly_rate')}
                />
              </div>

              {/* Km Rate */}
              <div className="file-doc-modal-invoice-rates-row">
                <label htmlFor="file-doc-travel-km-rate">Km Rate:</label>
                <input
                  type="text"
                  name="file-doc-travel-km-rate"
                  value={rawValues.travel_km_rate}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => handleRawChange('travel_km_rate', e.target.value)}
                  onBlur={() => handleNumericBlur('travel_km_rate')}
                />
              </div>
            </div>
          </div>
          <div className="file-doc-modal-actions">
            <button
              type="submit"
              className="file-doc-modal-save"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(formData);
              }}
            >
              SAVE
            </button>
            <button type="button" className="file-doc-modal-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvoiceRateModal;
