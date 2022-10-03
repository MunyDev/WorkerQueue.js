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
wq.pushv2((prevVal, x)=>{
    return fetch(self["variablesScope"]["test1"]);
}, (retVal)=>{}, false);
wq.pushv2((prevVal)=>{
    return prevVal.text();
}, (txt)=>{alert(txt)}, true);

// wq.push(outTheFetch, ()=>{}, false);
wq.flush();