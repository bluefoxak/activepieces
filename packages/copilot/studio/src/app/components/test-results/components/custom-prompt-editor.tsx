import { Info } from 'lucide-react';

interface CustomPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  type: 'planner' | 'step';
}

const PLANNER_VARIABLES = [
  {
    name: 'available_pieces',
    description: 'List of available pieces with their descriptions',
    example: '- Piece1: Description\n- Piece2: Description'
  },
  {
    name: 'user_prompt',
    description: 'The original user request',
    example: 'Create a flow that sends emails'
  }
];

const STEP_VARIABLES = [
  {
    name: 'step_context',
    description: 'The context for step generation including piece metadata, previous steps, and conditions',
    example: 'Piece Information:\n- Name: Discord\n- Description: Send messages...\nPrevious Steps:\n- step_1 (TRIGGER)'
  }
];

export const CustomPromptEditor = ({ value, onChange, type }: CustomPromptEditorProps) => {
  const variables = type === 'planner' ? PLANNER_VARIABLES : STEP_VARIABLES;

  const insertVariable = (variable: string) => {
    const textArea = document.getElementById('customPrompt') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const currentValue = textArea.value;
      const newValue = currentValue.substring(0, start) + 
        `{{${variable}}}` + 
        currentValue.substring(end);
      onChange(newValue);
      
      // Reset cursor position after the inserted variable
      setTimeout(() => {
        textArea.focus();
        const newPosition = start + variable.length + 4; // +4 for {{ and }}
        textArea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700">
          {type === 'planner' ? 'Custom Planner Prompt' : 'Custom Step Generation Prompt'}
        </label>
        <span className="text-xs text-gray-500">
          {value ? `${value.length} chars` : 'Optional'}
        </span>
      </div>

      {/* Prompt Textarea */}
      <textarea
        id="customPrompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter a custom prompt for ${type === 'planner' ? 'the planner' : 'step generation'}...`}
        className="w-full h-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 placeholder-gray-400"
      />

      {/* Variables Section */}
      <div className="bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-100">
          <Info className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">Available Variables</span>
        </div>
        <div className="p-1.5 grid grid-cols-2 gap-1">
          {variables.map((variable) => (
            <button
              key={variable.name}
              type="button"
              onClick={() => insertVariable(variable.name)}
              className="text-left text-xs p-1.5 hover:bg-gray-100 rounded group flex items-center justify-between gap-1"
              title={variable.description}
            >
              <code className="text-blue-600 font-mono">{`{{${variable.name}}}`}</code>
              <Info className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 