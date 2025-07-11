# VuxMetadata

## Description
The `vuxMetadata.ts` file defines types, interfaces, and utility functions for managing metadata in the VUX framework. It provides a structured way to handle properties, layouts, validations, and actions for VUX components.

---

## Importance of Type Safety

Type safety ensures that metadata is valid and consistent throughout the system. By using utility functions like `isVuxTextInputProperty` and `asVuxTextInputProperty`, developers can validate and enforce the correct types for metadata items.

### Usage Examples

#### Example: Using `isVuxTextInputProperty`
```typescript
import { isVuxTextInputProperty, VuxProperty } from './vuxMetadata';

const property: VuxProperty = {
  type: "vux-input-property",
  inputMode: "text",
  validations: { required: true },
};

if (isVuxTextInputProperty(property)) {
  // Inside this block, `property` is now typed as `VuxTextInputProperty`
  console.log(property.validations.required); // Output: true
}
```

#### Example: Using `asVuxTextInputProperty`
```typescript
import { asVuxTextInputProperty, VuxProperty } from './vuxMetadata';

const property: VuxProperty = {
  type: "vux-input-property",
  inputMode: "text",
  validations: { required: true },
};

try {
  const textInput = asVuxTextInputProperty(property);
  console.log(textInput.validations.required); // Output: true
} catch (error) {
  console.error(error.message); // If the property is not a valid text input, an error is thrown.
}
```

---

## Types and Interfaces

### `VuxMetadata`
Represents the metadata for a VUX property. This can either be an input property or a complex property.

Below is an example JSON structure demonstrating the usage of `VuxMetadata` in the context of an administrative system.

```json
{
  "type": "vux-component-group",
  "layout": {
    "orientation": "vertical"
  },
  "customerDetails": {
    "type": "vux-complex-property",
    "layout": {
      "orientation": "horizontal"
    },
    "customerName": {
      "type": "vux-input-property",
      "inputMode": "text",
      "validations": {
        "required": true,
        "maxlength": 50
      },
      "default": "John Doe"
    },
    "customerEmail": {
      "type": "vux-input-property",
      "inputMode": "email",
      "validations": {
        "required": true,
        "pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
      },
      "default": "john.doe@example.com"
    },
  },
  "orderDetails": {
    "type": "vux-complex-property",
    "layout": {
      "orientation": "vertical"
    },
    "orderId": {
      "type": "vux-input-property",
      "inputMode": "text",
      "validations": {
        "required": true
      },
      "default": "ORD12345"
    },
    "orderDate": {
      "type": "vux-input-property",
      "inputMode": "date",
      "validations": {
        "required": true
      },
      "default": "2023-01-01"
    }
  }
}

```

### Explanation
- **`customerDetails`**: A complex property grouping customer-related fields.
  - `customerName`: A required text input with a maximum length of 50 characters.
  - `customerEmail`: A required email input with a regex pattern for validation.
- **`orderDetails`**: A complex property grouping order-related fields.
  - `orderId`: A required text input for the order ID.
  - `orderDate`: A required date input for the order date.

---

### `VuxComplexProperty`
Represents a complex property in the VUX framework. Complex properties are used for grouping or organizing other properties.

- **Properties**:
  - `type` (Required): Specifies the type of the complex property.
  - `layout` (Optional): The layout configuration for the complex property.
  - `actions` (Optional): A list of actions associated with the complex property.
  - Additional metadata or configuration can also be included.

**Example Metadata:**
```json
{
  "type": "vux-complex-property",
  "layout": {
    "orientation": "horizontal"
  },
  "customerName": {
    "type": "vux-input-property",
    "inputMode": "text",
    "validations": {
      "required": true,
      "maxlength": 50
    },
    "default": "John Doe"
  },
  "customerEmail": {
    "type": "vux-input-property",
    "inputMode": "email",
    "validations": {
      "required": true,
      "pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
    },
    "default": "john.doe@example.com"
  }
}
```

