export type FunctionDescriptor = {
    async: boolean,
    args: any[],
    func: Function,
    callback: Function,
    id: number,
    runCallbackWithValue?: boolean
}
export type WorkerProtocalMsg = {
    type: "push"|"asyncPush"|"flush"|"globalscope"
    func: string,
    args: any[],
    callback: string,
    id: number,
    runCallbackWithValue?: boolean,
    name?: string,
    data?: string
}
export type ClientSideCallbackMapDescriptor = {
    func: (result)=>any,
    id: number

}
export type ClientSideMatchDescriptor = {type: "callbackFunc", id?: number, extra: any};