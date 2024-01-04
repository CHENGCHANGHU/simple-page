import { testVideoCover } from './testVideoCover';
import { testMonacoEditor } from './testMonacoEditor';
import { testAsyncPool } from './testAsyncPool';

window.addEventListener('load', main);

function main() {
  console.log('loaded');

  // testVideoCover();

  // testMonacoEditor();

  testAsyncPool();
}
