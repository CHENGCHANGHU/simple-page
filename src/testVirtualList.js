export function testVirtualList() {
  console.log(randomString());
  const fragment = document.createDocumentFragment();

  const style = document.createElement('style');
  style.innerHTML = getStyle();
  fragment.appendChild(style);

  const ul = document.createElement('ul');
  const list = (new Array(1000)).fill(0).map((_, index) => {
    const li = document.createElement('li');
    li.innerText = `[${index}]: ` + (new Array(random(1, 20))).fill(0).map(() => randomString()).join(' ');
    return li;
  });
  ul.append(...list);
  fragment.appendChild(ul);

  document.body.appendChild(fragment);
}

function random(from, to) {
  return from + Math.floor((to - from) * Math.random());
}

function randomString() {
  return (Math.random() + 1).toString(36).slice(2, -1);
}

function getStyle() {
  return `
    ul, li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    ul {
      width: 500px;
      height: 300px;
      border: 1px solid red;
      overflow-y: scroll;
    }
    li {
      border: 1px solid green;
    }
  `;
}
