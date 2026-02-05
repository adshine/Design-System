
import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  applyEdgeChanges, 
  applyNodeChanges 
} from 'reactflow';
import { NodeType, NodeData } from './types.ts';
import { calculateNodeValue } from './engine.ts';

interface GraphState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number, y: number }) => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
  recalculate: () => void;
}

export const useStore = create<GraphState>((set, get) => ({
  nodes: [
    {
      id: 'node-1',
      type: 'colorSource',
      position: { x: 50, y: 50 },
      data: { label: 'Primary Color', value: '#3b82f6', inputs: {}, config: { color: '#3b82f6' } },
    }
  ],
  edges: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
    get().recalculate();
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
    get().recalculate();
  },

  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
    get().recalculate();
  },

  addNode: (type, position) => {
    const id = `node-${Date.now()}`;
    const newNode: Node<NodeData> = {
      id,
      type,
      position,
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'), 
        value: null, 
        inputs: {}, 
        config: {} 
      },
    };
    set({ nodes: [...get().nodes, newNode] });
    get().recalculate();
  },

  updateNodeConfig: (nodeId, config) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } };
        }
        return node;
      }),
    });
    get().recalculate();
  },

  recalculate: () => {
    const { nodes, edges } = get();
    
    let updatedNodes = [...nodes];
    const maxIterations = 5;

    for (let i = 0; i < maxIterations; i++) {
      let changed = false;
      updatedNodes = updatedNodes.map((node) => {
        const nodeInputs: Record<string, any> = {};
        
        edges
          .filter((edge) => edge.target === node.id)
          .forEach((edge) => {
            const sourceNode = updatedNodes.find((n) => n.id === edge.source);
            if (sourceNode) {
              const handleId = edge.targetHandle || 'input';
              nodeInputs[handleId] = sourceNode.data.value;
            }
          });

        const newValue = calculateNodeValue(node.type as NodeType, nodeInputs, node.data.config);
        
        if (JSON.stringify(newValue) !== JSON.stringify(node.data.value)) {
          changed = true;
          return { ...node, data: { ...node.data, value: newValue, inputs: nodeInputs } };
        }
        return node;
      });
      
      if (!changed) break;
    }

    set({ nodes: updatedNodes });
  }
}));
