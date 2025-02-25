import React, { useMemo } from 'react';
import { FileDocument, FileRecord, OutstandingDocument } from '../types';
import { useAddOutstandingDoc, useUpdateOutstandingDoc } from '../hooks/UseMutations';
import { DocRequestEmail } from '../Emails/DocRequestEmail';
//import { getContactNameSurname } from '../utils/ContactUtils';
import { showErrorToast } from '../utils/toast';
//import { formatDbDateDisplay } from '../utils/DateUtils';
import { useData } from '../hooks/UseData';

interface DocumentRequestProps {
  filerecord: FileRecord;
  onClose: () => void;
}

const DocumentRequest: React.FC<DocumentRequestProps> = ({ filerecord, onClose }) => {
  const { fileDocuments, outstandingDocuments, companies } = useData();

  const addOutstandingDocument = useAddOutstandingDoc();
  const updateOutstandingDocument = useUpdateOutstandingDoc();

  const [showAllDocuments, setShowAllDocuments] = React.useState(true);

  const categoryOrder = useMemo(
    () => [
      'Claim',
      'Claim Amount',
      'Driver and Vehicle Details',
      'Goods in Transit',
      'Investigation',
      'Other Party/ies',
      'Import',
      'On Discharge',
      'Full Container Load',
      'Less than Container Load',
      'Exports',
      'Rail',
      'Container',
      'Farming / Frozen / Chilled Product',
      'Fuel Tankers',
      'SAB Documentation',
      'Technical Reports',
      'Construction',
      'Engineering / Liability / Business Interuption',
    ],
    []
  );

  const docsByCategory = useMemo(() => {
    const grouped: { [key: string]: FileDocument[] } = {};
    categoryOrder.forEach((cat) => {
      grouped[cat] = [];
    });
    fileDocuments.forEach((doc) => {
      if (!doc.category) return;
      if (!grouped[doc.category]) grouped[doc.category] = [];
      grouped[doc.category].push(doc);
    });
    return grouped;
  }, [fileDocuments, categoryOrder]);

  const getOrCreateOutstandingDoc = (docId: number): OutstandingDocument => {
    const existingDoc = outstandingDocuments.find(
      (od) => od.file_id === filerecord.id && od.doc_id === docId
    );
    if (existingDoc) {
      return existingDoc;
    } else {
      return {
        file_id: filerecord.id,
        doc_id: docId,
        from_company_id: 1,
        from_contact_id: 1,
        is_required: false,
        is_received: false,
        long_description: false,
      };
    }
  };

  const getCompanyName = (id: number | null) => {
    if (id === null) return '';
    const company = companies.find((c) => c.id === id);
    return company ? company.name : '';
  };

  const emailSubject = `${filerecord.principal_ref} // My Ref: APS ${filerecord.id} // Document Request // Insured: ${getCompanyName(filerecord.insured_id)}`;

  const handleRequiredChange = async (docId: number, checked: boolean) => {
    const outDoc = { ...getOrCreateOutstandingDoc(docId), is_required: checked };
    await saveOrUpdateOutstandingDoc(outDoc);
  };

  const handleReceivedChange = async (docId: number, checked: boolean) => {
    const outDoc = { ...getOrCreateOutstandingDoc(docId), is_received: checked };
    await saveOrUpdateOutstandingDoc(outDoc);
  };

  const handleToggleDescription = async (docId: number, checked: boolean) => {
    const outDoc = { ...getOrCreateOutstandingDoc(docId), long_description: checked };
    await saveOrUpdateOutstandingDoc(outDoc);
  };

  const saveOrUpdateOutstandingDoc = async (outDoc: OutstandingDocument) => {
    try {
      // If it doesn't exist in the array, use add
      const existing = outstandingDocuments.find(
        (od) => od.file_id === outDoc.file_id && od.doc_id === outDoc.doc_id
      );
      if (!existing) {
        await addOutstandingDocument.mutateAsync(outDoc);
      } else {
        await updateOutstandingDocument.mutateAsync({
          file_id: outDoc.file_id,
          doc_id: outDoc.doc_id,
          updatedOutstandingDoc: outDoc,
        });
      }
    } catch (err) {
      showErrorToast('Failed to save/update outstanding doc.');
      console.error(err);
    }
  };

  const openEmailWithBody = () => {
    const emailBodyText = generatePlainTextEmailBody();

    // Encode the body for mailto: link, preserving newlines and spaces
    const encodedBody = encodeURIComponent(emailBodyText).replace(/%0A/g, '%0D%0A'); // Replace \n with \r\n for better email client compatibility

    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodedBody}`;
    window.location.href = mailtoLink;
  };

  const generatePlainTextEmailBody = () => {
    const lines: string[] = [];

    // Header section
    lines.push('Documentation Pending:');
    lines.push(
      '(If any documents requested is not applicable or must be collected from someone else, confirm please by typing next to line item.)'
    );
    lines.push(''); // Empty line for spacing

    categoryOrder.forEach((category) => {
      const docs = docsByCategory[category];
      if (!docs || docs.length === 0) return;

      const requiredDocs = docs.filter((doc) => {
        const outDoc = getOrCreateOutstandingDoc(doc.id);
        return outDoc.is_required && !outDoc.is_received;
      });

      if (requiredDocs.length === 0) return;

      // Category title
      lines.push(category);
      requiredDocs.forEach((doc) => {
        const outDoc = getOrCreateOutstandingDoc(doc.id);
        // Document name with bullet and two-space indent
        lines.push(`  • ${doc.name}`);
        if (outDoc.long_description && doc.description) {
          // Description with four-space indent
          lines.push(`    ${doc.description}`);
        }
      });
      lines.push(''); // Empty line between categories
    });

    // Join with explicit newline character (\n)
    return lines.join('\n');
  };

  return (
    <div className="modal">
      <div className="document-request-container">
        <div className="document-request-header">
          <div className="document-request-header-title">
            <p>Document Request | APS {filerecord.id}</p>
          </div>
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
        <div className="document-request-content">
          <div className="document-request-content-header">
            <div className="document-request-content-header-toggle">
              <input
                type="checkbox"
                checked={showAllDocuments}
                onChange={(e) => setShowAllDocuments(e.target.checked)}
              />
              <label>Show All Documents</label>
            </div>
          </div>
          <div className="document-request-content-body">
            {showAllDocuments && (
              <div className="document-request-all-docs">
                {categoryOrder.map((category) => {
                  const docs = docsByCategory[category];
                  if (!docs || docs.length === 0) return null;
                  return (
                    <div key={category} className="document-category-section">
                      <h3>{category}</h3>
                      {docs.map((doc) => {
                        const outDoc = getOrCreateOutstandingDoc(doc.id!);
                        return (
                          <div className="document-request-row" key={doc.id}>
                            <span>{doc.name}</span>
                            <input
                              type="checkbox"
                              checked={outDoc.is_required}
                              onChange={(e) => handleRequiredChange(doc.id!, e.target.checked)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="document-request-content-required-docs">
              <h3>Required Documents</h3>
              {categoryOrder.map((category) => {
                const docs = docsByCategory[category];
                if (!docs || docs.length === 0) return null;

                // Filter only documents that are required:
                const requiredDocs = docs.filter((doc) => {
                  const outDoc = getOrCreateOutstandingDoc(doc.id!);
                  return outDoc.is_required;
                });

                // If none are required, skip rendering the category:
                if (requiredDocs.length === 0) return null;

                return (
                  <div className="document-request-content-required-list">
                    <div className="document-request-content-required-list-header">
                      <h3>{category}</h3>
                      <div className="document-request-content-required-list-header-checkbox">
                        <label>Rec</label>
                        <label>Desc</label>
                      </div>
                    </div>

                    <div key={category} className="document-category-section">
                      {requiredDocs.map((doc) => {
                        const outDoc = getOrCreateOutstandingDoc(doc.id!);
                        return (
                          <div className="document-request-row" key={doc.id}>
                            <span>{doc.name}</span>
                            <div className="document-request-row-checkbox-container">
                              <input
                                type="checkbox"
                                checked={outDoc.is_received}
                                onChange={(e) => handleReceivedChange(doc.id!, e.target.checked)}
                              />
                              <input
                                type="checkbox"
                                checked={outDoc.long_description}
                                onChange={(e) => handleToggleDescription(doc.id!, e.target.checked)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {!showAllDocuments && (
              <div className="document-request-print-screen">
                <h3>Print Screen</h3>
                <div className="document-request-print-screen-header">
                  <label>{emailSubject}</label>
                  <button
                    type="button"
                    className="copy-to-clipboard"
                    onClick={() => navigator.clipboard.writeText(emailSubject)}
                  >
                    Copy Ref
                  </button>
                </div>
                <button type="button" className="copy-email-body" onClick={openEmailWithBody}>
                  Copy Email Body
                </button>
                <div className="document-request-print-screen-body">
                  <DocRequestEmail
                    categoryOrder={categoryOrder}
                    docsByCategory={docsByCategory}
                    getOrCreateOutstandingDoc={getOrCreateOutstandingDoc}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequest;
