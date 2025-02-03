import React, { useCallback, useState, useEffect } from 'react';
import { FileRecord, FeeRecord, Company, Contact } from '../types';
import { useUpdateFile, useUpdateFee } from '../hooks/UseMutations';
import { useData } from '../hooks/UseData';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import FeeInvoicePrint from './FeeInvoicePrint';

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'ZAR', label: 'ZAR' },
];

interface FeeInvoiceProps {
  fileDetails: FileRecord;
  feeDetails: FeeRecord;
  onClose: () => void;
  onFileUpdated: () => void;
  companies: Company[];
  contacts: Contact[];
}

const FeeInvoice: React.FC<FeeInvoiceProps> = ({
  fileDetails,
  feeDetails: initialFeeDetails,
  onClose,
  onFileUpdated,
}) => {
  const { rates, ratesLoading, ratesError } = useData();
  const [feeDetails, setFeeDetails] = useState<FeeRecord>(initialFeeDetails);

  const [manualTotalFeeInput, setManualTotalFeeInput] = useState<string>(
    initialFeeDetails.total_fee?.toString() || '0'
  );
  const [isValidTotalFee, setIsValidTotalFee] = useState<boolean>(true);

  const updateFileMutation = useUpdateFile();
  const updateFeeMutation = useUpdateFee();

  const handleUpdate = async () => {
    // Basic Validation
    if (!feeDetails.total_fee || !fileDetails.principal_id) {
      showErrorToast('Please fill in all required fields.');
      return;
    }

    const updatedFile = { ...fileDetails };
    const updatedFee = { ...feeDetails };

    try {
      await updateFileMutation.mutateAsync({
        id: updatedFile.id!,
        updatedFile,
      });
      console.log(`FeeInvoice updates with File Data: `, updatedFile);
      showSuccessToast('File updated successfully!');
      onFileUpdated();
    } catch (err) {
      console.error('Update File Error:', err);
      showErrorToast('Failed to update file. Please try again.');
      return;
    }

    try {
      await updateFeeMutation.mutateAsync({
        id: updatedFee.id!,
        updatedFee,
      });
      console.log(`FeeInvoice updates with Fee Data:`, updatedFee);
      showSuccessToast('Fee updated successfully!');
      onFileUpdated();
    } catch (err) {
      console.error('Update Fee Error:', err);
      showErrorToast('Failed to update fee. Please try again.');
    }
  };

  const handleFeeChange = useCallback(
    (key: keyof FeeRecord, value: string | number | boolean) => {
      setFeeDetails((prev) => {
        const updated: FeeRecord = { ...prev };

        if (key === 'invoice_currency') {
          updated.invoice_currency = value as string;
        }

        // Handle cuts
        if (key === 'aps_cut') {
          const numericValue = typeof value === 'string' ? parseFloat(value) : (value as number);
          updated.aps_cut = isNaN(numericValue) ? 0 : numericValue;
        }
        if (
          key === 'mannie_cut' ||
          key === 'elize_cut' ||
          key === 'willie_cut' ||
          key === 'other_cut'
        ) {
          const numericValue = typeof value === 'string' ? parseFloat(value) : (value as number);
          updated[key] = isNaN(numericValue) ? 0 : numericValue;

          const calculatedApsCut =
            Number(updated.total_fee) -
            Number(updated.mannie_cut) -
            Number(updated.elize_cut) -
            Number(updated.willie_cut) -
            Number(updated.other_cut);
          updated.aps_cut = calculatedApsCut >= 0 ? calculatedApsCut : 0;
        }

        if (
          key === 'handling_time' ||
          key === 'survey_time' ||
          key === 'travel_time' ||
          key === 'travel_km' ||
          key === 'sundries_amount'
        ) {
          const numericValue = typeof value === 'string' ? parseFloat(value) : (value as number);
          updated[key] = isNaN(numericValue) ? 0 : numericValue;
        }

        // Handle manualTotalFeeInput
        if (key === 'total_fee') {
          const numericValue = parseFloat(value as string);
          updated.total_fee = isNaN(numericValue) ? 0 : numericValue;

          const calculatedApsCut =
            Number(updated.total_fee) -
            Number(updated.mannie_cut) -
            Number(updated.elize_cut) -
            Number(updated.willie_cut) -
            Number(updated.other_cut);
          updated.aps_cut = calculatedApsCut >= 0 ? calculatedApsCut : 0;
        }

        // Handle is_manual_total_fee
        if (key === 'is_manual_total_fee') {
          updated.is_manual_total_fee = value as boolean;
        }

        // Recalculate total if not manual
        if (!updated.is_manual_total_fee) {
          const handlingCalc = updated.handling_time * rates.adminHourlyRate;
          const surveyCalc = Number(updated.survey_time) * rates.surveyHourlyRate;
          const travelCalc = Number(updated.travel_time) * rates.travelHourlyRate;
          const travelKmCalc = Number(updated.travel_km) * rates.travelKmRate;
          const sundriesCalc = Number(updated.sundries_amount);
          updated.total_fee = handlingCalc + surveyCalc + travelCalc + travelKmCalc + sundriesCalc;
        }

        return updated;
      });

      if (key === 'total_fee') {
        const inputValue = typeof value === 'string' ? value : value.toString();
        setManualTotalFeeInput(inputValue);

        // Validate the input
        const regex = /^\d*\.?\d*$/;
        if (regex.test(inputValue)) {
          setIsValidTotalFee(true);
        } else {
          setIsValidTotalFee(false);
        }
      }
    },
    [rates.adminHourlyRate, rates.surveyHourlyRate, rates.travelHourlyRate, rates.travelKmRate]
  );

  useEffect(() => {
    if (!feeDetails.is_manual_total_fee) {
      setManualTotalFeeInput(feeDetails.total_fee?.toString() || '0');
    }
  }, [feeDetails.is_manual_total_fee, feeDetails.total_fee]);

  // Handle loading and error states for rates
  if (ratesLoading) {
    return <div>Loading rates...</div>;
  }

  if (ratesError) {
    return <div>Error loading rates: {ratesError.message}</div>;
  }

  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const mm = monthNames[today.getMonth()];
    const yyyy = today.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  };

  const handleExport = () => {
    feeDetails.inv_date = getTodayDate();
    window.electronAPI
      .generateInvoicePdf({ fileDetails, feeDetails })
      .then((pdfPath: string) => {
        showSuccessToast('Invoice exported successfully');
        console.log('PDF generated at:', pdfPath);
      })
      .catch((error: string) => {
        showErrorToast('Error exporting invoice');
        console.error(error);
      });
  };

  const handleUpdateAndExport = async () => {
    await handleUpdate();
    handleExport();
  };

  return (
    <div className="modal invoiceDisplayContainer" role="dialog" aria-modal="true">
      <div className="invoice-actions">
        <div className="invoiceEditingHeader">
          <h2>Fee Invoice Editor</h2>
          <span
            className="close-modal-button"
            onClick={onClose}
            role="button"
            aria-label="Close Modal"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onClose();
            }}
          >
            &times;
          </span>
        </div>
        <div className="invoiceEditingContainer">
          <div className="invoiceActionCurrencyContainer">
            <label htmlFor="currency">Currency</label>
            <select
              name="currency"
              value={feeDetails.invoice_currency || 'ZAR'}
              onChange={(e) => handleFeeChange('invoice_currency', e.target.value)}
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="invoiceActionEditingFields">
            <div className="invoiceQuantityContainer">
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionApsCut">APS Cut</label>
                <input
                  type="number"
                  name="invoiceActionApsCut"
                  value={feeDetails.aps_cut ?? 0}
                  disabled
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionMannieCut">Mannie Cut</label>
                <input
                  type="number"
                  name="invoiceActionMannieCut"
                  value={feeDetails.mannie_cut ?? 0}
                  onChange={(e) => handleFeeChange('mannie_cut', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionElizeCut">Elize Cut</label>
                <input
                  type="number"
                  name="invoiceActionElizeCut"
                  value={feeDetails.elize_cut ?? 0}
                  onChange={(e) => handleFeeChange('elize_cut', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionWillieCut">Willie Cut</label>
                <input
                  type="number"
                  name="invoiceActionWillieCut"
                  value={feeDetails.willie_cut ?? 0}
                  onChange={(e) => handleFeeChange('willie_cut', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionOtherCut">Other Cut</label>
                <input
                  type="number"
                  name="invoiceActionOtherCut"
                  value={feeDetails.other_cut ?? 0}
                  onChange={(e) => handleFeeChange('other_cut', e.target.value)}
                />
              </div>
            </div>
            <div className="invoiceQuantityContainer">
              <div className="invoiceActionQuantityRow">
                <label htmlFor="handlingTime">Handling Time</label>
                <input
                  type="number"
                  name="handlingTime"
                  step={0.1}
                  value={feeDetails.handling_time ?? 0}
                  onChange={(e) => handleFeeChange('handling_time', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="surveyTime">Survey Time</label>
                <input
                  type="number"
                  name="surveyTime"
                  value={feeDetails.survey_time ?? 0}
                  onChange={(e) => handleFeeChange('survey_time', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="travelTime">Travel Time</label>
                <input
                  type="number"
                  name="travelTime"
                  value={feeDetails.travel_time ?? 0}
                  onChange={(e) => handleFeeChange('travel_time', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="travelKm">Travel Km</label>
                <input
                  type="number"
                  name="travelKm"
                  value={feeDetails.travel_km ?? 0}
                  onChange={(e) => handleFeeChange('travel_km', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="sunDries">Sundries</label>
                <input
                  type="number"
                  name="sunDries"
                  value={feeDetails.sundries_amount ?? 0}
                  onChange={(e) => handleFeeChange('sundries_amount', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="invoiceActionTotalFeeContainer">
            <div className="invoiceActionTotalFeeRow">
              <label htmlFor="manualTotalFee">Set Total Fee</label>
              <input
                className="manualTotalFeeCheckbox"
                type="checkbox"
                name="manualTotalFee"
                checked={feeDetails.is_manual_total_fee ?? false}
                onChange={(e) => handleFeeChange('is_manual_total_fee', e.target.checked)}
              />
            </div>
            <input
              className="manualTotalFeeInput"
              type="text"
              inputMode="decimal"
              name="totalFee"
              value={manualTotalFeeInput}
              onChange={(e) => {
                const value = e.target.value;

                // Allow only numbers and a single decimal point
                const regex = /^\d*\.?\d*$/;
                if (regex.test(value)) {
                  handleFeeChange('total_fee', value);
                  setIsValidTotalFee(true);
                } else {
                  setIsValidTotalFee(false);
                }
              }}
              disabled={!feeDetails.is_manual_total_fee}
              style={{
                borderColor: isValidTotalFee ? 'initial' : 'red',
              }}
            />
            {!isValidTotalFee && (
              <span className="error-message">Please enter a valid number.</span>
            )}
          </div>
        </div>
        <div className="invoiceEditingFooter">
          <button onClick={handleUpdate}>Update Changes</button>
          <button onClick={handleUpdateAndExport}>Export as PDF</button>
        </div>
      </div>
      <FeeInvoicePrint fileDetails={fileDetails} feeDetails={feeDetails} />
    </div>
  );
};

export default FeeInvoice;
