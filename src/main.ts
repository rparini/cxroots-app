import { HelloWorldInTypescript } from './hello-world.class'
HelloWorldInTypescript.HelloWorld()

console.log('starting up');

import * as workerPath from "file-loader?name=[name].js!./cxroots.worker";
const worker = new Worker(workerPath);

worker.addEventListener('message', message => {
    console.log(message);
});
console.log('sending message to worker');


const rootreq = {
    f: '2',
}
worker.postMessage(rootreq);

