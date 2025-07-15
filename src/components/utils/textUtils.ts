/**
 * Utility functions for text processing
 */

/**
 * Converts HTML content to plain text
 * @param html - HTML string to convert
 * @returns Plain text string
 */
export const htmlToPlainText = (html: string): string => {
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Get text content and clean it up
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  // Replace multiple whitespace with single space and trim
  return plainText.replace(/\s+/g, ' ').trim();
};

/**
 * Converts plain text to HTML with proper line breaks
 * @param text - Plain text to convert
 * @returns HTML string with proper formatting
 */
export const plainTextToHtml = (text: string): string => {
  return text
    .replace(/\n\n/g, '</p><p>') // Double line breaks become paragraph breaks
    .replace(/\n/g, '<br>') // Single line breaks become <br>
    .replace(/^(.*)$/, '<p>$1</p>'); // Wrap in paragraph tags
};

/**
 * Checks if HTML content has actual text content (not just tags)
 * @param html - HTML string to check
 * @returns True if there's actual text content
 */
export const hasTextContent = (html: string): boolean => {
  const plainText = htmlToPlainText(html);
  return plainText.length > 0;
};

/**
 * Formats email signature with proper HTML
 * @param signature - Plain text signature
 * @returns HTML formatted signature
 */
export const formatEmailSignature = (signature: string): string => {
  return signature
    .split('\n\n') // Split into paragraphs
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
};