---

### `VuxComplexPropertyLayout`
Represents the layout configuration for a complex property.

- **Properties**:
  - `placeholder` (Optional): Placeholder property to satisfy linting rules.
  - `orientation` (Optional): The orientation of the layout (`horizontal` or `vertical`).

**Example Metadata:**
```json
{
  "orientation": "horizontal",
  "placeholder": true
}
```

---

### `VuxProperty`
Represents the base structure for a VUX property.

- **Properties**:
  - `type` (Required): The type of the property.
  - `resourceKey` (Optional): The resource key associated with the property.

**Example Metadata:**
```json
{
  "type": "vux-property",
  "resourceKey": "customerName"
}
```

---

### `VuxInputProperty`
Represents a base input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): The input mode of the property.
  - `layout` (Optional): The layout configuration for the input property.
  - `validations` (Optional): The validation rules for the input property.

---

### `VuxTextInputProperty`
Represents a text input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): Must be `InputMode.TEXT`.
  - `validations` (Optional): Validation rules for the text input property.
  - `layout` (Optional): Layout configuration for the text input property.

**Example Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "text",
  "validations": {
    "required": true,
    "maxlength": 50
  },
  "default": "Default Text"
}
```

**Example Utility Functions:**
```typescript
import { isVuxTextInputProperty, asVuxTextInputProperty } from './vuxMetadata';

const property = {
  type: "vux-input-property",
  inputMode: "text",
  validations: { required: true },
};

if (isVuxTextInputProperty(property)) {
  console.log(property.validations.required); // Output: true
}

try {
  const textInput = asVuxTextInputProperty(property);
  console.log(textInput.validations.required); // Output: true
} catch (error) {
  console.error(error.message);
}
```

---

### `VuxTextAreaInputProperty`
Represents a textarea input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): Must be `InputMode.TEXTAREA`.
  - `textareaRows` (Optional): Number of rows in the textarea.
  - `validations` (Optional): Validation rules for the textarea input property.

**Example Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "textarea",
  "validations": {
    "maxlength": 500
  },
  "default": "This is a long text."
}
```

**Example Utility Functions:**
```typescript
import { isVuxTextAreaInputProperty, asVuxTextAreaInputProperty } from './vuxMetadata';

const property = {
  type: "vux-input-property",
  inputMode: "textarea",
  validations: { maxlength: 500 },
};

if (isVuxTextAreaInputProperty(property)) {
  console.log(property.validations.maxlength); // Output: 500
}

try {
  const textAreaInput = asVuxTextAreaInputProperty(property);
  console.log(textAreaInput.validations.maxlength); // Output: 500
} catch (error) {
  console.error(error.message);
}
```

---

### `VuxUrlInputProperty`
Represents a URL input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): Must be `InputMode.URL`.
  - `validations` (Optional): Validation rules for the URL input property.

**Example Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "url",
  "validations": {
    "required": true,
    "pattern": "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$"
  },
  "default": "https://example.com"
}
```

**Example Utility Functions:**
```typescript
import { isVuxUrlInputProperty, asVuxUrlInputProperty } from './vuxMetadata';

const property = {
  type: "vux-input-property",
  inputMode: "url",
  validations: { required: true },
};

if (isVuxUrlInputProperty(property)) {
  console.log(property.validations.required); // Output: true
}

try {
  const urlInput = asVuxUrlInputProperty(property);
  console.log(urlInput.validations.required); // Output: true
} catch (error) {
  console.error(error.message);
}
```

---

### `VuxEmailInputProperty`
Represents an email input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): Must be `InputMode.EMAIL`.
  - `validations` (Optional): Validation rules for the email input property.

**Example Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "email",
  "validations": {
    "required": true,
    "pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
  },
  "default": "example@example.com"
}
```

