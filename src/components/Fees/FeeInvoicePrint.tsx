import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { FileRecord, FeeRecord, Company } from '../types';
import { useData } from '../hooks/UseData';
import logo from '../../assets/logotpbg.png';

interface FeeInvoicePrintProps {
  fileDetails: FileRecord;
  feeDetails: FeeRecord;
  onRenderComplete?: () => void;
}

const FeeInvoicePrint: React.FC<FeeInvoicePrintProps> = ({
  fileDetails,
  feeDetails,
  onRenderComplete,
}) => {
  const { companies, invoice_rates } = useData();

  const getCompany = useCallback(
    (companyId: number | null): Company | undefined => {
      if (companyId === null) return;
      const company = companies.find((comp) => comp.id === companyId);
      return company;
    },
    [companies]
  );

  const currentRatePreset = useMemo(
    () => invoice_rates.find((rate) => rate.id === feeDetails.invoice_rate_preset),
    [invoice_rates, feeDetails.invoice_rate_preset]
  );

  const rates = {
    surveyHourlyRate: currentRatePreset?.survey_hourly_rate,
    reportHourlyRate: currentRatePreset?.report_hourly_rate,
    adminHourlyRate: currentRatePreset?.admin_hourly_rate,
    travelHourlyRate: currentRatePreset?.travel_hourly_rate,
    travelKmRate: currentRatePreset?.travel_km_rate,
  };

  const principalCompany = getCompany(fileDetails.principal_id);
  const insuredCompany = getCompany(fileDetails.insured_id)?.name;

  const logoRef = useRef<HTMLImageElement>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  useEffect(() => {
    if (principalCompany && insuredCompany && (currentRatePreset?.admin_hourly_rate || 0) > 0) {
      setDataLoaded(true);
    }
  }, [principalCompany, insuredCompany, currentRatePreset]);

  useEffect(() => {
    if (onRenderComplete) {
      const handleImageLoad = () => {
        setImagesLoaded(true);
      };

      const imgElement = logoRef.current;

      if (imgElement) {
        if (imgElement.complete) {
          handleImageLoad();
        } else {
          imgElement.addEventListener('load', handleImageLoad);
          imgElement.addEventListener('error', handleImageLoad); // Handle error to prevent hanging

          return () => {
            imgElement.removeEventListener('load', handleImageLoad);
            imgElement.removeEventListener('error', handleImageLoad);
          };
        }
      } else {
        handleImageLoad();
      }
    }
  }, [onRenderComplete]);

  useEffect(() => {
    if (dataLoaded && imagesLoaded && onRenderComplete) {
      onRenderComplete();
    }
  }, [dataLoaded, imagesLoaded, onRenderComplete]);

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

  const calcTimeXRate = (time: number, rate?: number) => {
    if (rate === undefined) return '0.00';
    return (time * rate).toFixed(2);
  };

  return (
    <div className="invoice-container" onClick={(e) => e.stopPropagation()}>
      <div className="invoice-inner-container">
        <div className="invoiceHeading">
          <h2>Fee Invoice</h2>
        </div>
        <div className="invoice-header">
          <div className="invoiceAPSDetailsContianer">
            <p className="invoicePBold">AgProSpec (Pty) Ltd.</p>
            <p>Plot 153, Vleikop AH</p>
            <p>Randfontein</p>
            <p>Gauteng Province</p>
            <p>South Africa</p>
            <p>1759</p>
            <p>Non V.A.T. Vendor</p>
          </div>

          <div className="invoiceLogoContainer">
            <img src={logo} alt="APS Logo" className="logo" />
          </div>
        </div>
        <div className="invoiceFileDetailsContainer">
          <div className="invoiceToDetailsContianer">
            <p className="invoicePBold">{principalCompany?.name}</p>
            {principalCompany?.streetaddress && <p>{principalCompany?.streetaddress}</p>}
            {principalCompany?.area && <p>{principalCompany?.area}</p>}
            {principalCompany?.town && <p>{principalCompany?.town}</p>}
            {principalCompany?.province && <p>{principalCompany?.province}</p>}
            {principalCompany?.vat_no && <p>VAT No: {principalCompany?.vat_no}</p>}
          </div>

          <div className="invoiceDateDetailsContianer">
            <div className="invoiceDateDetailsRow">
              <p className="invoicePBold invoiceDateDetailLabel">Date: </p>
              <p>{getTodayDate()}</p>
            </div>
            <div className="invoiceDateDetailsRow">
              <p className="invoicePBold invoiceDateDetailLabel">Invoice No: </p>
              <p>APS {fileDetails.id}</p>
            </div>
            <div className="invoiceDateDetailsRow">
              <p className="invoicePBold invoiceDateDetailLabel">Client: </p>
              <p className="invoiceDateDetailData">{insuredCompany}</p>
            </div>
            <div className="invoiceDateDetailsRow">
              <p className="invoicePBold invoiceDateDetailLabel">Currency: </p>
              <p>{currentRatePreset?.rate_preset_currency || 'ZAR'}</p>
            </div>
            <div className="invoiceDateDetailsRow">
              <p className="invoicePBold invoiceDateDetailLabel">Your Reference: </p>
              <p className="invoiceDateDetailData">{fileDetails.principal_ref}</p>
            </div>
          </div>
        </div>
        <div className="invoiceFeeChargesDetailsContainer">
          <div className="invoiceFeeChargesDetailsRow">
            <div className="invoiceFeeChargesDetailsDiscCell">
              <p className="invoicePBold">Description</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p className="invoicePBold">Quantity</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p className="invoicePBold">Rate</p>
            </div>
            <div className="invoiceFeeChargesDetailsAmountCell">
              <p className="invoicePBold">Amount</p>
            </div>
          </div>
          {/* Handling Time */}
          <div className="invoiceFeeChargesDetailsRow">
            <div className="invoiceFeeChargesDetailsDiscCell">
              <p>Handling Time</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{feeDetails.handling_time}</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{rates.adminHourlyRate}</p>
            </div>
            <div className="invoiceFeeChargesDetailsAmountCell">
              <p>{calcTimeXRate(feeDetails.handling_time, rates.adminHourlyRate)}</p>
            </div>
          </div>
          {/* Survey Time */}
          <div className="invoiceFeeChargesDetailsRow">
            <div className="invoiceFeeChargesDetailsDiscCell">
              <p>Survey and Investigation Time</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{feeDetails.survey_time}</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{rates.surveyHourlyRate}</p>
            </div>
            <div className="invoiceFeeChargesDetailsAmountCell">
              <p>{calcTimeXRate(feeDetails.survey_time, rates.surveyHourlyRate)}</p>
            </div>
          </div>
          {/* Report Time */}
          <div className="invoiceFeeChargesDetailsRow">
            <div className="invoiceFeeChargesDetailsDiscCell">
              <p>Report Time</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{feeDetails.report_time}</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{rates.reportHourlyRate}</p>
            </div>
            <div className="invoiceFeeChargesDetailsAmountCell">
              <p>{calcTimeXRate(feeDetails.report_time, rates.reportHourlyRate)}</p>
            </div>
          </div>
          {/* Travel Time */}
          <div className="invoiceFeeChargesDetailsRow">
            <div className="invoiceFeeChargesDetailsDiscCell">
              <p>Travel Time</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{feeDetails.travel_time}</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{rates.travelHourlyRate}</p>
            </div>
            <div className="invoiceFeeChargesDetailsAmountCell">
              <p>{calcTimeXRate(feeDetails.travel_time, rates.travelHourlyRate)}</p>
            </div>
          </div>
          <div className="invoiceFeeChargesDetailsRow">
            <div className="invoiceFeeChargesDetailsDiscCell">
              <p>Travel Distance</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{feeDetails.travel_km}</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{rates.travelKmRate}</p>
            </div>
            <div className="invoiceFeeChargesDetailsAmountCell">
              <p>{calcTimeXRate(feeDetails.travel_km, rates.travelKmRate)}</p>
            </div>
          </div>
          {/* Sundries */}
          <div className="invoiceFeeChargesDetailsRow">
            <div className="invoiceFeeChargesDetailsDiscCell">
              <p>Sundries</p>
              <p>{feeDetails.sundries_description ? feeDetails.sundries_description : ''}</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{feeDetails.sundries_amount}</p>
            </div>
            <div className="invoiceFeeChargesDetailsCell">
              <p>{feeDetails.sundries_amount ? feeDetails.sundries_amount : 0}</p>
            </div>
            <div className="invoiceFeeChargesDetailsAmountCell">
              <p>{feeDetails.sundries_amount ? feeDetails.sundries_amount : 0}</p>
            </div>
          </div>
        </div>
        <div className="invoiceFooter">
          <div className="invoiceFooterLeft">
            <div className="invoiceBankingDetailsContainer">
              <p className="invoicePBold">Banking Details</p>
              <div className="invoiceBankingDetails">
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">Account Holder: </p>
                  <p>AgProSpec (Pty) Ltd.</p>
                </div>
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">Bank:</p>
                  <p>First National Bank</p>
                </div>
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">Branch Code:</p>
                  <p>255355</p>
                </div>
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">Account No:</p>
                  <p>630 077 331 07</p>
                </div>
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">Account Type:</p>
                  <p>Current</p>
                </div>
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">Swift Code:</p>
                  <p>FIRNZAJJXXX</p>
                </div>
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">IBAN:</p>
                  <p>Not Applicable</p>
                </div>
                <div className="invoiceBankingDetailsRow">
                  <p className="invoicePBold">Reference:</p>
                  <p>APS {fileDetails.id}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="invoiceFooterRight">
            {feeDetails.total_description && (
              <div className="invoiceTotalDescription">
                <h5>{feeDetails.total_description}</h5>
              </div>
            )}
            <p>Total Fee: {feeDetails.total_fee}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeInvoicePrint;
