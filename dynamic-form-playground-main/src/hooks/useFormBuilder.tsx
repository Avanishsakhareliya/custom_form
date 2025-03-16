
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormConfig, FormElement, ElementType, FormData } from '@/types/form';
import { toast } from 'sonner';

export const useFormBuilder = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>({
    id: uuidv4(),
    title: 'Untitled Form',
    description: 'Form description',
    elements: []
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({});

  const addElement = useCallback((type: ElementType) => {
    const newElement: FormElement = {
      id: uuidv4(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      placeholder: type !== 'checkbox' && type !== 'radio' && type !== 'heading' && type !== 'paragraph' 
        ? `Enter ${type}...` 
        : undefined,
      required: false
    };

    if (type === 'select' || type === 'radio') {
      newElement.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ];
    }

    if (type === 'checkbox') {
      newElement.defaultValue = false;
    }

    setFormConfig(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));

    setSelectedElementId(newElement.id);
    return newElement.id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<FormElement>) => {
    setFormConfig(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    }));
  }, []);

  const removeElement = useCallback((id: string) => {
    setFormConfig(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id)
    }));

    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const moveElement = useCallback((dragIndex: number, hoverIndex: number) => {
    setFormConfig(prev => {
      const newElements = [...prev.elements];
      const draggedElement = newElements[dragIndex];
      newElements.splice(dragIndex, 1);
      newElements.splice(hoverIndex, 0, draggedElement);
      return {
        ...prev,
        elements: newElements
      };
    });
  }, []);

  const updateFormConfig = useCallback((updates: Partial<FormConfig>) => {
    setFormConfig(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const togglePreviewMode = useCallback(() => {
    setPreviewMode(prev => !prev);
    setSelectedElementId(null);
    setFormData({});
  }, []);

  const handleFormDataChange = useCallback((id: string, value: string | string[] | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  const validateForm = useCallback(() => {
    const validationErrors: Record<string, string> = {};

    formConfig.elements.forEach(element => {
      if (element.type === 'heading' || element.type === 'paragraph') return;
      
      if (element.required && !formData[element.id]) {
        validationErrors[element.id] = `${element.label} is required`;
      }

      if (element.validation && formData[element.id]) {
        element.validation.forEach(rule => {
          const value = formData[element.id];
          
          switch (rule.type) {
            case 'email':
              if (typeof value === 'string' && !/\S+@\S+\.\S+/.test(value)) {
                validationErrors[element.id] = rule.message;
              }
              break;
            case 'minLength':
              if (typeof value === 'string' && value.length < Number(rule.value)) {
                validationErrors[element.id] = rule.message;
              }
              break;
            case 'maxLength':
              if (typeof value === 'string' && value.length > Number(rule.value)) {
                validationErrors[element.id] = rule.message;
              }
              break;
            case 'pattern':
              if (typeof value === 'string' && rule.value instanceof RegExp && !rule.value.test(value)) {
                validationErrors[element.id] = rule.message;
              }
              break;
            case 'fileType':
              if (value instanceof File && rule.value && typeof rule.value === 'string') {
                const allowedTypes = rule.value.split(',').map(type => type.trim());
                const fileType = value.name.split('.').pop()?.toLowerCase() || '';
                if (!allowedTypes.includes(fileType)) {
                  validationErrors[element.id] = rule.message;
                }
              }
              break;
            case 'fileSize':
              if (value instanceof File && rule.value && typeof rule.value === 'number') {
                const maxSizeInMB = rule.value;
                const fileSizeInMB = value.size / (1024 * 1024);
                if (fileSizeInMB > maxSizeInMB) {
                  validationErrors[element.id] = rule.message;
                }
              }
              break;
          }
        });
      }
    });

    return validationErrors;
  }, [formConfig.elements, formData]);

  const handleFormSubmit = useCallback(async() => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    // Format data for display
    const formattedData = Object.entries(formData).reduce((acc, [key, value]) => {
      const element = formConfig.elements.find(el => el.id === key);
      if (!element) return acc;
      
      if (value instanceof File) {
        acc[element.label] = `File: ${value.name} (${(value.size / 1024).toFixed(2)} KB)`;
      } else {
        acc[element.label] = value;
      }
      
      return acc;
    }, {} as Record<string, any>);
    const submissionPayload = { submissionData: formattedData };

    // Display success message with form data
    try {
      const response = await fetch('http://localhost:3001/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      toast.success('Form submitted successfully!');
      console.log('Form data:', formattedData);
      console.log('Response data:', responseData);
      if (responseData.data) {
        window.location.reload()
      }
    } catch (error) {
      toast.error('Failed to submit form');
      console.error('Submission error:', error);
    }
  }, [formData, formConfig.elements, validateForm]);

  const exportFormConfig = useCallback(() => {
    try {
      const dataStr = JSON.stringify(formConfig, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${formConfig.title.toLowerCase().replace(/\s+/g, '-')}-config.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Form configuration exported successfully');
    } catch (error) {
      toast.error('Failed to export form configuration');
      console.error('Export error:', error);
    }
  }, [formConfig]);

  const importFormConfig = useCallback((config: FormConfig) => {
    try {
      setFormConfig(config);
      setSelectedElementId(null);
      setFormData({});
      toast.success('Form configuration imported successfully');
    } catch (error) {
      toast.error('Failed to import form configuration');
      console.error('Import error:', error);
    }
  }, []);

  const selectedElement = formConfig.elements.find(el => el.id === selectedElementId);

  return {
    formConfig,
    selectedElementId,
    selectedElement,
    previewMode,
    formData,
    setSelectedElementId,
    addElement,
    updateElement,
    removeElement,
    moveElement,
    updateFormConfig,
    togglePreviewMode,
    handleFormDataChange,
    handleFormSubmit,
    exportFormConfig,
    importFormConfig
  };
};