**Example Utility Functions:**
```typescript
import { isVuxEmailInputProperty, asVuxEmailInputProperty } from './vuxMetadata';

const property = {
  type: "vux-input-property",
  inputMode: "email",
  validations: { required: true },
};

if (isVuxEmailInputProperty(property)) {
  console.log(property.validations.required); // Output: true
}

try {
  const emailInput = asVuxEmailInputProperty(property);
  console.log(emailInput.validations.required); // Output: true
} catch (error) {
  console.error(error.message);
}
```

---

### `VuxOptionsProperty`
Represents an options property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the options property.
  - `layout` (Required): Layout configuration for the options property.
  - `mode` (Required): Mode of the options property (`static` or `dynamic`).
  - `multiple` (Optional): Whether multiple options can be selected.
  - `options` (Optional): The options available for selection.

**Example Metadata:**
```json
{
  "type": "vux-options-property",
  "layout": {
    "renderAs": "dropdown"
  },
  "mode": "static",
  "multiple": false,
  "options": {
    "option1": "Option 1",
    "option2": "Option 2"
  }
}
```

**Example Utility Functions:**
```typescript
import { isVuxOptionsProperty, asVuxOptionsProperty } from './vuxMetadata';

const property = {
  type: "vux-options-property",
  layout: { renderAs: "dropdown" },
  mode: "static",
  options: { option1: "Option 1", option2: "Option 2" },
};

if (isVuxOptionsProperty(property)) {
  console.log(property.options); // Output: { option1: "Option 1", option2: "Option 2" }
}

try {
  const optionsProperty = asVuxOptionsProperty(property);
  console.log(optionsProperty.options); // Output: { option1: "Option 1", option2: "Option 2" }
} catch (error) {
  console.error(error.message);
}
```

---

### `VuxReadonlyInputProperty`
Represents a readonly input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): Must be `InputMode.READONLY`.
  - `default` (Optional): Default value for the readonly input property.

**Example Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "readonly",
  "default": "Read-only Value"
}
```

**Example Utility Functions:**
```typescript
import { isVuxReadonlyInputProperty, asVuxReadonlyInputProperty } from './vuxMetadata';

const property = {
  type: "vux-input-property",
  inputMode: "readonly",
  default: "Read-only Value",
};

if (isVuxReadonlyInputProperty(property)) {
  console.log(property.default); // Output: "Read-only Value"
}

try {
  const readonlyInput = asVuxReadonlyInputProperty(property);
  console.log(readonlyInput.default); // Output: "Read-only Value"
} catch (error) {
  console.error(error.message);
}
```

---

### `VuxNumericInputProperty`
Represents a numeric input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): Must be `InputMode.NUMERIC`.
  - `validations` (Optional): Validation rules for the numeric input property.

**Example Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "numeric",
  "validations": {
    "required": true,
    "maxlength": 10
  },
  "default": 12345
}
```

**Example Utility Functions:**
```typescript
import { isVuxNumericInputProperty, asVuxNumericInputProperty } from './vuxMetadata';

const property = {
  type: "vux-input-property",
  inputMode: "numeric",
  validations: { required: true },
};

if (isVuxNumericInputProperty(property)) {
  console.log(property.validations.required); // Output: true
}

try {
  const numericInput = asVuxNumericInputProperty(property);
  console.log(numericInput.validations.required); // Output: true
} catch (error) {
  console.error(error.message);
}
```

---

### `VuxDecimalInputProperty`
Represents a decimal input property in the VUX framework.

- **Properties**:
  - `type` (Required): The type of the input property.
  - `inputMode` (Required): Must be `InputMode.DECIMAL`.
  - `validations` (Optional): Validation rules for the decimal input property.

**Example Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "decimal",
  "validations": {
    "required": true
  },
  "default": 123.45
}
```

**Example Utility Functions:**
```typescript
import { isVuxDecimalInputProperty, asVuxDecimalInputProperty } from './vuxMetadata';

