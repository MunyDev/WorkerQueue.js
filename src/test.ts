import { WorkerQueue } from "./queue";
function wait(ms) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(undefined);
        }, ms);
    })
}
window['WorkerQueue'] = WorkerQueue;
let wq = new WorkerQueue("./dist/bundle/worker.bundle.js");
wq.addVarToWorkerScope("test1", "/");
wq.addVarToWorkerScope("wait", wait.toString());
let test1;
let sabPtr = new SharedArrayBuffer(4096);
wq.addVarToWorkerScope('sab', sabPtr);
wq.pushv2((prevVal, x)=>{
    return fetch(self["variablesScope"]["test1"]);
}, (retVal)=>{}, false);


wq.pushv2((prevVal)=>{
    return prevVal.text();
}, (txt)=>{alert(txt)}, true);
wq.pushv3((pv)=>{
    return new Promise((resolve, rej)=>{rej()});// Creates new promise that rejects on creation to debug error testing
}, false).then((v)=>{
    
}, (ca)=>{
    console.log("reached!");
    
})



new Int32Array(sabPtr)[1] = 30;
// wq.push(outTheFetch, ()=>{}, false);
wq.flush();