import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useData } from '../hooks/UseData';
import { useUpdateFee } from '../hooks/UseMutations';
import { FileRecord, FeeRecord } from '../types';
import { showErrorToast } from '../utils/toast';
import EditableCell from './EditableCell';

const ViewFileModal = lazy(() => import('../Modals/ViewFileModal'));
const FeeInvoice = lazy(() => import('./FeeInvoice'));

const FeeManagement: React.FC = () => {
  const { companies, contacts, files, filesLoading, filesError, fees, feesLoading, feesError } =
    useData();

  // View Modals State
  const [showViewFileModal, setShowViewFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  const [showFeeInvoice, setShowFeeInvoice] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);

  const updateFeeMutation = useUpdateFee();

  const statusOrder = useMemo(
    () => [
      'NEW',
      'SURVEY',
      'PRELIM',
      'DOC-RI',
      'DOC-RR',
      'DOC-RF',
      'RPT-BS',
      'RPT-C',
      'RPT-D',
      'RPT-S',
    ],
    []
  );

  // Handle File Updated
  const handleFileUpdated = useCallback(() => {}, []);

  // Handle Right-Click to Show Electron Context Menu
  const handleRightClick = useCallback(
    (event: React.MouseEvent, contextType: string, contextId: number) => {
      event.preventDefault();
      event.stopPropagation();
      window.electronAPI.showContextMenu(contextType, contextId);
    },
    []
  );

  const getStatus = useCallback(
    (feeId: number) => {
      const file = files.find((file) => file.id === feeId);
      return file?.status;
    },
    [files]
  );

  const groupedFiles = useMemo(() => {
    const fileGroups: { [key: string]: FileRecord[] } = {
      FileOpenFiles: [],
      FileFeeRaised: [],
      FileFeePaid: [],
    };

    const feeGroups: { [key: string]: FeeRecord[] } = {
      FeeOpenFiles: [],
      FeeFeeRaised: [],
      FeeFeePaid: [],
    };

    const ActiveOpenFiles = files.filter((file) => file.status !== 'Closed');
    ActiveOpenFiles.forEach((file) => {
      switch (file.status) {
        case 'NEW':
        case 'SURVEY':
        case 'PRELIM':
        case 'DOC-RI':
        case 'DOC-RR':
        case 'DOC-RF':
        case 'RPT-BS':
        case 'RPT-C':
        case 'RPT-D':
        case 'RPT-S':
          {
            fileGroups.FileOpenFiles.push(file);
            const feeOpen = fees.find((fee) => fee.id === file.id); //fee_id and file_id should be the same
            if (feeOpen) {
              feeGroups.FeeOpenFiles.push(feeOpen);
            }
          }
          break;
        case 'FEE-R':
          {
            fileGroups.FileFeeRaised.push(file);
            const feeRaised = fees.find((fee) => fee.id === file.id); //fee_id and file_id should be the same
            if (feeRaised) {
              feeGroups.FeeFeeRaised.push(feeRaised);
            }
          }
          break;
        case 'FEE-P':
          {
            fileGroups.FileFeePaid.push(file);
            const feePaid = fees.find((fee) => fee.id === file.id); //fee_id and file_id should be the same
            if (feePaid) {
              feeGroups.FeeFeePaid.push(feePaid);
            }
          }
          break;
        default:
          break;
      }
    });

    feeGroups.FeeOpenFiles.sort((a, b) => {
      const statusA = getStatus(a.id);
      const statusB = getStatus(b.id);
      const indexA = statusOrder.indexOf(statusA || '');
      const indexB = statusOrder.indexOf(statusB || '');
      return indexA - indexB;
    });

    return { fileGroups, feeGroups };
  }, [files, fees, statusOrder, getStatus]);

  const getPrincipal = (feeId: number) => {
    const file = files.find((file) => file.id === feeId);
    const principal = companies.find((company) => company.id === file?.principal_id);
    return principal?.name;
  };

  const isLoading = feesLoading || filesLoading;
  if (feesError) showErrorToast('Failed to load fees.');
  if (filesError) showErrorToast('Failed to load files.');

  const getFeeTotals = useMemo(() => {
    let totalOpenFee: number = 0;
    let totalOpenAPS: number = 0;
    let totalOpenMannie: number = 0;
    let totalOpenElize: number = 0;
    let totalOpenWillie: number = 0;
    let totalOpenOther: number = 0;
    let totalRaisedFee: number = 0;
    let totalRaisedAPS: number = 0;
    let totalRaisedMannie: number = 0;
    let totalRaisedElize: number = 0;
    let totalRaisedWillie: number = 0;
    let totalRaisedOther: number = 0;

    groupedFiles.feeGroups.FeeOpenFiles.forEach((fee) => {
      totalOpenFee += Number(fee.total_fee) || 0;
      totalOpenAPS += Number(fee.aps_cut) || 0;
      totalOpenMannie += Number(fee.mannie_cut) || 0;
      totalOpenElize += Number(fee.elize_cut) || 0;
      totalOpenWillie += Number(fee.willie_cut) || 0;
      totalOpenOther += Number(fee.other_cut) || 0;
    });

    groupedFiles.feeGroups.FeeFeeRaised.forEach((fee) => {
      totalRaisedFee += Number(fee.total_fee) || 0;
      totalRaisedAPS += Number(fee.aps_cut) || 0;
      totalRaisedMannie += Number(fee.mannie_cut) || 0;
      totalRaisedElize += Number(fee.elize_cut) || 0;
      totalRaisedWillie += Number(fee.willie_cut) || 0;
      totalRaisedOther += Number(fee.other_cut) || 0;
    });

    return {
      totalOpenFee,
      totalOpenAPS,
      totalOpenMannie,
      totalOpenElize,
      totalOpenWillie,
      totalOpenOther,
      totalRaisedFee,
      totalRaisedAPS,
      totalRaisedMannie,
      totalRaisedElize,
      totalRaisedWillie,
      totalRaisedOther,
    };
  }, [groupedFiles.feeGroups.FeeOpenFiles, groupedFiles.feeGroups.FeeFeeRaised]);

  //Listener for electron context-menu-action
  const handleContextMenuAction = useCallback(
    (action: string, contextType: string, contextId: number) => {
      if (contextType === 'fee') {
        setSelectedFee(fees.find((f) => f.id === contextId) || null);
        setSelectedFile(files.find((f) => f.id === contextId) || null);
        switch (action) {
          case 'viewFile':
            setShowViewFileModal(true);
            break;

          case 'editFee':
            setShowFeeInvoice(true);
            break;

          default:
            break;
        }
      }
    },
    [fees, files]
  );

  useEffect(() => {
    window.electronAPI.onContextMenuAction(handleContextMenuAction);

    return () => {
      window.electronAPI.offContextMenuAction(handleContextMenuAction);
    };
  }, [handleContextMenuAction]);

  // Save function for EditableCell

  const handleSave = async (
    feeId: number,
    editingFee: FeeRecord | null,
    field: keyof FeeRecord,
    editValue: number | string
  ) => {
    if (editingFee) {
      const updatedFee = { ...editingFee, [field]: editValue };

      try {
        await updateFeeMutation.mutateAsync({
          id: feeId,
          updatedFee,
        });
        console.log(`FeeInvoice updates with Fee Data:, ${updatedFee}`);
      } catch (err) {
        console.error('Update Fee Error:', err);
        showErrorToast('Failed to update fee. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content-contents">
      <div className="mainContentHeader">
        <h2 className="mainContentHeading">Fee Management</h2>
      </div>
      <div className="feeManagementTotalsContainer">
        <div className="feeManagementRaisedTotals">
          <div className="feeManagementRaisedTotalsHeading">Fee Raised</div>

          <div className="feeManagementRaisedTotalAmount">
            Total Fee: R {getFeeTotals.totalRaisedFee}
          </div>
          <div className="feeManagementRaisedAPSAmount">APS: R {getFeeTotals.totalRaisedAPS}</div>
          <div className="feeManagementRaisedMannieAmount">
            Mannie: R {getFeeTotals.totalRaisedMannie}
          </div>
          <div className="feeManagementRaisedElizeAmount">
            Elize: R {getFeeTotals.totalRaisedElize}
          </div>
          <div className="feeManagementRaisedWillieAmount">
            Willie: R {getFeeTotals.totalRaisedWillie}
          </div>
          <div className="feeManagementRaisedOtherAmount">
            Other: R {getFeeTotals.totalRaisedOther}
          </div>
        </div>
        <div className="feeManagementActiveTotals">
          <div className="feeManagementActiveTotalsHeading">Active Files</div>

          <div className="feeManagementActiveTotalAmount">
            Total Fee: R {getFeeTotals.totalOpenFee}
          </div>
          <div className="feeManagementActiveAPSAmount">APS: R {getFeeTotals.totalOpenAPS}</div>
          <div className="feeManagementActiveMannieAmount">
            Mannie: R {getFeeTotals.totalOpenMannie}
          </div>
          <div className="feeManagementActiveElizeAmount">
            Elize: R {getFeeTotals.totalOpenElize}
          </div>
          <div className="feeManagementActiveWillieAmount">
            Willie: R {getFeeTotals.totalOpenWillie}
          </div>
          <div className="feeManagementActiveOtherAmount">
            Other: R {getFeeTotals.totalOpenOther}
          </div>
        </div>
      </div>
      <div className="feeManagementTableContainer">
        <table className="feeManagementTable feeManagementTableHeader">
          <thead>
            <tr>
              <th className="FeeManageFileIdColumn">File ID</th>
              <th className="FeeManageFileStatus">Status</th>
              <th className="FeeManageFilePrincipal">Fee Raised</th>
              <th className="FeeManageFeeRaised">Fee Raised</th>
              <th className="FeeManageInvDate">Invoice Date</th>
              <th className="FeeManageFeePaid">Fee Paid</th>
              <th className="FeeManageTotFee">Total Fee</th>
              <th className="FeeManageApsCut">APS</th>
              <th className="FeeManageManCut">Mannie</th>
              <th className="FeeManageEliCut">Elize</th>
              <th className="FeeManageWilCut">Willie</th>
              <th className="FeeManageOtherCut">Other</th>
            </tr>
          </thead>
        </table>

        <table className="feeManagementTable">
          <tbody>
            {groupedFiles.feeGroups.FeeOpenFiles.map((fee) => (
              <tr
                className="feeManageFileRow"
                key={fee.id}
                onContextMenu={(e) => handleRightClick(e, 'fee', fee.id)}
              >
                <td className="FeeManageFileIdColumn">{fee.file_id}</td>
                <td className="FeeManageFileStatus">{getStatus(fee.id)}</td>
                <td className="FeeManageFilePrincipal">{getPrincipal(fee.id)}</td>
                <td className="FeeManageFeeRaised">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="fee_raised"
                    value={fee.fee_raised}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageInvDate">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="inv_date"
                    value={fee.inv_date?.split('T')[0]}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageFeePaid">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="fee_paid"
                    value={fee.fee_paid}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageTotFee">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="total_fee"
                    value={fee.total_fee}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageApsCut">{fee.aps_cut}</td>
                <td className="FeeManageManCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="mannie_cut"
                    value={fee.mannie_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageEliCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="elize_cut"
                    value={fee.elize_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageWilCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="willie_cut"
                    value={fee.willie_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageOtherCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="other_cut"
                    value={fee.other_cut}
                    onSave={handleSave}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="seperatorDiv">~</div>
        <table className="feeManagementTable">
          <tbody>
            {groupedFiles.feeGroups.FeeFeeRaised.map((fee) => (
              <tr
                className="feeManageFileRow"
                key={fee.id}
                onContextMenu={(e) => handleRightClick(e, 'fee', fee.id)}
              >
                <td className="FeeManageFileIdColumn">{fee.file_id}</td>
                <td className="FeeManageFileStatus">{getStatus(fee.id)}</td>
                <td className="FeeManageFilePrincipal">{getPrincipal(fee.id)}</td>
                <td className="FeeManageFeeRaised">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="fee_raised"
                    value={fee.fee_raised}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageInvDate">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="inv_date"
                    value={fee.inv_date?.split('T')[0]}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageFeePaid">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="fee_paid"
                    value={fee.fee_paid}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageTotFee">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="total_fee"
                    value={fee.total_fee}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageApsCut">{fee.aps_cut}</td>
                <td className="FeeManageManCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="mannie_cut"
                    value={fee.mannie_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageEliCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="elize_cut"
                    value={fee.elize_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageWilCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="willie_cut"
                    value={fee.willie_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageOtherCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="other_cut"
                    value={fee.other_cut}
                    onSave={handleSave}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="seperatorDiv">`</div>
        <table className="feeManagementTable">
          <tbody>
            {groupedFiles.feeGroups.FeeFeePaid.map((fee) => (
              <tr
                className="feeManageFileRow"
                key={fee.id}
                onContextMenu={(e) => handleRightClick(e, 'fee', fee.id)}
              >
                <td className="FeeManageFileIdColumn">{fee.file_id}</td>
                <td className="FeeManageFileStatus">{getStatus(fee.id)}</td>
                <td className="FeeManageFilePrincipal">{getPrincipal(fee.id)}</td>
                <td className="FeeManageFeeRaised">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="fee_raised"
                    value={fee.fee_raised}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageInvDate">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="inv_date"
                    value={fee.inv_date?.split('T')[0]}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageFeePaid">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="fee_paid"
                    value={fee.fee_paid}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageTotFee">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="total_fee"
                    value={fee.total_fee}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageApsCut">{fee.aps_cut}</td>
                <td className="FeeManageManCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="mannie_cut"
                    value={fee.mannie_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageEliCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="elize_cut"
                    value={fee.elize_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageWilCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="willie_cut"
                    value={fee.willie_cut}
                    onSave={handleSave}
                  />
                </td>
                <td className="FeeManageOtherCut">
                  <EditableCell
                    feeId={fee.id}
                    editingFee={fee}
                    field="other_cut"
                    value={fee.other_cut}
                    onSave={handleSave}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View/Edit File Modal */}
      {showViewFileModal && selectedFile && (
        <Suspense fallback={<div>Loading...</div>}>
          <ViewFileModal
            file={selectedFile}
            onClose={() => setShowViewFileModal(false)}
            onFileUpdated={handleFileUpdated}
            companies={companies}
            contacts={contacts}
          />
        </Suspense>
      )}

      {/* Fee Invoice */}
      {showFeeInvoice && selectedFile && selectedFee && (
        <Suspense fallback={<div>Loading...</div>}>
          <FeeInvoice
            fileDetails={selectedFile}
            feeDetails={selectedFee}
            onClose={() => setShowFeeInvoice(false)}
            onFileUpdated={handleFileUpdated}
            companies={companies}
            contacts={contacts}
          />
        </Suspense>
      )}
    </div>
  );
};

export default FeeManagement;
