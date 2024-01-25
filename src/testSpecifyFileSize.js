export function testSpecifyFileSize() {
  main();
}

async function main() {
  const fragment = document.createDocumentFragment();

  // const content = new Uint8Array(4 * 1024); // 4KB
  // content.forEach((value, index) => {
  //   content[index] = 97;
  // });
  // const createdFile = new File([content.buffer], 'text.txt', { type: 'text/plain;charset=utf-8' });

  const size = 200 * 200 * 4;
  const content = new Uint8ClampedArray(size);
  for (let i = 0; i < size; i += 4) {
    content[i] = Math.random() * 255;
    content[i + 1] = Math.random() * 255;
    content[i + 2] = Math.random() * 255;
    content[i + 3] = 255;
  }
  // const createdFile = new File(
  //   [content.buffer],
  //   'test.png',
  //   { type: 'image/png' }
  // );
  const createdImageData = new ImageData(content, 200, 200);
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const context = canvas.getContext('2d');
  context.putImageData(createdImageData, 0, 0);
  fragment.appendChild(canvas);

  const download = document.createElement('a');
  download.innerText = 'download';
  download.download = 'test.png';
  // download.href = URL.createObjectURL(createdFile);
  fragment.appendChild(download);

  document.body.append(fragment);
}
