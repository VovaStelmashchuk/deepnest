import { SvgParser } from './main/svgparser.js';
import { DeepNest } from './main/deepnest.js';
import { EventEmitter } from 'events';

export function parseSvgTree(svgString) {
  const parser = new SvgParser();
  // load and prepare SVG
  const svg = parser.load('', svgString, parser.conf.scale);
  parser.cleanInput(false);

  const deepnest = new DeepNest(new EventEmitter());
  const parts = deepnest.getParts(svg.children, '');

  function attachHandle(tree) {
    const el = svg.children[tree.source];
    const handle = el.getAttribute('data-dxf-handle');
    if (handle) {
      tree.handle = handle;
    }
    if (tree.children) {
      tree.children.forEach(attachHandle);
    }
  }

  for (const part of parts) {
    attachHandle(part.polygontree);
  }

  return parts;
}
