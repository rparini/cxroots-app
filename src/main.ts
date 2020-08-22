import { HelloWorldInTypescript } from './hello-world.class'
HelloWorldInTypescript.HelloWorld()


console.log('this is a test message, wahoo!!');

// import * as workerPath from "file-loader?name=[name].js!./cxroots.worker";
// const worker = new Worker(workerPath);
console.log('here1');

const worker = new Worker('./cxroots.worker.js');
console.log('here2');

worker.addEventListener('message', message => {
    console.log(message);
});
console.log('here3');
worker.postMessage('this is a test message to the worker');

