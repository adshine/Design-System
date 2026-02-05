
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode.tsx';
import { useStore } from '../../store.ts';
import { NodeData } from '../../types.ts';
import { Palette, Hash, Layers, Calculator, Eye, Settings2, Box, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { wcagContrast } from 'culori';

export const ColorSourceNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const updateConfig = useStore((s) => s.updateNodeConfig);
  return (
    <BaseNode label="Color Input" selected={selected} icon={<Palette size={14} />}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
           <input 
            type="color" 
            value={data.config?.color || '#3b82f6'} 
            onChange={(e) => updateConfig(id, { color: e.target.value })}
            className="w-10 h-8 rounded cursor-pointer bg-zinc-800 border border-zinc-700 p-0.5"
          />
          <input 
            type="text"
            value={data.config?.color || '#3b82f6'}
            onChange={(e) => updateConfig(id, { color: e.target.value })}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-zinc-300 uppercase"
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export const NumberSourceNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const updateConfig = useStore((s) => s.updateNodeConfig);
  return (
    <BaseNode label="Value" selected={selected} icon={<Hash size={14} />}>
      <input 
        type="number" 
        value={data.config?.number || 0} 
        onChange={(e) => updateConfig(id, { number: e.target.value })}
        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
      />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export const AiGenNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const updateConfig = useStore((s) => s.updateNodeConfig);
  const [prompt, setPrompt] = useState(data.config?.prompt || 'Deep Ocean Blue');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Task: Generate a hex color code for the following theme: "${prompt}". 
        Requirement: Output ONLY the 7-character hex string (e.g., #FF0000). No labels, no descriptions.`,
      });
      
      const text = response.text?.trim() || '';
      const hexMatch = text.match(/#[0-9A-Fa-f]{6}/);
      
      if (hexMatch) {
        updateConfig(id, { value: hexMatch[0], prompt });
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (err) {
      console.error("AI Generation failed", err);
      setError("Failed to generate color. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseNode label="AI Generator" selected={selected} icon={<Sparkles size={14} className="text-fuchsia-400" />}>
      <div className="flex flex-col gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Theme or brand description..."
          className="w-full h-16 bg-zinc-950 border border-zinc-800 rounded p-2 text-[10px] text-zinc-300 focus:outline-none focus:border-fuchsia-500 resize-none placeholder:text-zinc-700"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-1.5 rounded text-[10px] font-bold transition-all shadow-lg"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {loading ? 'ANALYZING...' : 'GENERATE'}
        </button>
        {error && (
          <div className="flex items-center gap-1.5 text-[9px] text-red-400 bg-red-400/10 p-1.5 rounded border border-red-400/20">
            <AlertCircle size={10} />
            {error}
          </div>
        )}
        {data.value && !loading && (
          <div className="flex items-center justify-between mt-1 p-1.5 bg-zinc-950 rounded border border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md border border-zinc-700" style={{ backgroundColor: data.value }} />
              <span className="text-[10px] font-mono text-zinc-400 uppercase">{data.value}</span>
            </div>
            <div className="text-[9px] font-bold text-zinc-600">RESULT</div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export const ScaleGenNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  return (
    <BaseNode label="Scale Logic" selected={selected} icon={<Layers size={14} />}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1 bg-zinc-950 p-2 rounded-lg border border-zinc-800 min-h-[40px]">
          {Array.isArray(data.value) && data.value.length > 0 ? data.value.map((c, i) => (
            <div key={i} className="w-6 h-6 rounded shadow-sm border border-white/5" style={{ backgroundColor: c }} title={c} />
          )) : (
            <div className="text-[9px] text-zinc-600 italic flex items-center justify-center w-full">No scale generated</div>
          )}
        </div>
        <div className="text-[10px] text-zinc-500 space-y-1 font-mono">
          <div className="flex justify-between"><span>Base:</span> <span className="text-zinc-300">{data.inputs.base || 'N/A'}</span></div>
          <div className="flex justify-between"><span>Steps:</span> <span className="text-zinc-300">{data.inputs.steps ?? 0}</span></div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="base" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="steps" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export const MathNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const updateConfig = useStore((s) => s.updateNodeConfig);
  return (
    <BaseNode label="Arithmetic" selected={selected} icon={<Calculator size={14} />}>
      <div className="flex flex-col gap-2">
        <select 
          value={data.config?.operation || '+'} 
          onChange={(e) => updateConfig(id, { operation: e.target.value })}
          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="+">Add (+)</option>
          <option value="-">Subtract (-)</option>
          <option value="*">Multiply (*)</option>
          <option value="/">Divide (/)</option>
        </select>
        <div className="text-xl font-bold text-center text-blue-400 py-1 bg-zinc-950 rounded border border-zinc-800/50">
          {typeof data.value === 'number' ? data.value.toLocaleString() : '0'}
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="a" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export const ContrastNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const result = data.value || { ratio: '0.00', passAA: false, passAAA: false };
  return (
    <BaseNode label="Contrast" selected={selected} icon={<Eye size={14} />}>
      <div className="space-y-2">
        <div className="flex items-end justify-between px-1">
          <span className="text-2xl font-bold tracking-tight text-white">{result.ratio}</span>
          <span className="text-[10px] text-zinc-600 font-mono mb-1">: 1</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          <div className={`px-2 py-1.5 rounded-md text-center transition-colors ${result.passAA ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>WCAG AA</div>
          <div className={`px-2 py-1.5 rounded-md text-center transition-colors ${result.passAAA ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>WCAG AAA</div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="background" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="foreground" style={{ top: '70%' }} />
    </BaseNode>
  );
};

export const MixNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const updateConfig = useStore((s) => s.updateNodeConfig);
  
  // Calculate text color for contrast
  const bgColor = data.value || '#000';
  let textColor = '#fff';
  try {
      if (wcagContrast(bgColor, '#fff') < 4.5) {
          textColor = '#000';
      }
  } catch (e) {
      // Fallback if color is invalid
  }

  return (
    <BaseNode label="Mixer" selected={selected} icon={<Settings2 size={14} />}>
      <div className="space-y-3">
        <div className="w-full h-10 rounded-lg border-2 border-zinc-800 shadow-inner overflow-hidden flex items-center justify-center text-[10px] font-mono font-bold" style={{ backgroundColor: bgColor, color: textColor }}>
          {data.value}
        </div>
        <div className="space-y-1">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={data.config?.weight ?? 0.5} 
            onChange={(e) => updateConfig(id, { weight: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
            <span>Color A</span>
            <span className="text-amber-400">Weight: {((data.config?.weight ?? 0.5) * 100).toFixed(0)}%</span>
            <span>Color B</span>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} id="a" style={{ top: '25%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="weight" style={{ top: '75%' }} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export const OutputNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const value = data.value;
  return (
    <BaseNode label="Token Output" selected={selected} icon={<Box size={14} />}>
      <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[10px] max-h-40 overflow-auto text-emerald-400 leading-relaxed">
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
      <Handle type="target" position={Position.Left} id="input" />
    </BaseNode>
  );
};
