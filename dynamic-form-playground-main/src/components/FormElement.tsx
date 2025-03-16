
import { FormElement as FormElementType, FormData } from '@/types/form';
import { cn } from '@/lib/utils';
import { 
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Label
} from "@/components/ui";
import { Upload } from "lucide-react";

interface FormElementProps {
  element: FormElementType;
  isPreview?: boolean;
  isSelected?: boolean;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  formData?: FormData;
  onChange?: (id: string, value: string | string[] | boolean | File | null) => void;
}

const FormElement = ({ 
  element, 
  isPreview = false, 
  isSelected = false,
  onClick, 
  onDelete,
  formData = {},
  onChange
}: FormElementProps) => {
  const { id, type, label, placeholder, options, required, disabled, validation } = element;

  const value = formData[id] ?? element.defaultValue ?? '';
  
  const handleChange = (val: string | string[] | boolean | File | null) => {
    if (onChange) {
      onChange(id, val);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) {
      onChange(id, file);
    }
  };

  const renderElement = () => {
    switch (type) {
      case 'heading':
        return <h2 className="text-2xl font-bold mb-2">{label}</h2>;
        
      case 'paragraph':
        return <p className="text-muted-foreground mb-4">{label}</p>;
        
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={id}
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled || (!isPreview && !onClick)}
              className={cn(
                "transition-all duration-200",
                isPreview && "focus:ring-2 focus:ring-primary/30"
              )}
            />
          </div>
        );
        
      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="email"
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled || (!isPreview && !onClick)}
              className={cn(
                "transition-all duration-200",
                isPreview && "focus:ring-2 focus:ring-primary/30"
              )}
            />
          </div>
        );
        
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={id}
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled || (!isPreview && !onClick)}
              className={cn(
                "min-h-[100px] transition-all duration-200",
                isPreview && "focus:ring-2 focus:ring-primary/30"
              )}
            />
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              disabled={disabled || (!isPreview && !onClick)}
              value={value as string}
              onValueChange={handleChange}
            >
              <SelectTrigger id={id} className={cn(
                "transition-all duration-200",
                isPreview && "focus:ring-2 focus:ring-primary/30"
              )}>
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={value as boolean}
              onCheckedChange={handleChange}
              disabled={disabled || (!isPreview && !onClick)}
              className={cn(
                "transition-all duration-200",
                isPreview && "focus:ring-2 focus:ring-primary/30"
              )}
            />
            <Label htmlFor={id} className="cursor-pointer">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            <Label>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value as string}
              onValueChange={handleChange}
              disabled={disabled || (!isPreview && !onClick)}
              className="flex flex-col space-y-1"
            >
              {options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value}
                    id={`${id}-${option.value}`}
                    className={cn(
                      "transition-all duration-200",
                      isPreview && "focus:ring-2 focus:ring-primary/30"
                    )}
                  />
                  <Label htmlFor={`${id}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'file':
        return (
          <div className="space-y-2">
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="flex flex-col items-center justify-center w-full">
              <label
                htmlFor={id}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
                  isPreview && "focus-within:ring-2 focus-within:ring-primary/30"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {value instanceof File ? value.name : (placeholder || "Upload a file")}
                  </p>
                </div>
                <input
                  id={id}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={disabled || (!isPreview && !onClick)}
                />
              </label>
              {value instanceof File && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Selected: {value.name} ({(value.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "form-element",
        isSelected && "selected",
        !isPreview && "cursor-pointer"
      )}
      onClick={() => !isPreview && onClick && onClick(id)}
    >
      {renderElement()}
    </div>
  );
};

export default FormElement;
