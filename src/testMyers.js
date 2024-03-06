

export default function testMyers() {
  const source = 'ABCABBA';
  const target = 'CBABAC';
  // myers1(source, target);
  myers2(source, target);

  // myers1('AAA', 'AAA');
  // myers2('AAA', 'AAA');

  // myers1('A', 'AB');
  // myers2('A', 'AB');
}

function myers2(source, target) {
  const sl = source.length;
  const tl = target.length;

  const diagonal = (i, j) => {
    while (i < sl && j < tl && source[i + 1] === target[j + 1]) {
      i++;
      j++;
    }
    return [i, j];
  };

  let queue = [diagonal(-1, -1)];
  console.log('start: ', JSON.stringify(queue));

  const fromMap = new Map();

  while (queue.length) {
    let _queue = [];
    for (let [i, j] of queue) {
      const from = `${i},${j}`;
      const tempDownward = j < tl - 1 ? [i, j + 1] : null;
      const tempRightward = i < sl - 1 ? [i + 1, j] : null;
      console.log('temp: ', tempDownward, tempRightward);

      if (tempDownward && tempDownward[0] === sl - 1 && tempDownward[1] === tl - 1) {
        fromMap.set(tempDownward.join(','), { coords: from, type: 'add' });
        // fromMap.set(`${sl},${tl}`, { coords: tempDownward.join(','), type: 'move' });
        _queue = [];
        break;
      }

      if (tempRightward && tempRightward[0] === sl - 1 && tempRightward[1] === tl - 1) {
        fromMap.set(tempRightward.join(','), { coords: from, type: 'delete' });
        // fromMap.set(`${sl},${tl}`, { coords: tempRightward.join(','), type: 'move' });
        _queue = [];
        break;
      }

      if (_queue.length === 0) {
        if (tempDownward) {
          fromMap.set(tempDownward.join(','), { coords: from, type: 'add' });
          _queue.push(tempDownward);
        }
        if (tempRightward) {
          fromMap.set(tempRightward.join(','), { coords: from, type: 'delete' });
          _queue.push(tempRightward);
        }
        continue;
      }

      const lastRightward = _queue[_queue.length - 1];
      if (!tempDownward || tempDownward[0] < lastRightward[0]) {
        if (tempRightward) {
          fromMap.set(tempRightward.join(','), { coords: from, type: 'delete' });
          _queue.push(tempRightward);
        }
        continue;
      }

      _queue.pop();
      fromMap.set(tempDownward.join(','), { coords: from, type: 'add' });
      _queue.push(tempDownward);
      if (tempRightward) {
        fromMap.set(tempRightward.join(','), { coords: from, type: 'delete' });
        _queue.push(tempRightward);
      }
    }
    console.log('_queue: ', JSON.stringify(_queue));

    let dQueue = [];
    for (const [i, j] of _queue) {
      const diagonalward = diagonal(i, j);
      
      if (diagonalward[0] !== i) {
        if (dQueue.length) {
          const lastRightward = _queue[dQueue.length - 1];
          if (diagonalward[0] < lastRightward[0]) {
            continue;
          }
        }
      }
      fromMap.set(diagonalward.join(','), fromMap.get(`${i},${j}`));
      dQueue.push(diagonalward);

      if (diagonalward[0] === sl - 1 && diagonalward[1] === tl - 1
        ||diagonalward[0] === sl && diagonalward[1] === tl
      ) {
        dQueue = [];
        break;
      }
    }

    queue = dQueue;
    if (queue.length) {
      console.log('\nnext queue: ', JSON.stringify(queue));
    }
  }

  console.log(fromMap);
  let from = fromMap.get(`${sl - 1},${tl - 1}`);
  const paths = [];
  while (from) {
    paths.unshift(from);
    from = fromMap.get(from.coords);
  }
  console.log(paths);

  const pathsMap = new Map(paths.map(({ coords, type }) => [coords, type]));
  const ops = [];
  console.log(pathsMap);
  let i = -1;
  let j = -1;
  while (i < sl && j < tl) {
    if (source[i + 1] && source[i + 1] === target[j + 1]) {
      ops.push(source[i + 1]);
      i++;
      j++;
      continue;
    }
    const type = pathsMap.get(`${i},${j}`);
    switch (type) {
      case 'delete':
        ops.push('-' + source[i + 1]);
        i++;
        break;
      case 'add':
        ops.push('+' + target[j + 1]);
        j++;
        break;
    }
    if (i === sl - 1 && j === tl - 1) {
      break;
    }
  }
  console.log(ops);
  console.log(source, target);
  console.log(ops.join(' '));
}

function myers1(source, target) {
  const sl = source.length;
  const tl = target.length;

  const diagonal = (i, j) => {
    while (i < sl && j < tl && source[i + 1] === target[j + 1]) {
      i++;
      j++;
    }
    return [i, j];
  };
  console.log(diagonal(6, 5));

  const downward = (i, j) => {
    if (j >= tl - 1) {
      return null;
    }
    return diagonal(i, j + 1);
  };

  const rightward = (i, j) => {
    if (i >= sl - 1) {
      return null;
    }
    return diagonal(i + 1, j);
  };

  let queue = [diagonal(-1, -1)];
  let depth = 0;
  console.log('start: ', JSON.stringify(queue), depth);

  const fromMap = new Map();

  while (queue.length) {
    const _queue = [];
    for (let [i, j] of queue) {
      const from = `${i},${j}`;
      const tempDownward = downward(i, j);
      const tempRightward = rightward(i, j);
      console.log('temp: ', tempDownward, tempRightward);
      // if (tempDownward && tempDownward[0] === sl && tempDownward[1] === tl
      //   || tempRightward && tempRightward[0] === sl && tempRightward[1] === tl
      // ) {
      //   _queue = [];
      //   depth++;
      //   console.log('end', tempDownward, tempRightward, depth);
      //   break;
      // }
      if (_queue.length === 0) {
        if (tempDownward) {
          fromMap.set(tempDownward.join(','), from);
          _queue.push(tempDownward);
        }
        if (tempRightward) {
          fromMap.set(tempRightward.join(','), from);
          _queue.push(tempRightward);
        }
        // tempDownward && _queue.push(tempDownward);
        // tempRightward && _queue.push(tempRightward);
        continue;
      }

      const lastRightward = _queue[_queue.length - 1];
      if (!tempDownward || tempDownward[0] < lastRightward[0]) {
        if (tempRightward) {
          fromMap.set(tempRightward.join(','), from);
          _queue.push(tempRightward);
        }
        // tempRightward && _queue.push(tempRightward);
        continue;
      }

      _queue.pop();
      fromMap.set(tempDownward.join(','), from);
      _queue.push(tempDownward);
      if (tempRightward) {
        fromMap.set(tempRightward.join(','), from);
        _queue.push(tempRightward);
      }
      // tempRightward && _queue.push(tempRightward);
    }
    queue = _queue;
    if (queue.some(([_i, _j]) => _i === sl && _j === tl)) {
      depth++;
      break;
    }
    if (queue.length) {
      console.log('next queue: ', JSON.stringify(queue));
      depth++;
    }
  }

  console.log(depth);
  console.log(fromMap);
  const paths = [`${sl},${tl}`];
  let from = fromMap.get(paths[0]);
  while (from) {
    paths.unshift(from);
    from = fromMap.get(from);
  }
  console.log(paths);
}
