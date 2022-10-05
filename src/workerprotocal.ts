export type FunctionDescriptor = {
    async: boolean,
    args: any[],
    func: Function,
    callback: Function,
    id: number,
    onerror?: number,
    runCallbackWithValue?: boolean
}
export type WorkerProtocalMsg = {
    type: "push"|"asyncPush"|"flush"|"globalscope"
    func: string,
    args: any[],
    callback: string,
    // onerror: number,
    id: number,
    error:number,
    runCallbackWithValue?: boolean,
    name?: string,
    data?: string
}
export type ClientSideCallbackMapDescriptor = {
    func: (result)=>any,
    id: number

}
export type ClientSideMessage = {type: "callbackFunc"|"finishedFlush", id?: number, extra: any};