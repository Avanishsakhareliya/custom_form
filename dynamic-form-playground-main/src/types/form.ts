
export type ValidationRule = {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'fileType' | 'fileSize';
  value?: string | number | RegExp;
  message: string;
};

export type ElementType = 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'heading' | 'paragraph';

export type FormElement = {
  id: string;
  type: ElementType;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string | string[] | boolean;
  validation?: ValidationRule[];
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

export type FormConfig = {
  id: string;
  title: string;
  description?: string;
  elements: FormElement[];
};

export type FormData = Record<string, string | string[] | boolean | File | null>;
