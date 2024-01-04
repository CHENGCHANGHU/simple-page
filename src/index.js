import { testVideoCover } from './testVideoCover';
import { testMonacoEditor } from './testMonacoEditor';
import { testAsyncPool } from './testAsyncPool';
import { testVirtualList } from './testVirtualList';

window.addEventListener('load', main);

function main() {
  console.log('loaded');

  try {
    // testVideoCover();
    testMonacoEditor();
    // testAsyncPool();
    // testVirtualList();
  } catch (e) {
    console.error(e);
  }
}
