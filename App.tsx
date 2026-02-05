import React from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  BackgroundVariant
} from 'reactflow';

import { useStore } from './store.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { 
  ColorSourceNode, 
  NumberSourceNode, 
  ScaleGenNode, 
  MathNode, 
  ContrastNode, 
  OutputNode,
  MixNode,
  AiGenNode
} from './components/nodes/CustomNodes.tsx';
import { Download, Sparkles, Box } from 'lucide-react';

const nodeTypes = {
  colorSource: ColorSourceNode,
  numberSource: NumberSourceNode,
  scaleGen: ScaleGenNode,
  math: MathNode,
  contrast: ContrastNode,
  output: OutputNode,
  mix: MixNode,
  aiGen: AiGenNode
};

const App: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();

  const exportGraph = () => {
    try {
      const data = { nodes, edges };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `graph-engine-export-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 relative h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
          snapToGrid
          snapGrid={[15, 15]}
          style={{ background: '#09090b' }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: '#3f3f46', strokeWidth: 2 }
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#27272a" />
          <Controls className="!bg-zinc-900 !border-zinc-800 !fill-zinc-400" />
          
          <Panel position="top-right" className="flex gap-2">
            <button 
              onClick={exportGraph}
              className="group flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xl backdrop-blur-md"
            >
              <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
              EXPORT TOKENS
            </button>
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" />
              REAL-TIME SYNC
            </div>
          </Panel>

          <Panel position="bottom-right" className="bg-zinc-900/40 p-3 border border-zinc-800/50 rounded-2xl shadow-2xl backdrop-blur-xl max-w-[280px] border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2 mb-2">
               <Box size={14} className="text-emerald-500" />
               <h4 className="text-[10px] font-black text-zinc-100 uppercase tracking-widest">Logic Engine v1.0</h4>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              Graph Engine computes variables through a directed graph. Connect nodes to derive tokens from logic, not static values.
            </p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default App;