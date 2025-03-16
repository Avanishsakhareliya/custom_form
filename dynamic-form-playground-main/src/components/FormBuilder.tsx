
import { useState, useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ElementType } from '@/types/form';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import DraggableElement from './DraggableElement';
import FormElement from './FormElement';
import FormElementConfig from './FormElementConfig';
import FormPreview from './FormPreview';
import FormBuilderHeader from './FormBuilderHeader';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  ScrollArea,
  Separator,
} from "@/components/ui";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const FORM_ELEMENTS: { type: ElementType; label: string }[] = [
  { type: 'text', label: 'Text Input' },
  { type: 'email', label: 'Email Input' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'select', label: 'Select Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'radio', label: 'Radio Group' },
  { type: 'file', label: 'File Upload' },
  { type: 'heading', label: 'Heading' },
  { type: 'paragraph', label: 'Paragraph' }
];

const FormDropArea = ({ onDrop, children }: { onDrop: (type: ElementType) => void; children: React.ReactNode }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FORM_ELEMENT',
    drop: (item: { type: ElementType }) => {
      onDrop(item.type);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop} 
      className={cn(
        "dropzone min-h-[300px] p-4 border-2 border-dashed rounded-lg transition-all duration-300 overflow-auto",
        isOver && "active"
      )}
    >
      {children}
    </div>
  );
};

const FormBuilder = () => {
  const {
    formConfig,
    selectedElementId,
    selectedElement,
    previewMode,
    formData,
    setSelectedElementId,
    addElement,
    updateElement,
    removeElement,
    updateFormConfig,
    togglePreviewMode,
    handleFormDataChange,
    handleFormSubmit,
    exportFormConfig,
    importFormConfig
  } = useFormBuilder();

  const formAreaRef = useRef<HTMLDivElement>(null);

  const handleElementDrop = (type: ElementType) => {
    const newElementId = addElement(type);
    
    // Scroll to the new element
    setTimeout(() => {
      const element = document.getElementById(`form-element-${newElementId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleElementAdd = (type: ElementType) => {
    const newElementId = addElement(type);
    
    // Scroll to the new element
    setTimeout(() => {
      const element = document.getElementById(`form-element-${newElementId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };
  
  if (previewMode) {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-background flex flex-col">
          <FormBuilderHeader
            formConfig={formConfig}
            previewMode={previewMode}
            onTogglePreview={togglePreviewMode}
            onUpdateFormConfig={updateFormConfig}
            onExportConfig={exportFormConfig}
            onImportConfig={importFormConfig}
            onSubmit={handleFormSubmit}
          />
          
          <main className="flex-1 py-4">
            <FormPreview
              formConfig={formConfig}
              formData={formData}
              onChange={handleFormDataChange}
              onSubmit={handleFormSubmit}
            />
          </main>
        </div>
      </DndProvider>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background flex flex-col">
        <FormBuilderHeader
          formConfig={formConfig}
          previewMode={previewMode}
          onTogglePreview={togglePreviewMode}
          onUpdateFormConfig={updateFormConfig}
          onExportConfig={exportFormConfig}
          onImportConfig={importFormConfig}
          onSubmit={handleFormSubmit}
        />
        
        <main className="flex-1 container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="sticky top-[140px]">
                <Tabs defaultValue="elements">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="elements">Elements</TabsTrigger>
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="elements" className="mt-0">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle>Form Elements</CardTitle>
                        <CardDescription>
                          Drag these elements to the form area or click to add
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[60vh] pr-4">
                          <div className="grid grid-cols-1 gap-2">
                            {FORM_ELEMENTS.map((element) => (
                              <DraggableElement
                                key={element.type}
                                type={element.type}
                                label={element.label}
                                onAdd={handleElementAdd}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="properties" className="mt-0">
                    <AnimatePresence mode="wait">
                      {selectedElement ? (
                        <motion.div
                          key={selectedElement.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormElementConfig
                            element={selectedElement}
                            onUpdate={updateElement}
                            onDelete={removeElement}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle>Element Properties</CardTitle>
                              <CardDescription>
                                Select an element to edit its properties
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                <p>No element selected</p>
                                <p className="text-sm mt-2">Click on an element in the form to edit it</p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="lg:col-span-9 order-1 lg:order-2">
              <Card>
                <CardHeader>
                  <CardTitle>Form Layout</CardTitle>
                  <CardDescription>
                    Drag and drop elements or click to edit their properties
                  </CardDescription>
                </CardHeader>
                <CardContent ref={formAreaRef}>
                  <FormDropArea onDrop={handleElementDrop}>
                    {formConfig.elements.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                        <p>Drag elements here to start building your form</p>
                        <p className="text-sm mt-2">Or click on elements in the sidebar to add them</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {formConfig.elements.map((element, index) => (
                          <motion.div
                            key={element.id}
                            id={`form-element-${element.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ 
                              duration: 0.3,
                              delay: index * 0.05
                            }}
                          >
                            <FormElement
                              element={element}
                              isSelected={element.id === selectedElementId}
                              onClick={setSelectedElementId}
                              onDelete={removeElement}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </FormDropArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
