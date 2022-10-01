import { ClientSideMatchDescriptor, FunctionDescriptor, WorkerProtocalMsg } from "./workerprotocal";

/// <reference lib="WebWorker" />
let workerpr = require('./workerprotocal');
console.log('Worker queue inititalized!');
export{};
// export {WorkerProtocalMsg};


declare const self: DedicatedWorkerGlobalScope;
// let variablesScope = {};

let fnArray: FunctionDescriptor[] = [];
self["variablesScope"] = {};
// Lets test out recursion first
let state = 0;
function runTheCallbackViaDescriptor(cliMatch: ClientSideMatchDescriptor) {
    self.postMessage(cliMatch);
}
function flush(v) {
    // console.log(v);
    if (fnArray.length === 0){
        state = 0;
        return;
    }
    let pushed = fnArray.shift();
    // console.log(pushed.func.toString());
    // console.log(pushed.async);
    
    if (pushed.async){
        pushed.func.apply(undefined, [v,...pushed.args]).then((v)=>{pushed.callback(v);runTheCallbackViaDescriptor({
            extra: (pushed.runCallbackWithValue) ? v : undefined,
            id: pushed.id,
            type: "callbackFunc"
        }); flush(v);});
        
        return;
    } else {
        
        let vnew = pushed.func(v, ...pushed.args);
        
        // state++;
        pushed.callback(vnew);
        flush(vnew);
        
        
    }
    
}
self.addEventListener('message', (ev: {
    data: WorkerProtocalMsg
} )=>{
    let msg = ev.data;
    let locked: Function;
    let locked2: Function = ()=>{

    };
    //There is literally no other (quick) way
    // Don't put this as a bug report
    //Please enable unsafe-eval
    eval("locked = "+ msg.func);
    // eval("locked2 = "+ msg.callback);
    
    switch (msg.type) {
        case "asyncPush":
            fnArray.push({
                args: msg.args,
                async: true,
                func: locked,
                callback: locked2,
                id: msg.id,
                runCallbackWithValue: msg.runCallbackWithValue
            });
            break;
        case "push":
            fnArray.push({
                args: msg.args,
                async: false,
                func: locked,
                callback: locked2,
                id: msg.id,
                runCallbackWithValue: msg.runCallbackWithValue
            });
            break;
        case "globalscope":
            self["variablesScope"][msg.name] = msg.data;
            break;
        case "flush":
            flush("Started flushing!");
            break;
        default:
            break;
    }
})