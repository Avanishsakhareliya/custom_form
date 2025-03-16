
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormBuilder from '@/components/FormBuilder';
import { toast } from 'sonner';

const Index = () => {
  useEffect(() => {
    // Welcome toast
    toast.success('Welcome to the Form Builder!', {
      description: 'Drag and drop elements to create your form.',
      duration: 5000,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DndProvider backend={HTML5Backend}>
        <FormBuilder />
      </DndProvider>
    </div>
  );
};

export default Index;
