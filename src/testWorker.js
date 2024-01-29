export default async function testWorker() {
  console.log('test worker');

  const worker = new Worker(new URL('./testBackgroundWorker.js', import.meta.url));
  // worker.postMessage(123);

  worker.postMessage({ type: 'start', id: 'a' });
  await sleep(3000);
  worker.postMessage({ type: 'end', id: 'a' });

  worker.postMessage({ type: 'start', id: 'b' });
  await sleep(1000);
  worker.postMessage({ type: 'end', id: 'b' });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
