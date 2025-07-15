import React, { useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  theme?: 'snow' | 'bubble';
  height?: string;
  className?: string;
  id?: string;
  customToolbar?: (string | string[])[];
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter your text here...',
  readOnly = false,
  theme = 'snow',
  height = '200px',
  className = '',
  id,
  customToolbar,
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // Register custom fonts
  useEffect(() => {
    const Font = Quill.import('formats/font');
    Font.whitelist = [
      'arial',
      'times-new-roman',
      'georgia',
      'verdana',
      'helvetica',
      'serif',
      'monospace',
    ];
    Quill.register(Font, true);
  }, []);

  // Email-specific toolbar (more focused)
  const emailToolbar = [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }],
    [
      {
        font: ['arial', 'times-new-roman', 'georgia', 'verdana', 'helvetica', 'serif', 'monospace'],
      },
    ],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['link'],
    ['clean'],
  ];

  // Use custom toolbar if provided, otherwise use email toolbar for email context
  const toolbar = customToolbar || emailToolbar;

  const modules = {
    toolbar: toolbar,
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
    'code-block',
  ];

  const handleChange = (content: string) => {
    onChange(content);
  };

  // Set default font after component mounts
  useEffect(() => {
    if (quillRef.current && value === '') {
      const quill = quillRef.current.getEditor();
      quill.format('font', 'times-new-roman');
    }
  }, [value]);

  // Apply Times New Roman as default font styling
  const defaultStyle = {
    height: height,
    marginBottom: '42px', // Account for toolbar height
    fontFamily: 'Times New Roman, serif',
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        id={id}
        theme={theme}
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        placeholder={placeholder}
        style={defaultStyle}
      />
    </div>
  );
};

export default RichTextEditor;
