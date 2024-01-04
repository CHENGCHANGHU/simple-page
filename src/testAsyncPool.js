export async function testAsyncPool() {
  const randomSleepFuncs = (new Array(17)).fill(0).map((_, i) => getRandomSleepFunc(i));
  console.log(randomSleepFuncs);
  const result = await asyncPool(5, randomSleepFuncs.map(({ func }) => func));
  console.log(result);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function random(from, to) {
  return from + Math.floor((to - from) * Math.random());
}

function withResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((...args) => [resolve, reject] = args);
  return { promise, resolve, reject };
}

function getRandomSleepFunc(id) {
  const time = random(500, 5000);
  return {
    id,
    time,
    func: async () => {
      await sleep(time);
      console.log('finish', id, time);
      return { id, time };
    },
  };
}

async function asyncPool(max, funcs) {
  if (max >= funcs.length) {
    // const result = await Promise.allSettled(funcs.map(func => func()));
    const results = await Promise.all(funcs.map(func => func()));
    // const result = await Promise.allSettled([funcs[0](), funcs[1]()]);
    // const result = await Promise.all([funcs[0](), funcs[1]()]);
    return results;
  }

  const length = funcs.length;
  const results = [];
  const pool = [];
  for (let i = 0; i < length; i++) {
    if (pool.length < max) {
      pool.push(new Promise(async resolve => {
        const result = await funcs[i]();
        results[i] = result;
        resolve({ index: i, result });
      }));
    } else {
      const { index } = await Promise.race(pool);
      console.log(i, pool.length, index);
      pool.splice(index, 1, new Promise(async resolve => {
        const result = await funcs[i]();
        results[i] = result;
        resolve({ index, result });
      }));
    }
  }
  await Promise.all(pool);
  return results;
}
