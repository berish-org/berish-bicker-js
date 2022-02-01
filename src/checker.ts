import { createNode, renderNode } from './node';

export function App() {}

export async function start() {
  renderNode(createNode(App, {}));
}

start();
