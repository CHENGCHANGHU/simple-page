// class TaskPipeline {
//   middlewares = [];

//   constructor() {}

//   pipe(fn) {
//     this.middlewares.push(fn);
//     return this;
//   }

//   async run(params) {
//     let result = params;
//     for(let fn of this.middlewares) {
//       // const { promise, resolve, reject } = Promise.withResolvers();
//       let resolve;
//       let reject;
//       const promise = new Promise((...args) => [resolve, reject] = args);
//       fn(result, resolve, reject);
//       try {
//         result = await promise;
//       } catch (e) {
//         console.log('error');
//         result = e;
//         break;
//       }
//     }
//     return result;
//   }
// }

import { Pipeline } from '@golden-tiger/pipeline';

export async function testPipeline() {
  const taskPipeline = new Pipeline();
  
  taskPipeline
    .pipe((params, next, stop) => {
      console.log(params);
      next(params + 6);
    })
    .pipe((params, next, stop) => {
      console.log(params);
      next(params * 2);
      // stop();
    })
    .pipe((params, next, stop) => {
      console.log(params);
      next(params + 3);
    });
  const result = await taskPipeline.run(1);
  
  console.log(result);
}

