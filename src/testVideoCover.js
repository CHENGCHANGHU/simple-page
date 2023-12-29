let testImage = null;

export function testVideoCover() {
  const fragment = document.createDocumentFragment();
  const input = document.createElement('input');
  const image = document.createElement('img');
  const style = document.createElement('style');
  fragment.appendChild(input);
  fragment.appendChild(image);
  fragment.appendChild(style);

  testImage = image;

  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'video/*');
  input.addEventListener('change', async event => {
    const { target } = event;
    console.log(target.files);
    const [file] = target.files;
    const dataUrl = await getFileBase64(file);
    console.log(dataUrl);
    const thumbnail = await getVideoThumbnail(dataUrl);
    console.log(0, thumbnail);
    image.setAttribute('src', thumbnail);
  });

  image.setAttribute('class', 'video-cover');
  image.setAttribute('src', 'https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');

  style.innerHTML = getStyle();

  console.log(fragment.children);
  
  document.body.appendChild(fragment);
}

function getStyle() {
  return `
    .video-cover {
      width: 200px;
      height: 200px;
      object-fit: contain;
      border: 1px solid red;
    }

    canvas {
      border: 1px solid red;
    }
  `;
}

function getFileBase64(file) {
  return new Promise((resolve, reject) => {
    // const blob = new Blob([file], { type: file.type });
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
    reader.addEventListener('error', () => {
      reject();
    });
    // reader.readAsDataURL(blob);
    reader.readAsDataURL(file);
  });
}

async function getVideoThumbnail(url) {
  let resolve;
  const waiter = new Promise((...args) => [resolve] = args);
  const video = document.createElement('video');
  video.setAttribute('crossOrigin', 'anonymous');
  video.setAttribute('src', url);
  video.muted = true;
  video.defaultMuted = true;
  video.playsinline = true;
  video.addEventListener('canplay', async () => {
    const canvas = document.createElement('canvas');
    const { videoWidth: width, videoHeight: height } = video;
    console.log(width, height);
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    video.play();
    video.pause();
    await sleep(300);

    context.drawImage(video, 0, 0, width, height, 0, 0, width, height);
    
    document.body.appendChild(canvas);
    resolve(canvas.toDataURL('image/png', 0.5))
  });
  return await waiter;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}