import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import Select from 'react-select';
import { FileRecord, Company, Contact, FeeRecord } from '../types';
import { useUpdateFile, useUpdateFee } from '../hooks/UseMutations';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const AddContactModal = lazy(() => import('../Modals/AddContactModal'));
const FeeInvoice = lazy(() => import('./FeeInvoice'));

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'ZAR', label: 'ZAR' },
];

interface EditFeeModalProps {
  file: FileRecord;
  fee: FeeRecord;
  onClose: () => void;
  onFileUpdated: () => void;
  companies: Company[];
  contacts: Contact[];
}

const EditFeeModal: React.FC<EditFeeModalProps> = ({
  file,
  fee,
  onClose,
  onFileUpdated,
  companies,
  contacts,
}) => {
  const [fileData, setFileData] = useState<Partial<FileRecord>>({ ...file });
  const [feeData, setFeeData] = useState<Partial<FeeRecord>>({ ...fee });

  const [isManualTotalFee, setIsManualTotalFee] = useState<boolean>(false);

  const [currentField, setCurrentField] = useState<string | null>(null);

  const [surveyHourlyRate, setSurveyHourlyRate] = useState<number>(780);
  const [adminHourlyRate, setAdminHourlyRate] = useState<number>(390);
  const [travelHourlyRate, setTravelHourlyRate] = useState<number>(390);
  const [travelDistanceRate, setTravelDistanceRate] = useState<number>(4.75);
  const [sundriesRate, setSundriesRate] = useState<number>(0);

  const [selectedCurrency, setSelectedCurrency] = useState<string>('ZAR');

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showFeeInvoice, setShowFeeInvoice] = useState(false);

  const updateFileMutation = useUpdateFile();
  const updateFeeMutation = useUpdateFee();

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const openAddContactModal = (field: string) => {
    setCurrentField(field);
    setShowAddContactModal(true);
  };

  const handleContactAddedLocal = useCallback(
    (contact: Contact) => {
      setFileData((prev) => ({ ...prev, [currentField!]: contact.id }));
      setCurrentField(null);
    },
    [currentField]
  );

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  const contactOptionsForCompany = (id: number | null) => {
    if (id === null) return [];
    return contacts
      .filter((contact) => contact.company_id === id)
      .map((contact) => ({
        value: contact.id,
        label: `${contact.name} ${contact.surname ? contact.surname : ''}`,
      }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  };
  const handleSelectChange = (name: string, selectedOption: { value: number | null; label: string } | null) => {
    setFileData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null,
    }));
  };

  // Function to distribute cuts based on total_fee
  const distributeCuts = useCallback(
    (newTotalFee: number) => {
      const { aps_cut, mannie_cut, elize_cut, willie_cut, other_cut } = feeData;
      const sumCuts =
        (aps_cut || 0) +
        (mannie_cut || 0) +
        (elize_cut || 0) +
        (willie_cut || 0) +
        (other_cut || 0);

      if (sumCuts === 0) {
        // If all cuts are zero, set to default

        setFeeData({
          ...feeData,
          aps_cut: newTotalFee - 1500,
          mannie_cut: 500,
          elize_cut: 500,
          willie_cut: 500,
          other_cut: 0,
          total_fee: newTotalFee,
        });
        return;
      }

      const scale = newTotalFee / sumCuts;
      setFeeData({
        ...feeData,
        aps_cut: parseFloat(((aps_cut || 0) * scale).toFixed(2)),
        mannie_cut: parseFloat(((mannie_cut || 0) * scale).toFixed(2)),
        elize_cut: parseFloat(((elize_cut || 0) * scale).toFixed(2)),
        willie_cut: parseFloat(((willie_cut || 0) * scale).toFixed(2)),
        other_cut: parseFloat(((other_cut || 0) * scale).toFixed(2)),
        total_fee: newTotalFee,
      });
    },
    [feeData]
  );

  // Calculate APS Fee
  const apsFeeCalculation = useCallback(() => {
    const totHandling = feeData.handling_time ? Number(feeData.handling_time) * adminHourlyRate : 0;
    const totTravel = feeData.travel_time ? Number(feeData.travel_time) * travelHourlyRate : 0;
    const totTravelDistance = feeData.travel_km
      ? Number(feeData.travel_km) * travelDistanceRate
      : 0;
    const totSurvey =
      feeData.survey_time !== undefined && feeData.report_time !== undefined
        ? (Number(feeData.survey_time) + Number(feeData.report_time)) * surveyHourlyRate
        : 0;
    const totSundries = sundriesRate;
    const apsFee = totHandling + totTravel + totTravelDistance + totSurvey + totSundries;
    return parseFloat(apsFee.toFixed(2));
  }, [
    feeData.handling_time,
    feeData.travel_time,
    feeData.travel_km,
    feeData.survey_time,
    feeData.report_time,
    surveyHourlyRate,
    adminHourlyRate,
    travelHourlyRate,
    travelDistanceRate,
    sundriesRate,
  ]);

  // useEffect to recalculate total_fee when dependent fields change
  useEffect(() => {
    if (!isManualTotalFee) {
      // Only run automatic distribution if cuts are not set
      const hasCuts =
        !!feeData.aps_cut ||
        !!feeData.mannie_cut ||
        !!feeData.elize_cut ||
        !!feeData.willie_cut ||
        !!feeData.other_cut;
      if (!hasCuts) {
        const calculatedTotalFee = apsFeeCalculation();
        distributeCuts(calculatedTotalFee);
      }
    }
  }, [
    feeData.handling_time,
    feeData.travel_time,
    feeData.travel_km,
    feeData.survey_time,
    feeData.report_time,
    feeData.aps_cut,
    feeData.mannie_cut,
    feeData.elize_cut,
    feeData.willie_cut,
    feeData.other_cut,
    distributeCuts,
    apsFeeCalculation,
    isManualTotalFee,
  ]);

  // Handle manual change of total_fee
  const handleTotalFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotalFee = Number(e.target.value);
    setFeeData((prev) => ({ ...prev, total_fee: newTotalFee }));
    setIsManualTotalFee(true);
    distributeCuts(newTotalFee);
  };

  // Reset manual flag when cuts are manually changed
  useEffect(() => {
    // If any cut is manually changed, recalculate total_fee
    const { aps_cut, mannie_cut, elize_cut, willie_cut, other_cut } = feeData;
    if (isManualTotalFee) {
      const sumCuts =
        (aps_cut || 0) +
        (mannie_cut || 0) +
        (elize_cut || 0) +
        (willie_cut || 0) +
        (other_cut || 0);
      setFeeData((prev) => ({ ...prev, total_fee: sumCuts }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    feeData.aps_cut,
    feeData.mannie_cut,
    feeData.elize_cut,
    feeData.willie_cut,
    feeData.other_cut,
  ]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!feeData.total_fee || !fileData.principal_id) {
      showErrorToast('Please fill in all required fields.');
      return;
    }

    try {
      await updateFileMutation.mutateAsync({
        id: fileData.id!,
        updatedFile: fileData,
      });
      console.log(`EditFeeModal updates with File Data: ${fileData}`);
      showSuccessToast('File updated successfully!');
      onFileUpdated();
      onClose();
    } catch (err) {
      console.error('Update File Error:', err);
      showErrorToast('Failed to update file. Please try again.');
      return;
    }

    try {
      await updateFeeMutation.mutateAsync({
        id: feeData.id!,
        updatedFee: feeData,
      });
      console.log(`EditFeeModal updates with Fee Data: ${feeData}`);
      showSuccessToast('Fee updated successfully!');
      onFileUpdated();
      onClose();
    } catch (err) {
      console.error('Update Fee Error:', err);
      showErrorToast('Failed to update fee. Please try again.');
    }
  };

  return (
    <>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-file-modal-title"
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <p id="view-file-modal-title">Edit Fee</p>
            <div className="file-number-container">
              <p id="fileNumber">{`File No ${fileData.id}`}</p>
            </div>
            <span
              className="close-modal-button"
              onClick={onClose}
              role="button"
              aria-label="Close Modal"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onClose();
                }
              }}
            >
              &times;
            </span>
          </div>

          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              {/* Company */}
              <div className="modal-row">
                <div className="modal-form-group">
                  <label htmlFor="company_id">Principal</label>
                  <Select
                    id="insured_id"
                    className="reactSelect"
                    options={companyOptions}
                    onChange={(option) => handleSelectChange('principal_id', option as { value: number | null; label: string } | null)}
                    placeholder="Select a company..."
                    isSearchable
                    value={
                      companyOptions.find((option) => option.value === fileData.principal_id) || 1
                    }
                    required
                  />
                </div>

                {/* Company Contact */}
                <div className="modal-form-group">
                  <label htmlFor="principal_contact_id">Company Contact</label>

                  <Select
                    id="principal_contact_id"
                    className="reactSelect"
                    options={contactOptionsForCompany(fileData.principal_id ?? null)}
                    onChange={(option) => handleSelectChange('principal_contact_id', option)}
                    placeholder="Select a contact..."
                    isSearchable
                    value={
                      fileData.principal_contact_id
                        ? contactOptionsForCompany(fileData.principal_id ?? null).find(
                            (option) => option.value === fileData.principal_contact_id
                          ) || null
                        : null
                    }
                  />
                  <button
                    type="button"
                    className="add-company-button"
                    onClick={() => openAddContactModal('principal_contact_id')}
                    aria-label="Add Contact"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="modal-row">
                <div className="modal-form-group">
                  <label htmlFor="survey_hourly_rate">Survey Hourly Rate</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    step="0.01"
                    value={surveyHourlyRate}
                    onChange={(e) => setSurveyHourlyRate(Number(e.target.value))}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="admin_hourly_rate">Admin Hourly Rate</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    step="0.01"
                    value={adminHourlyRate}
                    onChange={(e) => setAdminHourlyRate(Number(e.target.value))}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="travel_hourly_rate">Travel Hourly Rate</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    step="0.01"
                    value={travelHourlyRate}
                    onChange={(e) => setTravelHourlyRate(Number(e.target.value))}
                  />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="travel_distance_rate">Travel Distance Rate</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    step="0.01"
                    value={travelDistanceRate}
                    onChange={(e) => setTravelDistanceRate(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="modal-row">
                {/* Handling Time */}
                <div className="modal-form-group">
                  <label htmlFor="handling_time">Handling Time</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.handling_time}
                    onChange={(e) =>
                      setFeeData({ ...feeData, handling_time: Number(e.target.value) })
                    }
                  />
                </div>

                {/* Travel Time */}
                <div className="modal-form-group">
                  <label htmlFor="travel_time">Travel Time</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.travel_time}
                    onChange={(e) =>
                      setFeeData({ ...feeData, travel_time: Number(e.target.value) })
                    }
                  />
                </div>

                {/* Travel KM */}
                <div className="modal-form-group">
                  <label htmlFor="travel_km">Travel KM</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.travel_km}
                    onChange={(e) => setFeeData({ ...feeData, travel_km: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="modal-row">
                {/* Sundries */}
                <div className="modal-form-group">
                  <label htmlFor="sundries_rate">Sundries</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={sundriesRate}
                    onChange={(e) => setSundriesRate(Number(e.target.value))}
                  />
                </div>
                {/* Survey Time */}
                <div className="modal-form-group">
                  <label htmlFor="survey_time">Survey Time</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    value={feeData.survey_time}
                    onChange={(e) =>
                      setFeeData({ ...feeData, survey_time: Number(e.target.value) })
                    }
                  />
                </div>

                {/* Report Time */}
                <div className="modal-form-group">
                  <label htmlFor="report_time">Report Time</label>
                  <input
                    className="inputSmall"
                    type="number"
                    min="0"
                    value={feeData.report_time}
                    onChange={(e) =>
                      setFeeData({ ...feeData, report_time: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="modal-row">
                {/* Currency */}
                <div className="modal-form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    name="currency"
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    style={{ width: '20%' }}
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* APS Cut */}
                <div className="modal-form-group">
                  <label htmlFor="aps_cut">APS Fee</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.aps_cut}
                    onChange={(e) => setFeeData({ ...feeData, aps_cut: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="modal-row">
                {/* Mannie Cut */}
                <div className="modal-form-group">
                  <label htmlFor="mannie_cut">Mannie</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.mannie_cut}
                    onChange={(e) => setFeeData({ ...feeData, mannie_cut: Number(e.target.value) })}
                  />
                </div>
                {/* Elize Cut */}
                <div className="modal-form-group">
                  <label htmlFor="elize_cut">Elize</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.elize_cut}
                    onChange={(e) => setFeeData({ ...feeData, elize_cut: Number(e.target.value) })}
                  />
                </div>
                {/* Willie Cut */}
                <div className="modal-form-group">
                  <label htmlFor="willie_cut">Willie</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.willie_cut}
                    onChange={(e) => setFeeData({ ...feeData, willie_cut: Number(e.target.value) })}
                  />
                </div>
                {/* Other Cut */}
                <div className="modal-form-group">
                  <label htmlFor="other_cut">Other</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.other_cut}
                    onChange={(e) => setFeeData({ ...feeData, other_cut: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="modal-row">
                {/* Fee Raised */}
                <div className="modal-form-group">
                  <label htmlFor="fee_raised">Fee Raised</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.fee_raised}
                    onChange={(e) => setFeeData({ ...feeData, fee_raised: Number(e.target.value) })}
                  />
                </div>
                {/* Fee Paid */}
                <div className="modal-form-group">
                  <label htmlFor="fee_paid">Fee Paid</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0"
                    step="0.01"
                    value={feeData.fee_paid}
                    onChange={(e) => setFeeData({ ...feeData, fee_paid: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="modal-row">
                {/* Total Fee */}
                <div className="modal-form-group">
                  <label htmlFor="total_fee">Total</label>
                  <input
                    className="inputMedium"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={feeData.total_fee}
                    onChange={handleTotalFeeChange}
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeeInvoice(true);
                  }}
                  className="editFeeGenerateInvoice"
                >
                  Generate Invoice
                </button>
                <button type="submit" className="modal-submit">
                  Save Changes
                </button>
                <button type="button" onClick={onClose} className="modal-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Fee Invoice */}
      {showFeeInvoice && (
        <Suspense fallback={<div>Loading...</div>}>
          <FeeInvoice
            fileDetails={fileData as FileRecord}
            feeDetails={feeData as FeeRecord}
            onClose={() => setShowFeeInvoice(false)}
            onFileUpdated={() => {}}
            companies={companies}
            contacts={contacts}
          />
        </Suspense>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <AddContactModal
            onClose={() => setShowAddContactModal(false)}
            companies={companies}
            onContactAdded={handleContactAddedLocal}
          />
        </Suspense>
      )}
    </>
  );
};

export default EditFeeModal;
