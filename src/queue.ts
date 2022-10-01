import { ClientSideCallbackMapDescriptor, ClientSideMatchDescriptor, WorkerProtocalMsg } from './workerprotocal'

/**
 * The main class related to the project
 * This is a class representing worker methods
 */
class WorkerQueue {
    worker: Worker
    terminated: boolean;
    id: number;
    clientSideMap: ClientSideCallbackMapDescriptor[]
    private send(wp: WorkerProtocalMsg) {
        this.worker.postMessage(wp);
    }
    /**
     * Flushes the function queue inside of the worker.
     * @returns If the worker is terminated, returns undefined;
     */
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
     * 
     * @param varName The name to insert into the worker scope
     * @param data The data to be cloned. THIS MUST BE CLONEABLE BY WORKERS
     */
    addVarToWorkerScope(varName: string, data: any)
    {
        let finalData = data;
        if (data instanceof Function){
            finalData = data.toString();
        }
        this.send({
            type: "globalscope",
            id: undefined,
            callback: undefined,
            args: undefined,
            func: undefined,
            data: finalData,
            name: varName
        });
    }    
    /**
     * Executes the function in the context of the worker
     * 
     * @param func Note that this function uses string conversions so the current scope is unavailable. Assume your code is running in the worker scope;
     * @param callback Executes the callback when the queue reaches your function. The first argument is always the previous returned value.  This will execute in the context of the DOM and the main thread so make sure to use THIS ONLY for the DOM Manipulation
     * @param parameters... parameters to be passed to the function
     * @param runCallbackWithValue Use this if you need the callback to be called with the result from the function. USE THIS ONLY IF YOUR VALUE RETURN TYPE CAN BE CLONED
     * @param async Set this value if the function your passing is asynchronous. Do not assume that setting this to false will make your function synchronous.
     */
    push(func: (prevVal, ...args: string[])=>any, callback: (returnval)=>void,async: boolean, runCallbackWithValue: boolean,  ...parameters: any[]){
        if (this.terminated) return;
        // console.debug('Pushing function with name: ' + func.name);
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
                // console.debug("Calling callback function id: "+ dat.id);
                this.clientSideMap.shift().func(dat.extra);
            }
        }
    }
    /**
     * Two bundles will be generated after the build. Please specify where you put the worker bundle in the workerPath argument. Otherwise the worker queue will not start
     * @param workerPath The worker path is the built worker bundle path
     * 
     */
    constructor(workerPath: string) {
        this.id = 0;
        this.worker = new Worker(workerPath);
        this.worker.onmessage = (ev)=>{
            this.handleMessage(ev.data);
        }
        this.clientSideMap = [];
    }
}
export {WorkerQueue};
export var variablesScope = {};


