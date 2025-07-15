# RichTextEditor Component

A reusable React component that provides rich text editing capabilities using React Quill, designed to be easily integrated into various parts of the application.

## Features

- **Rich Text Editing**: Full-featured text editor with formatting options
- **Customizable Toolbar**: Configurable toolbar with different preset options
- **HTML Output**: Generates clean HTML content
- **Responsive Design**: Works well on different screen sizes
- **Email Optimized**: Special configuration for email content
- **Theme Support**: Light and dark theme support
- **Utility Functions**: Helper functions for text processing

## Installation

The component is already installed with the required dependencies:

```bash
npm install react-quill
```

## Usage

### Basic Usage

```tsx
import RichTextEditor from '../Shared/RichTextEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor value={content} onChange={setContent} placeholder="Enter your text here..." />
  );
}
```

### Email Usage (Current Implementation)

```tsx
import RichTextEditor from '../Shared/RichTextEditor';

function EmailModal() {
  const [emailBody, setEmailBody] = useState('');

  return (
    <RichTextEditor
      value={emailBody}
      onChange={setEmailBody}
      placeholder="Email content..."
      className="email-editor"
      height="350px"
    />
  );
}
```

### Advanced Usage with Custom Toolbar

```tsx
import RichTextEditor from '../Shared/RichTextEditor';

function AdvancedEditor() {
  const [content, setContent] = useState('');

  const customToolbar = [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ];

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      customToolbar={customToolbar}
      theme="snow"
      height="400px"
    />
  );
}
```

## Props

| Prop            | Type                      | Default                     | Description                              |
| --------------- | ------------------------- | --------------------------- | ---------------------------------------- |
| `value`         | `string`                  | -                           | The HTML content value (required)        |
| `onChange`      | `(value: string) => void` | -                           | Callback when content changes (required) |
| `placeholder`   | `string`                  | `"Enter your text here..."` | Placeholder text                         |
| `readOnly`      | `boolean`                 | `false`                     | Make editor read-only                    |
| `theme`         | `'snow' \| 'bubble'`      | `'snow'`                    | Quill theme                              |
| `height`        | `string`                  | `'200px'`                   | Editor height                            |
| `className`     | `string`                  | `''`                        | Additional CSS classes                   |
| `id`            | `string`                  | -                           | HTML id attribute                        |
| `customToolbar` | `(string \| string[])[]`  | -                           | Custom toolbar configuration             |

## Predefined Toolbars

### Email Toolbar (Default)

Optimized for email content with essential formatting options:

- Headers (H1, H2, H3)
- Bold, italic, underline
- Text color
- Font family
- Text alignment
- Ordered/unordered lists
- Blockquotes
- Links
- Clean formatting

### Full Toolbar

For comprehensive text editing (available via `customToolbar` prop):

- All email toolbar features
- Strike-through text
- Background color
- Text indent
- Code blocks
- Images
- More formatting options

## CSS Classes

The component uses the following CSS classes that can be customized:

- `.rich-text-editor` - Main container
- `.rich-text-editor.email-editor` - Email-specific styling
- `.rich-text-editor.compact` - Compact mode
- `.rich-text-editor.read-only` - Read-only mode
- `.rich-text-editor.dark` - Dark theme

## Utility Functions

The component comes with utility functions for text processing:

```tsx
import { htmlToPlainText, hasTextContent, plainTextToHtml } from '../utils/textUtils';

// Convert HTML to plain text
const plainText = htmlToPlainText('<p>Hello <strong>world</strong></p>');
// Result: "Hello world"

// Check if HTML has actual content
const hasContent = hasTextContent('<p><br></p>');
// Result: false

// Convert plain text to HTML
const html = plainTextToHtml('Hello\\nWorld');
// Result: "<p>Hello<br>World</p>"
```

## Integration Examples

### In Forms

```tsx
<div className="form-field">
  <label>Description</label>
  <RichTextEditor
    value={formData.description}
    onChange={(value) => setFormData({ ...formData, description: value })}
    height="250px"
  />
</div>
```

### In Modals

```tsx
<div className="modal-body">
  <RichTextEditor
    value={modalContent}
    onChange={setModalContent}
    className="modal-editor"
    height="300px"
  />
</div>
```

### Read-only Display

```tsx
<RichTextEditor
  value={displayContent}
  onChange={() => {}} // No-op for read-only
  readOnly={true}
  className="read-only"
/>
```

## Styling Integration

The component is designed to work with the existing application styles. For email integration, it uses the `.email-editor` class and integrates with the `_EmailModal.scss` styles.

## Future Enhancements

1. **File Upload**: Add support for file attachments
2. **Mentions**: Add @mention functionality
3. **Templates**: Predefined content templates
4. **Spell Check**: Integration with spell checking
5. **Collaborative Editing**: Multi-user editing support
6. **Mobile Optimization**: Enhanced mobile experience

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Performance Considerations

- The component lazy-loads Quill styles
- HTML content is efficiently processed
- Toolbar is optimized for email use cases
- Memory usage is minimized through proper cleanup
