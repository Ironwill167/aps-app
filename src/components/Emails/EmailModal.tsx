import React, { useState, useEffect, useCallback } from 'react';
import { FileRecord, Contact, Company } from '../types';
import { useData } from '../hooks/UseData';

interface EmailModalProps {
  file: FileRecord;
  contacts: Contact[];
  companies: Company[];
  emailType: 'acknowledgment' | 'general';
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({
  file,
  contacts,
  companies,
  emailType,
  onClose,
}) => {
  const { emailAccounts, sendEmail } = useData();
  const [selectedFrom, setSelectedFrom] = useState('');
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Set default selected email account when emailAccounts are loaded
  useEffect(() => {
    if (emailAccounts && emailAccounts.length > 0 && !selectedFrom) {
      setSelectedFrom(emailAccounts[0].email);
    }
  }, [emailAccounts, selectedFrom]);

  // Get contact and company names
  const getPrincipalContactName = useCallback(() => {
    if (!file.principal_contact_id) return '[Principal Contact Name]';
    const contact = contacts.find((c) => c.id === file.principal_contact_id);
    return contact ? `${contact.name}`.trim() : '[Principal Contact Name]';
  }, [file.principal_contact_id, contacts]);

  const getPrincipalContactEmail = useCallback(() => {
    if (!file.principal_contact_id) return '';
    const contact = contacts.find((c) => c.id === file.principal_contact_id);
    return contact?.email || '';
  }, [file.principal_contact_id, contacts]);

  const getInsuredName = useCallback(() => {
    if (!file.insured_id) return '[Insured Name]';
    const company = companies.find((c) => c.id === file.insured_id);
    return company?.name || '[Insured Name]';
  }, [file.insured_id, companies]);

  // Get signature
  const getSignature = useCallback(() => {
    return `Look forward to hearing from you.
Thank you and kind regards.
Mannie Botha
Senior Assessor
Agprospec (Pty) Ltd.
Reg No: 2022/548907/07

Office: 079 433 7830 (Elize) Cell: 081 077 0602 (Willie) / 071 169 9914 (Mannie)

DISCLAIMER: This e-mail and any attachments are confidential, may be privileged and intended solely for the use of the named recipient/s. If you are not the intended recipient/s, please notify the sender and erase this e-mail immediately. Any unauthorised use, alteration or dissemination is prohibited without confirmation by the sender. Agprospec (Pty) Ltd accepts no liability for loss, nor consequence, arising from this e-mail.`;
  }, []);

  // Initialize email content based on type
  useEffect(() => {
    const principalContactName = getPrincipalContactName();
    const principalContactEmail = getPrincipalContactEmail();
    const insuredName = getInsuredName();
    const signature = getSignature();

    if (emailType === 'acknowledgment') {
      const subject = `APS Ref: ${file.id} - ${file.subject_matter || 'Insurance Claim'} - Acknowledgment`;

      const body = `Hi ${principalContactName},

I hereby acknowledge receipt of and thank you for your instructions of even date.

Please note and quote my "APS" file reference number above in the "Subject" line on all future correspondence.

Kindly note that I will contact the Insured ${insuredName} to make the necessary survey arrangement, collection of documentation and to report back to you shortly.

// Kindly note that the survey arrangement is preliminary booked for (Insert Date If Applicable), we will proceed with the collection of documentation and to report back to you shortly

I confirm that you will be kept fully updated on developments.

${signature}`;

      setEmailData((prev) => ({
        ...prev,
        to: principalContactEmail,
        subject,
        body,
      }));
    } else if (emailType === 'general') {
      // Basic email with just signature
      const subject = `APS Ref: ${file.id} - Insurer Ref: ${file.principal_ref}`;

      const body = `Hi ,

${signature}`;

      setEmailData((prev) => ({
        ...prev,
        to: '', // Leave empty for basic emails - user will enter manually
        subject,
        body,
      }));
    }
  }, [
    emailType,
    file.id,
    file.subject_matter,
    file.principal_ref,
    getPrincipalContactName,
    getPrincipalContactEmail,
    getInsuredName,
    getSignature,
  ]);

  const handleInputChange = (field: keyof typeof emailData, value: string) => {
    setEmailData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSend = async () => {
    if (!selectedFrom || !emailData.to || !emailData.subject || !emailData.body) {
      alert('Please fill in all required fields (From, To, Subject, and Message).');
      return;
    }

    setIsLoading(true);
    try {
      const emailRequest = {
        from: selectedFrom,
        to: emailData.to,
        cc: emailData.cc || undefined,
        bcc: emailData.bcc || undefined,
        subject: emailData.subject,
        body: emailData.body,
        fileId: file.id.toString(),
        emailType: emailType,
      };

      const result = await sendEmail(emailRequest);

      if (result.success) {
        alert(
          `Email sent successfully from ${result.sentFrom || selectedFrom}! Message ID: ${result.messageId}`
        );
        console.log('Email sent successfully:', result.messageId);
        onClose();
      } else {
        console.error('Email sending failed:', result.error);
        alert(`Failed to send email: ${result.error || result.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    const emailContent = `From: ${selectedFrom}
To: ${emailData.to}
CC: ${emailData.cc}
BCC: ${emailData.bcc}
Subject: ${emailData.subject}

${emailData.body}`;

    navigator.clipboard.writeText(emailContent);
    alert('Email content copied to clipboard!');
  };
  return (
    <div className="modal">
      <div className="modal-content email-modal-content">
        <div className="modal-header">
          <h2>{emailType === 'acknowledgment' ? 'Acknowledgment Email' : 'Basic Email'}</h2>
          <span
            className="close-modal-button"
            onClick={onClose}
            role="button"
            aria-label="Close Modal"
            tabIndex={0}
          >
            &times;
          </span>
        </div>

        <div className="modal-body email-modal-body">
          <form className="email-form" onSubmit={(e) => e.preventDefault()}>
            <div className="email-field-grid">
              <div className="email-field">
                <label htmlFor="email-from">Send From: *</label>
                <select
                  id="email-from"
                  value={selectedFrom}
                  onChange={(e) => setSelectedFrom(e.target.value)}
                  required
                >
                  {emailAccounts && emailAccounts.length > 0 ? (
                    emailAccounts.map((account) => (
                      <option key={account.email} value={account.email}>
                        {account.displayName}
                      </option>
                    ))
                  ) : (
                    <option value="">Loading email accounts...</option>
                  )}
                </select>
              </div>

              <div className="email-field">
                <label htmlFor="email-to">To: *</label>
                <input
                  type="email"
                  id="email-to"
                  value={emailData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div className="email-field">
                <label htmlFor="email-cc">CC:</label>
                <input
                  type="email"
                  id="email-cc"
                  value={emailData.cc}
                  onChange={(e) => handleInputChange('cc', e.target.value)}
                  placeholder="cc@example.com"
                />
              </div>

              <div className="email-field">
                <label htmlFor="email-bcc">BCC:</label>
                <input
                  type="email"
                  id="email-bcc"
                  value={emailData.bcc}
                  onChange={(e) => handleInputChange('bcc', e.target.value)}
                  placeholder="bcc@example.com"
                />
              </div>

              <div className="email-field email-subject-field">
                <label htmlFor="email-subject">Subject: *</label>
                <input
                  type="text"
                  id="email-subject"
                  value={emailData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Email subject"
                  required
                />
              </div>
            </div>

            <div className="email-body-container">
              <label htmlFor="email-body">Message: *</label>
              <textarea
                id="email-body"
                value={emailData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Email content..."
                required
              />
            </div>
          </form>
        </div>

        <div className="modal-actions email-modal-actions">
          <button type="button" className="modal-submit" onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Email'}
          </button>
          <button type="button" className="modal-secondary" onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </button>
          <button type="button" className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
