import { ClientSideMessage, FunctionDescriptor, WorkerProtocalMsg } from "./workerprotocal";

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
function runTheCallbackViaDescriptor(cliMatch: ClientSideMessage) {
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
        pushed.func.apply(undefined, [v,...pushed.args]).then((v)=>{runTheCallbackViaDescriptor({
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
function postFlushedSignal() {
    let msg: ClientSideMessage = {
        extra: undefined,
        id: 0,
        type: "finishedFlush"
    };
    self.postMessage(msg);
}
// Automatically detects the async
function flushv2(val) {
    if (fnArray.length === 0){
        postFlushedSignal();
        state = 0;
        return;
    }
    console.log(val);
    let shift = fnArray.shift();
    let result = shift.func.apply(undefined, [val, ...shift.args]);
    console.log(shift.runCallbackWithValue);
    if (result instanceof Promise) {
        result.then((value)=>{
            runTheCallbackViaDescriptor({
                id: shift.id,
                extra: (shift.runCallbackWithValue) ? value : undefined,
                type: "callbackFunc"
            });
            flushv2(value);
        }, (v)=>{
            if (!shift.onerror){
                return;
            }
            runTheCallbackViaDescriptor({
                id: shift.onerror,
                extra: (shift.runCallbackWithValue) ? v : undefined,
                type: "callbackFunc"
            });
            
            //Adding continue functionality in a later update
            // For now, any error that occurs, will halt the thread execution, and clear client side map and reinitialize the function queue
            fnArray = [];
            console.error("An error has occurred, terminating queue execution! Continue operations will be provided in v4");
            flushv2(undefined);
        })
    }else{
        runTheCallbackViaDescriptor({
            id: shift.id,
            extra: (shift.runCallbackWithValue) ? result : undefined,
            type: "callbackFunc"
        });
        flushv2(result);
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
    //Please enable unsafe-eval FOR WORKERS PLS!
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
                onerror: msg.error,
                runCallbackWithValue: msg.runCallbackWithValue
            });
            break;
        case "push":
            fnArray.push({
                args: msg.args,
                async: true,
                func: locked,
                callback: locked2,
                id: msg.id,
                onerror: msg.error,
                runCallbackWithValue: msg.runCallbackWithValue
            });
            break;
        case "globalscope":
            self["variablesScope"][msg.name] = msg.data;
            break;
        case "flush":
            flushv2("Started flushing!");
            break;
        default:
            break;
    }
})