const property = {
  type: "vux-input-property",
  inputMode: "decimal",
  validations: { required: true },
};

if (isVuxDecimalInputProperty(property)) {
  console.log(property.validations.required); // Output: true
}

try {
  const decimalInput = asVuxDecimalInputProperty(property);
  console.log(decimalInput.validations.required); // Output: true
} catch (error) {
  console.error(error.message);
}
```

---

### Input Types with Snippets

#### Text Input
**Data:**
```json
{
  "textInput": "Default Text"
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "text",
  "validations": {
    "required": true,
    "maxlength": 50
  },
  "default": "Default Text"
}
```

**i18n:**
```json
{
  "textInput": {
    "label": "Text Input",
    "label_tooltip": "Enter text here.",
    "info_text": "This is a required field.",
    "placeholder": "Enter text"
  }
}
```

---

#### Email Input
**Data:**
```json
{
  "emailInput": "example@example.com"
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "email",
  "validations": {
    "required": true,
    "pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
  },
  "default": "example@example.com"
}
```

**i18n:**
```json
{
  "emailInput": {
    "label": "Email Input",
    "label_tooltip": "Enter a valid email address.",
    "info_text": "This field requires a valid email.",
    "placeholder": "Enter email"
  }
}
```

---

#### URL Input
**Data:**
```json
{
  "urlInput": "https://example.com"
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "url",
  "validations": {
    "required": true,
    "pattern": "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$"
  },
  "default": "https://example.com"
}
```

**i18n:**
```json
{
  "urlInput": {
    "label": "URL Input",
    "label_tooltip": "Enter a valid URL.",
    "info_text": "This field requires a valid URL.",
    "placeholder": "Enter URL"
  }
}
```

---

#### Numeric Input
**Data:**
```json
{
  "numericInput": 12345
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "numeric",
  "validations": {
    "required": true,
    "maxlength": 10
  },
  "default": 12345
}
```

**i18n:**
```json
{
  "numericInput": {
    "label": "Numeric Input",
    "label_tooltip": "Enter a numeric value.",
    "info_text": "This field accepts only numbers.",
    "placeholder": "Enter number"
  }
}
```

---

#### Date Input
**Data:**
```json
{
  "dateInput": "2023-01-01"
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "date",
  "validations": {
    "required": true
  },
  "default": "2023-01-01"
}
```

**i18n:**
```json
{
  "dateInput": {
    "label": "Date Input",
    "label_tooltip": "Select a date.",
    "info_text": "This field requires a valid date.",
    "placeholder": "YYYY-MM-DD"
  }
}
```

---

#### Readonly Input
**Data:**
```json
{
  "readonlyInput": "Read-only Value"
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "readonly",
  "default": "Read-only Value"
}
```

**i18n:**
```json
{
  "readonlyInput": {
    "label": "Readonly Input",
    "label_tooltip": "This field is read-only.",
    "info_text": "You cannot modify this field.",
    "placeholder": ""
  }
}
```

---

#### Checkbox Input
**Data:**
```json
{
  "checkboxInput": true
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "checkbox",
  "default": true
}
```

**i18n:**
```json
{
  "checkboxInput": {
    "label": "Checkbox Input",
    "label_tooltip": "Check this box if applicable.",
    "info_text": "This is a boolean field.",
    "placeholder": ""
  }
}
```

---

#### Toggle Input
**Data:**
```json
{
  "toggleInput": false
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "toggle",
  "default": false
}
```

**i18n:**
```json
{
  "toggleInput": {
    "label": "Toggle Input",
    "label_tooltip": "Toggle this switch.",
    "info_text": "This is a boolean toggle field.",
    "placeholder": ""
  }
}
```

---

#### Textarea Input
**Data:**
```json
{
  "textareaInput": "This is a long text."
}
```

**Metadata:**
```json
{
  "type": "vux-input-property",
  "inputMode": "textarea",
  "validations": {
    "maxlength": 500
  },
  "default": "This is a long text."
}
```

**i18n:**
```json
{
  "textareaInput": {
    "label": "Textarea Input",
    "label_tooltip": "Enter long text here.",
    "info_text": "This field accepts long text.",
    "placeholder": "Enter text"
  }
}
```

---

### `InputMode`
An enum defining the input modes available for VUX properties. Possible values include:
- `TEXT`
- `EMAIL`
- `SEARCH`
- `TEL`
- `URL`
- `NONE`
- `NUMERIC`
- `DECIMAL`
- `TEXTAREA`
- `READONLY`
- `CHECKBOX`
- `TOGGLE`
- `DATE`
- `TIME`
- `DATETIME`

---

### Utility Functions

#### Complex Property Methods

#### `isVuxComplexProperty(property: VuxProperty): boolean`
Checks if the provided property is a `VuxComplexProperty`.

#### `asVuxComplexProperty(property: VuxProperty): VuxComplexProperty`
Ensures the provided property is a `VuxComplexProperty`. Throws an error if the check fails.

---

#### Input Property Methods

#### `isVuxInputProperty(property: VuxProperty): boolean`
Checks if the provided property is a `VuxInputProperty`.

#### `asVuxInputProperty(property: VuxProperty): VuxInputProperty`
Ensures the provided property is a `VuxInputProperty`. Throws an error if the check fails.

---

#### Text Input Property Methods

#### `isVuxTextInputProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxTextInputProperty`.

#### `asVuxTextInputProperty(property: VuxInputProperty): VuxTextInputProperty`
Ensures the provided property is a `VuxTextInputProperty`. Throws an error if the check fails.

---

#### Text Area Input Property Methods

#### `isVuxTextAreaInputProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxTextAreaInputProperty`.

#### `asVuxTextAreaInputProperty(property: VuxInputProperty): VuxTextAreaInputProperty`
Ensures the provided property is a `VuxTextAreaInputProperty`. Throws an error if the check fails.

---

#### URL Input Property Methods

#### `isVuxUrlInputProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxUrlInputProperty`.

#### `asVuxUrlInputProperty(property: VuxInputProperty): VuxUrlInputProperty`
Ensures the provided property is a `VuxUrlInputProperty`. Throws an error if the check fails.

---

#### Email Input Property Methods

#### `isVuxEmailInputProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxEmailInputProperty`.

#### `asVuxEmailInputProperty(property: VuxInputProperty): VuxEmailInputProperty`
Ensures the provided property is a `VuxEmailInputProperty`. Throws an error if the check fails.

---

#### Numeric Input Property Methods

#### `isVuxNumericInputProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxNumericInputProperty`.

#### `asVuxNumericInputProperty(property: VuxInputProperty): VuxNumericInputProperty`
Ensures the provided property is a `VuxNumericInputProperty`. Throws an error if the check fails.

---

#### Decimal Input Property Methods

#### `isVuxDecimalInputProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxDecimalInputProperty`.

#### `asVuxDecimalInputProperty(property: VuxInputProperty): VuxDecimalInputProperty`
Ensures the provided property is a `VuxDecimalInputProperty`. Throws an error if the check fails.

---

#### Readonly Input Property Methods

#### `isVuxReadonlyInputProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxReadonlyInputProperty`.

#### `asVuxReadonlyInputProperty(property: VuxInputProperty): VuxReadonlyInputProperty`
Ensures the provided property is a `VuxReadonlyInputProperty`. Throws an error if the check fails.

---

#### Options Property Methods

#### `isVuxOptionsProperty(property: VuxInputProperty): boolean`
Checks if the provided property is a `VuxOptionsProperty`.

#### `asVuxOptionsProperty(property: VuxInputProperty): VuxOptionsProperty`
Ensures the provided property is a `VuxOptionsProperty`. Throws an error if the check fails.

