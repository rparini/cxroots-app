import { HelloWorldInTypescript } from './hello-world.class'
HelloWorldInTypescript.HelloWorld()


console.log('starting up');


import * as workerPath from "file-loader?name=[name].js!./cxroots.worker";
console.log(workerPath);
const worker = new Worker(workerPath);
console.log('started worker');

worker.addEventListener('message', message => {
    console.log(message);
});
console.log('sending message to worker');
worker.postMessage('this is a test message to the worker');

