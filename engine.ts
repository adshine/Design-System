
import { parse, formatLch, formatHex, wcagContrast, interpolate } from 'culori';
import { NodeType } from './types.ts';

export const calculateNodeValue = (type: NodeType, inputs: any, config: any) => {
  try {
    switch (type) {
      case NodeType.COLOR_SOURCE:
        return config?.color || '#3b82f6';

      case NodeType.NUMBER_SOURCE:
        return Number(config?.number) || 0;

      case NodeType.AI_GEN:
        return config?.value || '#ffffff';

      case NodeType.SCALE_GEN: {
        const base = inputs.base || '#3b82f6';
        const count = Number(inputs.steps) || 5;
        
        const parsed = parse(base);
        if (!parsed) return [base];

        const scale = [];
        const lch = formatLch(parsed);
        if (!lch) return [base];

        const parts = lch.match(/lch\((\d+\.?\d*)%\s+(\d+\.?\d*)\s+(\d+\.?\d*)\)/);
        if (!parts) return [base];

        let [_, l, c, h] = parts.map(Number);
        
        const steps = Math.max(1, count);
        for (let i = 0; i < steps; i++) {
          const factor = (i - Math.floor(steps / 2)) * (100 / steps);
          const newL = Math.max(0, Math.min(100, l - factor));
          scale.push(formatHex({ mode: 'lch', l: newL, c, h }));
        }
        return scale;
      }

      case NodeType.MATH: {
        const a = Number(inputs.a) || 0;
        const b = Number(inputs.b) || 0;
        const op = config?.operation || '+';
        switch (op) {
          case '+': return a + b;
          case '-': return a - b;
          case '*': return a * b;
          case '/': return b !== 0 ? a / b : 0;
          default: return a;
        }
      }

      case NodeType.CONTRAST: {
        const bg = inputs.background || '#ffffff';
        const fg = inputs.foreground || '#000000';
        // Validate colors before checking contrast
        if (!parse(bg) || !parse(fg)) {
             return { ratio: '0.00', passAA: false, passAAA: false };
        }
        const ratio = wcagContrast(bg, fg);
        return {
          ratio: ratio.toFixed(2),
          passAA: ratio >= 4.5,
          passAAA: ratio >= 7
        };
      }

      case NodeType.MIX: {
        const colorA = inputs.a || '#ffffff';
        const colorB = inputs.b || '#000000';
        const weight = Number(inputs.weight) || 0.5;
        
        if (!parse(colorA) || !parse(colorB)) return colorA;

        return formatHex(interpolate([colorA, colorB])(weight));
      }

      case NodeType.OUTPUT:
        return inputs.input || null;

      default:
        return null;
    }
  } catch (err) {
    console.warn(`Error calculating node ${type}:`, err);
    return null;
  }
};
