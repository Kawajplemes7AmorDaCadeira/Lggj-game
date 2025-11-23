import React from 'react';
import { ModTask } from '../types';
import { Check, Pin, ListTodo } from 'lucide-react';

interface Props {
  tasks: ModTask[];
  onComplete: (taskId: string) => void;
  className?: string;
}

const TaskBoard: React.FC<Props> = ({ tasks, onComplete, className }) => {
  return (
    <div className={`bg-[#fff9c4] text-gray-800 rounded-sm shadow-lg transform rotate-1 border-t-8 border-[#fbc02d] flex flex-col ${className}`}>
      
      {/* Sticky Note Header */}
      <div className="px-4 py-2 border-b border-[#f9a825]/20 flex justify-between items-center">
        <h3 className="font-handwriting font-bold text-lg flex items-center gap-2 text-gray-800">
          <Pin size={16} className="text-red-500 fill-red-500 transform -rotate-45" />
          Tarefas do Mod
        </h3>
        <span className="text-xs font-bold text-gray-500">{tasks.length} Pendentes</span>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar-light">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
            <ListTodo size={32} className="mb-2" />
            <p className="font-handwriting text-xl">Nada por agora...</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="group flex items-start justify-between gap-2 border-b border-yellow-600/20 pb-2 last:border-0">
              <div className="flex flex-col">
                <span className="font-handwriting text-lg leading-tight text-gray-900">{task.description}</span>
                <span className="text-[10px] font-bold text-yellow-700/70 bg-yellow-200/50 self-start px-1 rounded mt-1">+{task.xpReward} XP</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-sm"
              >
                <Check size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Decorative fold */}
      <div className="absolute bottom-0 right-0 border-b-[20px] border-r-[20px] border-b-[#fbc02d] border-r-transparent shadow-[-2px_-2px_4px_rgba(0,0,0,0.1)] transform rotate-90"></div>
    </div>
  );
};

export default TaskBoard;