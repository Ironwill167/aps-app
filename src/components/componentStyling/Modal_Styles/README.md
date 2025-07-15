# Modal Styles Organization

This directory contains the separated modal styles for the APS application. The styles have been organized into individual files for better maintainability and easier customization.

## Structure

### `_modalStyles.scss`

Master file that imports all modal styles in the correct order. This is the main entry point for all modal styles.

### `_mainModalStyles.scss`

Contains shared styles used by all modals including:

- Base modal container (`.modal`)
- Modal content wrapper (`.modal-content`)
- Modal header, body, and footer
- Form elements (`.modal-form-group`, `.modal-row`)
- Buttons (`.modal-submit`, `.modal-cancel`)
- Loading states
- Scrollbar styling
- Focus states

### Individual Modal Files

#### `_viewFileModal.scss`

Styles specific to the ViewFile modal:

- Custom header with notes/save buttons
- Specialized layout overrides
- Header positioning and styling

#### `_fileNotesModal.scss`

Styles for the File Notes modal:

- Notes history section
- Add note section
- Notes list display
- Custom modal sizing

#### `_entityModal.scss`

Styles for Entity modals (Add/Edit Contact/Company):

- Additional party container styles
- Form group variations
- Currency select styling

#### `_feeModal.scss`

Styles specific to fee-related modals:

- Fee generate invoice button
- Fee-specific form elements

#### `_emailModal.scss`

Styles for email modals:

- Email body container
- Textarea sizing
- Email modal content sizing

#### `_dataModals.scss`

Styles for data editing modals (EditCauseOfLoss, EditFileDoc, EditInvoiceRate):

- Custom modal structure
- Form styling
- Button positioning

### `_responsiveModalStyles.scss`

Contains all responsive styles for modals:

- Tablet/mobile breakpoints
- Compact screen adjustments
- Wide screen optimizations
- Height-specific optimizations

## Usage

To modify styles for a specific modal:

1. **Shared styles**: Edit `_mainModalStyles.scss`
2. **Specific modal**: Edit the corresponding individual modal file
3. **Responsive behavior**: Edit `_responsiveModalStyles.scss`

## Import Order

The import order in `_modalStyles.scss` is important:

1. **Main styles first**: Base styles that all modals inherit
2. **Specific styles**: Individual modal customizations
3. **Responsive styles last**: To ensure proper cascade and override behavior

## Adding New Modal Styles

To add styles for a new modal:

1. Create a new file: `_newModalName.scss`
2. Add your modal-specific styles
3. Import it in `_modalStyles.scss` in the appropriate section
4. Use the established naming conventions and structure

## File Naming Convention

- Use underscore prefix: `_modalName.scss`
- Use camelCase for modal names: `_fileNotesModal.scss`
- Keep names descriptive and consistent with component names

## Best Practices

1. **Avoid duplicating shared styles**: Use `_mainModalStyles.scss` for common elements
2. **Use specific selectors**: Target your modal with specific classes
3. **Follow responsive pattern**: Add responsive styles to `_responsiveModalStyles.scss`
4. **Use variables**: Leverage existing SCSS variables from `_variables.scss`
5. **Use mixins**: Utilize mixins from `_mixins.scss` for consistency

## Migration from Old Structure

The old `_Modal.scss` file has been replaced with this organized structure. All existing styles have been preserved and categorized appropriately. The old file now simply imports the new organized structure for backward compatibility.
