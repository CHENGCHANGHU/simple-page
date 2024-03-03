import { testVideoCover } from './testVideoCover';
import { testMonacoEditor } from './testMonacoEditor';
import { testAsyncPool } from './testAsyncPool';
import { testVirtualList } from './testVirtualList';
import { testPipeline } from './testPipeline';
import { testSpecifyFileSize } from './testSpecifyFileSize';

window.addEventListener('load', main);

async function main() {
  console.log('loaded');

  try {
    // testVideoCover();
    // testMonacoEditor();
    // testAsyncPool();
    // testVirtualList();
    // testPipeline();
    // testSpecifyFileSize();

    // const { default: test } = await import('./testWorker');
    const { default: test } = await import('./testMyers');

    test();
  } catch (e) {
    console.error(e);
  }
}
