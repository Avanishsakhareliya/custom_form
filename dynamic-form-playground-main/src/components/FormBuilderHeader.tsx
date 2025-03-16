
import { FormConfig } from '@/types/form';
import { 
  Button,
  Input,
  Textarea,
  Separator
} from '@/components/ui';
import { 
  Eye, 
  EyeOff, 
  Save, 
  Download, 
  Upload,
  RotateCcw,
  Settings
} from 'lucide-react';

interface FormBuilderHeaderProps {
  formConfig: FormConfig;
  previewMode: boolean;
  onTogglePreview: () => void;
  onUpdateFormConfig: (updates: Partial<FormConfig>) => void;
  onExportConfig: () => void;
  onImportConfig: (config: FormConfig) => void;
  onSubmit: () => void;
}

const FormBuilderHeader = ({
  formConfig,
  previewMode,
  onTogglePreview,
  onUpdateFormConfig,
  onExportConfig,
  onImportConfig,
  onSubmit
}: FormBuilderHeaderProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportConfig(json);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };

  return (
    <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Form Builder</h1>
            <Separator orientation="vertical" className="h-6" />
            <div className="text-sm text-muted-foreground">
              {previewMode ? 'Preview Mode' : 'Edit Mode'}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {previewMode ? (
              <>
                <Button variant="outline" onClick={onTogglePreview}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Form
                </Button>
                <Button onClick={onSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Form
                </Button>
              </>
            ) : (
              <>
                
                <Button onClick={onTogglePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </>
            )}
          </div>
        </div>
        
        {!previewMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor="form-title" className="text-sm font-medium">
                Form Title
              </label>
              <Input
                id="form-title"
                value={formConfig.title}
                onChange={(e) => onUpdateFormConfig({ title: e.target.value })}
                placeholder="Enter form title"
                className="text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="form-description" className="text-sm font-medium">
                Form Description
              </label>
              <Textarea
                id="form-description"
                value={formConfig.description || ''}
                onChange={(e) => onUpdateFormConfig({ description: e.target.value })}
                placeholder="Enter form description"
                rows={1}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilderHeader;
