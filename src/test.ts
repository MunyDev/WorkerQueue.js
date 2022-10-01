import { WorkerQueue } from "./queue";
function outTheFetch(result){
    console.log(result);
}

let wq = new WorkerQueue();
wq.push((unused, testing)=>{ return fetch("/index.html")}, (v)=>{}, true,false, "x");
wq.push((asdf: Response)=>{return asdf.text()}, (v)=>{console.log(v)}, true, true);
// wq.push(outTheFetch, ()=>{}, false);
wq.flush();