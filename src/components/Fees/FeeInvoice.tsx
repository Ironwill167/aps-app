import React, { useCallback, useState, useEffect } from 'react';
import { FileRecord, FeeRecord, Company, Contact, InvoiceRates } from '../types';
import { useUpdateFile, useUpdateFee } from '../hooks/UseMutations';
import { useData } from '../hooks/UseData';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import FeeInvoicePrint from './FeeInvoicePrint';
import { validateAndParseNumber, handleNumberInputKeyDown } from '../utils/NumberUtils';
import RatePresetSelect from '../Shared/RatePresetSelect';

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
  const { invoice_rates } = useData();
  const [feeDetails, setFeeDetails] = useState<FeeRecord>(initialFeeDetails);

  const [currentRatePreset, setCurrentRatePreset] = useState<InvoiceRates>();
  useEffect(() => {
    if (invoice_rates.length > 0) {
      const ratePreset = invoice_rates.find((rate) => rate.id === feeDetails.invoice_rate_preset);
      setCurrentRatePreset(ratePreset);
    }
  }, [invoice_rates, feeDetails.invoice_rate_preset]);

  const [manualTotalFeeInput, setManualTotalFeeInput] = useState<string>(
    initialFeeDetails.total_fee?.toString() || '0'
  );
  const [isValidTotalFee, setIsValidTotalFee] = useState<boolean>(true);

  const [surveyTimeInput, setSurveyTimeInput] = useState<string>(
    initialFeeDetails.survey_time?.toString() || '0'
  );

  const [reportTimeInput, setReportTimeInput] = useState<string>(
    initialFeeDetails.report_time?.toString() || '0'
  );

  const [handlingTimeInput, setHandlingTimeInput] = useState<string>(
    initialFeeDetails.handling_time?.toString() || '0'
  );

  const [travelTimeInput, setTravelTimeInput] = useState<string>(
    initialFeeDetails.travel_time?.toString() || '0'
  );

  const [travelKmInput, setTravelKmInput] = useState<string>(
    initialFeeDetails.travel_km?.toString() || '0'
  );

  const [sundriesInput, setSundriesInput] = useState<string>(
    initialFeeDetails.sundries_amount?.toString() || '0'
  );

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

        if (key === 'invoice_rate_preset') {
          updated.invoice_rate_preset = value as number;
        }

        if (key === 'sundries_description') {
          updated.sundries_description = value as string;
        }

        if (key === 'total_description') {
          updated.total_description = value as string;
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
          key === 'report_time' ||
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
          const handlingCalc =
            (Number(updated.handling_time) || 0) * (currentRatePreset?.admin_hourly_rate || 0);
          const surveyCalc =
            (Number(updated.survey_time) || 0) * (currentRatePreset?.survey_hourly_rate || 0);
          const reportCalc =
            (Number(updated.report_time) || 0) * (currentRatePreset?.report_hourly_rate || 0);
          const travelCalc =
            (Number(updated.travel_time) || 0) * (currentRatePreset?.travel_hourly_rate || 0);
          const travelKmCalc =
            (Number(updated.travel_km) || 0) * (currentRatePreset?.travel_km_rate || 0);
          const sundriesCalc = Number(updated.sundries_amount) || 0;
          const total =
            handlingCalc + surveyCalc + reportCalc + travelCalc + travelKmCalc + sundriesCalc;
          updated.total_fee = parseFloat(total.toFixed(2));
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
    [currentRatePreset]
  );

  useEffect(() => {
    if (!feeDetails.is_manual_total_fee) {
      setManualTotalFeeInput(feeDetails.total_fee?.toString() || '0');
    }
  }, [feeDetails.is_manual_total_fee, feeDetails.total_fee]);

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
            <RatePresetSelect
              value={feeDetails.invoice_rate_preset}
              selectClassName="currencySelectFeeInvoice"
              onChange={(value) => handleFeeChange('invoice_rate_preset', value)}
              options={invoice_rates}
            />
          </div>
          <div className="invoiceActionEditingFields">
            <div className="invoiceQuantityContainer">
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionApsCut">APS</label>
                <input
                  type="number"
                  name="invoiceActionApsCut"
                  value={feeDetails.aps_cut ?? 0}
                  disabled
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionMannieCut">Mannie</label>
                <input
                  type="number"
                  name="invoiceActionMannieCut"
                  value={feeDetails.mannie_cut ?? 0}
                  onChange={(e) => handleFeeChange('mannie_cut', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionElizeCut">Elize</label>
                <input
                  type="number"
                  name="invoiceActionElizeCut"
                  value={feeDetails.elize_cut ?? 0}
                  onChange={(e) => handleFeeChange('elize_cut', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionWillieCut">Willie</label>
                <input
                  type="number"
                  name="invoiceActionWillieCut"
                  value={feeDetails.willie_cut ?? 0}
                  onChange={(e) => handleFeeChange('willie_cut', e.target.value)}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="invoiceActionOtherCut">Other</label>
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
                  type="text"
                  name="handlingTime"
                  inputMode="decimal"
                  value={handlingTimeInput}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHandlingTimeInput(value);
                    handleFeeChange('handling_time', validateAndParseNumber(value));
                  }}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="surveyTime">Survey Time</label>
                <input
                  type="text"
                  name="surveyTime"
                  inputMode="decimal"
                  value={surveyTimeInput}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSurveyTimeInput(value);
                    handleFeeChange('survey_time', validateAndParseNumber(value));
                  }}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="reportTime">Report Time</label>
                <input
                  type="text"
                  name="reportTime"
                  inputMode="decimal"
                  value={reportTimeInput}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReportTimeInput(value);
                    handleFeeChange('report_time', validateAndParseNumber(value));
                  }}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="travelTime">Travel Time</label>
                <input
                  type="text"
                  name="travelTime"
                  inputMode="decimal"
                  value={travelTimeInput}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTravelTimeInput(value);
                    handleFeeChange('travel_time', validateAndParseNumber(value));
                  }}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="travelKm">Travel Km</label>
                <input
                  type="text"
                  name="travelKm"
                  inputMode="decimal"
                  value={travelKmInput}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTravelKmInput(value);
                    handleFeeChange('travel_km', validateAndParseNumber(value));
                  }}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <label htmlFor="sunDries">Sundries</label>
                <input
                  type="text"
                  name="sunDries"
                  inputMode="decimal"
                  value={sundriesInput}
                  onKeyDown={handleNumberInputKeyDown}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSundriesInput(value);
                    handleFeeChange('sundries_amount', validateAndParseNumber(value));
                  }}
                />
              </div>
              <div className="invoiceActionQuantityRow">
                <textarea
                  name="sunDriesDescription"
                  value={feeDetails.sundries_description || ''}
                  placeholder="Sundries Description"
                  onChange={(e) => handleFeeChange('sundries_description', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="invoiceActionTotalFooter">
            <div className="invoiceActionTotalFeeDescription">
              <label htmlFor="minimumFee">Total Description:</label>
              <input
                type="text"
                name="minimumFee"
                value={feeDetails.total_description || ''}
                onChange={(e) => handleFeeChange('total_description', e.target.value)}
              />
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
