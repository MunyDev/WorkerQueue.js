import { WorkerQueue } from "./queue";

window['WorkerQueue'] = WorkerQueue;
let wq = new WorkerQueue("./dist/bundle/worker.bundle.js");
wq.addVarToWorkerScope("test1", "/");
let test1;
wq.push((unused, testing)=>{ return fetch(self["variablesScope"]["test1"])}, (v)=>{}, true,false, "x");
wq.push((asdf: Response)=>{return asdf.text()}, (v)=>{alert(v)}, true, true);
// wq.push(outTheFetch, ()=>{}, false);
wq.flush();