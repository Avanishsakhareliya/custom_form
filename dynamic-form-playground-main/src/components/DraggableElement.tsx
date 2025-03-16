
import { ElementType } from '@/types/form';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { 
  Type, 
  Mail, 
  AlignLeft, 
  List, 
  CheckSquare, 
  Circle, 
  File, 
  Heading1,
  TextQuote
} from 'lucide-react';

type DraggableElementProps = {
  type: ElementType;
  label: string;
  onAdd?: (type: ElementType) => void;
};

const getIconForType = (type: ElementType) => {
  switch (type) {
    case 'text':
      return <Type className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'textarea':
      return <AlignLeft className="h-4 w-4" />;
    case 'select':
      return <List className="h-4 w-4" />;
    case 'checkbox':
      return <CheckSquare className="h-4 w-4" />;
    case 'radio':
      return <Circle className="h-4 w-4" />;
    case 'file':
      return <File className="h-4 w-4" />;
    case 'heading':
      return <Heading1 className="h-4 w-4" />;
    case 'paragraph':
      return <TextQuote className="h-4 w-4" />;
    default:
      return <Type className="h-4 w-4" />;
  }
};

const DraggableElement = ({ type, label, onAdd }: DraggableElementProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    if (onAdd) {
      onAdd(type);
    }
  };

  return (
    <div
      ref={drag}
      className={cn(
        "draggable-element group",
        isDragging && "opacity-50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
        {getIconForType(type)}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default DraggableElement;
