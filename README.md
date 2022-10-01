# WorkerQueue.js
A queue and state share for worker operations. Alternative to SharedArrayBuffer

## Usage
Place worker.bundle.js in a javascript directory and reference it creating an instance of workerqueue.  
WorkerQueue needs access to unsafe-eval to clone functions quickly. Please enable unsafe-eval.  
## Worker Scope Variables
These variables are a little bit more complicated. To use worker scope variables, use self["variablesScope"][Your variable name in quotes]  
To add worker scope variables, use addVarToWorkerScope  
## Why is this important
This projects allows for more control over worker operations and easily be able to integrate Web Workers into your projects.
