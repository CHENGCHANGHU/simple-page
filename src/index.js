import { testVideoCover } from './testVideoCover';
import { testMonacoEditor } from './testMonacoEditor';
import { testAsyncPool } from './testAsyncPool';
import { testVirtualList } from './testVirtualList';
import { testPipeline } from './testPipeline';
import { testSpecifyFileSize } from './testSpecifyFileSize';

window.addEventListener('load', main);

function main() {
  console.log('loaded');

  try {
    // testVideoCover();
    // testMonacoEditor();
    // testAsyncPool();
    // testVirtualList();
    // testPipeline();
    testSpecifyFileSize();
  } catch (e) {
    console.error(e);
  }
}
