
import React from 'react';

interface BaseNodeProps {
  label: string;
  selected?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({ label, selected, children, icon }) => {
  return (
    <div className={`min-w-[200px] bg-zinc-900 border-2 rounded-xl overflow-hidden shadow-2xl transition-all ${
      selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-zinc-800'
    }`}>
      <div className="px-3 py-2 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-zinc-400">{icon}</span>}
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">{label}</span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        {children}
      </div>
    </div>
  );
};
