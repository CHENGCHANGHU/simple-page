self.onmessage = async function (event) {
  // console.log(fetch);
  // console.log(event);
  const { data } = event;
  const startFlag = `start-${data.id}`;
  const endFlag = `end-${data.id}`;
  const measureFlag = `measure-${data.id}`;
  switch (event.data.type) {
    case 'start':
      performance.mark(startFlag);
      break;
    case 'end':
      performance.mark(endFlag);
      performance.measure(measureFlag, startFlag, endFlag);
      console.log('performance', performance.getEntriesByName(measureFlag));
      performance.clearMarks(startFlag);
      performance.clearMarks(endFlag);
      performance.clearMeasures(measureFlag);
      console.log('performance', performance.getEntriesByName(measureFlag));
      break;
  }

  // const task = new Task(2);
  // task.push(getTask(1));
  // task.push(getTask(2));
  // task.push(getTask(3));

  // const a = [getTask(1), getTask(2), getTask(3)];
  // while (a.length) {
  //   const fn = a.shift();
  //   await fn();
  // }
}

function getTask(id) {
  return async () => {
    // await sleep(Math.random() * 1000);
    await sleep(id * 1000);
    console.log(new Date(), id);
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Task {
  constructor(concurrency = 1) {
    this.queue = [];
    this.running = 0;
    this.concurrency = concurrency;
  }

  push(fn, cb) {
    this.queue.push({ fn, cb });
    this.run();
  }

  async execute() {
    const { fn, cb } = this.queue.shift();
    await fn();
    cb && cb();
  }

  async run() {
    while (this.queue.length && this.running < this.concurrency) {
      console.log(new Date(), this.running, this.queue.length);
      this.running++;
      await this.execute();
      this.running--;
    }
  }
}
