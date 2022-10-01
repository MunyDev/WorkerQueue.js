import { ClientSideCallbackMapDescriptor, ClientSideMatchDescriptor, WorkerProtocalMsg } from './workerprotocal'

class WorkerQueue {
    worker: Worker
    terminated: boolean;
    id: number;
    clientSideMap: ClientSideCallbackMapDescriptor[]
    private send(wp: WorkerProtocalMsg) {
        this.worker.postMessage(wp);
    }
    flush(){
        if (this.terminated) return;
        this.send({
            args: undefined,
            func: undefined,
            callback: undefined,
            id:undefined,
            type: "flush"
            
        });
    }
    /**
     * Executes the function in the context of the worker
     * 
     * @param func 
     * @param callback Executes the callback when the queue reaches your function. The first argument is always the previous returned value. Note that this function uses string conversions so the current scope is unavailable. Assume your code is running in the worker scope;
     * @param parameters... parameters to be passed to the function
     * @param async Set this value if the function your passing is asynchronous. Do not assume that setting this to false will make your function synchronous.
     */
    push(func: (prevVal, ...args: string[])=>any, callback: (returnval)=>void,async: boolean, runCallbackWithValue: boolean,  ...parameters: any[]){
        if (this.terminated) return;
        console.debug('Pushing function with name: ' + func.name);
        this.id++
        this.clientSideMap.push({
            func: callback,
            id: this.id
        });
        this.send(
            {
                "type": (async) ? "asyncPush": "push",
                func: func.toString(),
                args: parameters,
                callback: callback.toString(),
                id: this.id,
                runCallbackWithValue: runCallbackWithValue
            }
        );
    }
    
    
    /**
     * Attempts to immediately terminate the last function inserted(doesn't work :() 
     * Probably adding this feature soon
     */
    pop() {
        
    }
    terminate() {
        this.worker.terminate();
    }
    private handleMessage(dat: ClientSideMatchDescriptor) {
        if (dat.type === "callbackFunc"){
            if (dat.id){
                console.debug("Calling callback function id: "+ dat.id);
                this.clientSideMap.shift().func(dat.extra);
            }
        }
    }
    constructor() {
        this.id = 0;
        this.worker = new Worker('./dist/bundle/worker.bundle.js');
        this.worker.onmessage = (ev)=>{
            this.handleMessage(ev.data);
        }
        this.clientSideMap = [];
    }
}
export {WorkerQueue};



