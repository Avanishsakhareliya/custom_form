
import { useState } from 'react';
import { FormElement as FormElementType, ValidationRule } from '@/types/form';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Button,
  Textarea,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Trash, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormElementConfigProps {
  element: FormElementType;
  onUpdate: (id: string, updates: Partial<FormElementType>) => void;
  onDelete: (id: string) => void;
}

const FormElementConfig = ({ element, onUpdate, onDelete }: FormElementConfigProps) => {
  const [newOption, setNewOption] = useState({ label: '', value: '' });
  const [newValidation, setNewValidation] = useState<{
    type: ValidationRule['type'],
    value: string,
    message: string
  }>({
    type: 'required',
    value: '',
    message: ''
  });

  const handleLabelChange = (value: string) => {
    onUpdate(element.id, { label: value });
  };

  const handlePlaceholderChange = (value: string) => {
    onUpdate(element.id, { placeholder: value });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdate(element.id, { required: checked });
  };

  const handleDisabledChange = (checked: boolean) => {
    onUpdate(element.id, { disabled: checked });
  };

  const handleAddOption = () => {
    if (!newOption.label || !newOption.value) return;
    
    const options = [...(element.options || []), newOption];
    onUpdate(element.id, { options });
    setNewOption({ label: '', value: '' });
  };

  const handleRemoveOption = (index: number) => {
    const options = [...(element.options || [])];
    options.splice(index, 1);
    onUpdate(element.id, { options });
  };

  const handleAddValidation = () => {
    if (!newValidation.type || !newValidation.message) return;
    
    // Convert value based on validation type
    let value: string | number | RegExp | undefined = newValidation.value;
    
    if (['minLength', 'maxLength', 'fileSize'].includes(newValidation.type)) {
      value = Number(newValidation.value);
    } else if (newValidation.type === 'pattern') {
      try {
        value = new RegExp(newValidation.value);
      } catch (error) {
        console.error('Invalid regex pattern:', error);
        return;
      }
    } else if (newValidation.type === 'required') {
      value = undefined;
    }
    
    const validation: ValidationRule[] = [
      ...(element.validation || []),
      {
        type: newValidation.type,
        value: value as any,
        message: newValidation.message
      }
    ];
    
    onUpdate(element.id, { validation });
    setNewValidation({ type: 'required', value: '', message: '' });
  };

  const handleRemoveValidation = (index: number) => {
    const validation = [...(element.validation || [])];
    validation.splice(index, 1);
    onUpdate(element.id, { validation });
  };

  const handleDelete = () => {
    onDelete(element.id);
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Configure {element.type}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete element</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="element-label">Label</Label>
          <Input
            id="element-label"
            value={element.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Enter label"
          />
        </div>

        {['text', 'email', 'textarea', 'select', 'file'].includes(element.type) && (
          <div className="space-y-2">
            <Label htmlFor="element-placeholder">Placeholder</Label>
            <Input
              id="element-placeholder"
              value={element.placeholder || ''}
              onChange={(e) => handlePlaceholderChange(e.target.value)}
              placeholder="Enter placeholder"
            />
          </div>
        )}

        {['select', 'radio'].includes(element.type) && (
          <div className="space-y-3">
            <Label>Options</Label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const options = [...(element.options || [])];
                      options[index].label = e.target.value;
                      onUpdate(element.id, { options });
                    }}
                    placeholder="Option label"
                    className="flex-1"
                  />
                  <Input
                    value={option.value}
                    onChange={(e) => {
                      const options = [...(element.options || [])];
                      options[index].value = e.target.value;
                      onUpdate(element.id, { options });
                    }}
                    placeholder="Option value"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove option</span>
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex-1 space-y-2">
                <Input
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                  placeholder="New option label"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  placeholder="New option value"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddOption}
                className="h-10 w-10"
                disabled={!newOption.label || !newOption.value}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add option</span>
              </Button>
            </div>
          </div>
        )}

        {element.type !== 'heading' && element.type !== 'paragraph' && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <Label>Validation</Label>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="element-required" className="cursor-pointer">Required</Label>
                <Switch
                  id="element-required"
                  checked={element.required || false}
                  onCheckedChange={handleRequiredChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="element-disabled" className="cursor-pointer">Disabled</Label>
                <Switch
                  id="element-disabled"
                  checked={element.disabled || false}
                  onCheckedChange={handleDisabledChange}
                />
              </div>
              
              <div className="space-y-3 pt-2">
                <Label>Custom Validation Rules</Label>
                <div className="space-y-2">
                  {element.validation?.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{rule.type}</div>
                        {rule.value !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            Value: {rule.value instanceof RegExp ? rule.value.toString() : rule.value}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Message: {rule.message}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveValidation(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove validation</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="validation-type">Type</Label>
                      <Select
                        value={newValidation.type}
                        onValueChange={(value) => setNewValidation({ 
                          ...newValidation, 
                          type: value as ValidationRule['type']
                        })}
                      >
                        <SelectTrigger id="validation-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">Required</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="minLength">Min Length</SelectItem>
                          <SelectItem value="maxLength">Max Length</SelectItem>
                          <SelectItem value="pattern">Pattern</SelectItem>
                          {element.type === 'file' && (
                            <>
                              <SelectItem value="fileType">File Type</SelectItem>
                              <SelectItem value="fileSize">File Size (MB)</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {newValidation.type !== 'required' && newValidation.type !== 'email' && (
                      <div className="space-y-2">
                        <Label htmlFor="validation-value">Value</Label>
                        <Input
                          id="validation-value"
                          value={newValidation.value}
                          onChange={(e) => setNewValidation({ ...newValidation, value: e.target.value })}
                          placeholder={
                            newValidation.type === 'fileType' 
                              ? "e.g., pdf,jpg,png" 
                              : newValidation.type === 'fileSize'
                              ? "Max size in MB" 
                              : "Value"
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validation-message">Error Message</Label>
                    <Input
                      id="validation-message"
                      value={newValidation.message}
                      onChange={(e) => setNewValidation({ ...newValidation, message: e.target.value })}
                      placeholder="Error message to display"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddValidation}
                    className="w-full"
                    disabled={!newValidation.type || !newValidation.message || (!['required', 'email'].includes(newValidation.type) && !newValidation.value)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add validation rule
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FormElementConfig;
