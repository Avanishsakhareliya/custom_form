
import { FormConfig, FormData } from '@/types/form';
import FormElement from './FormElement';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FormPreviewProps {
  formConfig: FormConfig;
  formData: FormData;
  onChange: (id: string, value: string | string[] | boolean | File | null) => void;
  onSubmit: () => void;
}

const FormPreview = ({ formConfig, formData, onChange, onSubmit }: FormPreviewProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-fade-in">
      <Card className={cn(
        "overflow-hidden transition-all duration-500",
        "border-primary/10 shadow-lg shadow-primary/5"
      )}>
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="text-2xl">{formConfig.title}</CardTitle>
          {formConfig.description && (
            <CardDescription>{formConfig.description}</CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 pt-8">
            <div className="space-y-6">
              {formConfig.elements.map((element) => (
                <FormElement
                  key={element.id}
                  element={element}
                  isPreview={true}
                  formData={formData}
                  onChange={onChange}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-6 pt-0">
            <Button type="submit" className="transition-all duration-300 hover:scale-[1.03]">
              <Check className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FormPreview;
