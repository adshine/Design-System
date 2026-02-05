
import React from 'react';
import { NodeType } from '../types.ts';
import { useStore } from '../store.ts';
import { Palette, Hash, Layers, Calculator, Eye, Box, Settings2, Plus, Sparkles } from 'lucide-react';

const NODE_TYPES = [
  { type: NodeType.COLOR_SOURCE, label: 'Color Input', icon: <Palette size={16} />, color: 'text-pink-400' },
  { type: NodeType.AI_GEN, label: 'AI Generator', icon: <Sparkles size={16} />, color: 'text-fuchsia-400' },
  { type: NodeType.NUMBER_SOURCE, label: 'Number Input', icon: <Hash size={16} />, color: 'text-blue-400' },
  { type: NodeType.MATH, label: 'Math Logic', icon: <Calculator size={16} />, color: 'text-indigo-400' },
  { type: NodeType.MIX, label: 'Color Mixer', icon: <Settings2 size={16} />, color: 'text-amber-400' },
  { type: NodeType.SCALE_GEN, label: 'Scale Generator', icon: <Layers size={16} />, color: 'text-teal-400' },
  { type: NodeType.CONTRAST, label: 'Contrast Checker', icon: <Eye size={16} />, color: 'text-purple-400' },
  { type: NodeType.OUTPUT, label: 'Output Token', icon: <Box size={16} />, color: 'text-emerald-400' },
];

export const Sidebar: React.FC = () => {
  const addNode = useStore((s) => s.addNode);

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col h-full backdrop-blur-xl">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Graph Engine</h2>
        <p className="text-[11px] text-zinc-400 font-medium">Algorithmic Design Tokens</p>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div>
          <h3 className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-wider">Node Library</h3>
          <div className="grid gap-2">
            {NODE_TYPES.map((node) => (
              <button
                key={node.type}
                onClick={() => addNode(node.type, { x: 400, y: 300 })}
                className="group flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`${node.color} group-hover:scale-110 transition-transform`}>
                    {node.icon}
                  </span>
                  <span className="text-xs font-medium text-zinc-300">{node.label}</span>
                </div>
                <Plus size={14} className="text-zinc-600 group-hover:text-zinc-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 text-[10px] text-zinc-500">
        <p>© 2024 Graph Engine v0.1-alpha</p>
        <p className="mt-1">Built with React Flow & Gemini</p>
      </div>
    </div>
  );
};
