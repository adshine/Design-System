
export enum NodeType {
  COLOR_SOURCE = 'colorSource',
  NUMBER_SOURCE = 'numberSource',
  SCALE_GEN = 'scaleGen',
  MATH = 'math',
  CONTRAST = 'contrast',
  OUTPUT = 'output',
  MIX = 'mix',
  AI_GEN = 'aiGen'
}

export interface NodeData {
  label: string;
  value: any;
  inputs: Record<string, any>;
  config?: Record<string, any>;
}

export interface ComputedResult {
  nodeId: string;
  value: any;
}
