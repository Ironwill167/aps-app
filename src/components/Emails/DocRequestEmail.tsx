import React from 'react';
import { OutstandingDocument, FileDocument } from '../types';

interface DocRequestEmailProps {
  categoryOrder: string[];
  docsByCategory: Record<string, FileDocument[]>;
  getOrCreateOutstandingDoc: (docId: number) => OutstandingDocument;
}

export const DocRequestEmail: React.FC<DocRequestEmailProps> = ({
  categoryOrder,
  docsByCategory,
  getOrCreateOutstandingDoc,
}) => {
  const generateEmailBody = () => {
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h4 style="font-size: 16px; margin: 10px 0;">Documentation Pending:</h4>
        <p style="margin: 5px 0;">
          (If any documents requested is not applicable or must be collected from someone else, confirm please by typing next to line item.)
        </p>
    `;

    categoryOrder.forEach((category) => {
      const docs = docsByCategory[category];
      if (!docs || docs.length === 0) return;

      // Filter only “required” and “not received” items
      const requiredDocs = docs.filter((doc) => {
        const outDoc = getOrCreateOutstandingDoc(doc.id!);
        return outDoc.is_required && !outDoc.is_received;
      });

      if (requiredDocs.length === 0) return;

      emailHtml += `
        <h3 style="font-size: 18px; margin: 15px 0 5px 0;">${category}</h3>
      `;

      requiredDocs.forEach((doc) => {
        const outDoc = getOrCreateOutstandingDoc(doc.id!);
        emailHtml += `
          <div style="margin: 5px 0 10px 10px;">
            <span style="font-size: 14px;">• ${doc.name}</span>
            ${
              outDoc.long_description && doc.description
                ? `<p style="margin: 5px 0 0 20px; font-size: 14px;">${doc.description}</p>`
                : ''
            }
          </div>
        `;
      });
    });

    emailHtml += `</div>`;
    return emailHtml;
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: generateEmailBody() }} />
    </div>
  );
};
