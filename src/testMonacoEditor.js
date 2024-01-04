import * as monaco from 'monaco-editor';

export function testMonacoEditor() {
  const fragment = document.createDocumentFragment();

  const style = document.createElement('style');
  style.innerHTML = getStyle();
  fragment.appendChild(style);

  const openDirButton = document.createElement('button');
  openDirButton.innerText = 'Open Directory';
  fragment.appendChild(openDirButton);

  const newFileNameInput = document.createElement('input');
  newFileNameInput.type = 'text';
  newFileNameInput.disabled = true;
  fragment.appendChild(newFileNameInput);

  const newFileButton = document.createElement('button');
  newFileButton.innerText = 'New File';
  fragment.appendChild(newFileButton);

  const openFileButton = document.createElement('button');
  openFileButton.innerText = 'Open File';
  fragment.appendChild(openFileButton);

  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  fragment.appendChild(saveButton);

  const headerBox = document.createElement('div');
  fragment.appendChild(headerBox);

  const editor = document.createElement('div');
  editor.setAttribute('id', 'editor');
  editor.setAttribute('class', 'editor');
  fragment.appendChild(editor);

  const runButton = document.createElement('button');
  runButton.innerText = 'Run';
  fragment.appendChild(runButton);

  const resultBox = document.createElement('div');
  resultBox.setAttribute('class', 'result-box');
  fragment.appendChild(resultBox);

  document.body.appendChild(fragment);

  const monacoEditor = monaco.editor.create(
    document.querySelector('#editor'),
    {
      value: '',
      language: 'javascript',
      fontSize: 14,
      tabSize: 2,
    }
  );

  let currentDirHandle = null;
  let currentFileHandle = null;

  openDirButton.addEventListener('click', async () => {
    try {
      currentDirHandle = await showDirectoryPicker();
      if (!currentDirHandle) {
        return;
      }
      newFileNameInput.disabled = false;
    } catch (e) {
      console.error(e);
    }
  });

  newFileButton.addEventListener('click', async () => {
    // If it is "prompt" however, user activation is needed
    // const newFileName = String(prompt('New File Name'));
    const newFileName = newFileNameInput.value;
    currentFileHandle = await currentDirHandle.getFileHandle(newFileName + '.mjs', { create: true });
    newFileNameInput.disabled = true;
    newFileNameInput.value = '';

    const writable = await currentFileHandle.createWritable();
    await writable.write('');
    await writable.close();

    const file = await currentFileHandle.getFile();
    headerBox.innerHTML = `${file.name}(${file.size} bytes) ${new Date(file.lastModified)}`;
    monacoEditor.setValue(await file.text());
  });

  openFileButton.addEventListener('click', async () => {
    try {
      const [fileHandle] = await showOpenFilePicker({
        multiple: false,
        excludeAcceptAllOption: true,
        types: [
          {
            descriptions: 'js',
            accept: {
              'text/javascript': ['.javascript'],
            }
          }
        ],
      });
      currentFileHandle = fileHandle;
      const file = await fileHandle.getFile();
      headerBox.innerHTML = `${file.name}(${file.size} bytes) ${new Date(file.lastModified)}`;
      monacoEditor.setValue(await file.text());
    } catch (e) {
      console.error(e);
    }
  });

  saveButton.addEventListener('click', async () => {
    if (!currentFileHandle) {
      return;
    }

    const writable = await currentFileHandle.createWritable();
    await writable.write(monacoEditor.getValue());
    await writable.close();
  });

  runButton.addEventListener('click', async () => {
    resultBox.innerText = '';
    const { result, duration } = await runCode(monacoEditor.getValue(), {
      lexicalEnvironment: {
        console: {
          log(...args) {
            resultBox.innerText += args.map(arg => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg);
                } catch (e) {
                  return e.message;
                }
              }
              return arg;
            }).join(' ') + '\n';
          },
        },
      },
      executeContext: {
        name: 'executeContext',
      },
    });
    resultBox.innerText += `==> ${typeof result === 'object' ? JSON.stringify(result) : result}\n`;
    resultBox.innerText += `==> (${duration.toPrecision(3)} milliseconds)`;
  });
}

function getStyle() {
  return `
    .editor {
      width: 100%;
      height: 300px;
      border: 1px solid red;
      overflow: auto;
    }

    .result-box {
      width: 100%;
      height: 200px;
      white-space: pre;
      border: 1px solid blue;
      overflow: auto;
    }
  `;
}

async function runCode(code, { lexicalEnvironment, executeContext }) {
  const { keys, values } = Object.entries(lexicalEnvironment)
    .reduce((acc, [k, v]) => {
      acc.keys.push(k);
      acc.values.push(v);
      return acc;
    }, {
      keys: [],
      values: [],
    });
  
  // AsyncFunction is not a global object. It can be obtained with the following code: const AsyncFunction = async function () {}.constructor;
  // const wrappedFunction = (new Function(...keys, code)).bind(executeContext, ...values);
  const wrappedFunction = (new Function(...keys, `return async () => {${code}};`)).bind(executeContext, ...values)();
  const startTime = performance.now();
  
  let result;
  try {
    result = await wrappedFunction();
  } catch (e) {
    console.error(e);
  }

  const endTime = performance.now();
  return {
    result,
    duration: endTime - startTime,
  };
}
