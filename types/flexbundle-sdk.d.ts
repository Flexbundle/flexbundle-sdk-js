export function FlexbundleSdk(opts?: FlexbundleSdkOpts): IFlexbundleSdk;

export interface IFlexbundleSdk {
    /**
     * Configures Flexbundle SDK.
     *
     * @param {FlexbundleSdkOpts} a Flexbundle configuration options.
     * @returns {void} 
     */
    configure(opts: FlexbundleSdkOpts): void;

    /**
     * Access to a flexbundle workspace.
     *
     * @param {string} the workspace id.
     * @returns {Workspace} 
     */
    workspace(workspaceId: string): Workspace;

    /**
     * Executes a flexbundle function.
     *
     * @param {string} the function name.
     * @param {any} the function payload.
     * @returns {Promise<any>} 
     */
    execute(functionName: string, options?: any): Promise<any>;

    /**
     * Publishes an event to Flexbundle SDK event bus.
     *
     * @param {string} the topic to publish.
     * @param {any} the event payload.
     */
    publish(topic: string, data?: any): void;

    /**
     * Subscribes to an event from Flexbundle SDK event bus.
     *
     * @param {string} the topic to subscribe.
     * @param {(data: any) => any)} the event handler function.
     * @returns {() => void} the function to call in order to unsubscribe to the event.
     */
    subscribe(topic: string, handler: (data: any) => any): () => void;
}

export type FlexbundleSdkOpts = {
    endpointUrl?: string,
    apiVersion?: string,
    apiKey?: string,
    apiKeyHeader?: string
}

export type WorkspaceQuery = {
    fields?: string,
    query?: object,
    sort?: string,
    limit?: number,
    offset?: number
}

export interface WorkspaceObject {
    [key: string]: any
}

export interface WorkspaceField extends WorkspaceObject {}

export interface Workspace {
    get(query: WorkspaceQuery): Promise<WorkspaceObject[]>;
    getById(id: string): Promise<WorkspaceObject>;
    create(object: WorkspaceObject): Promise<WorkspaceObject>;
    update(object: WorkspaceObject): Promise<WorkspaceObject>;
    partialUpdate(object: WorkspaceObject): Promise<WorkspaceObject>;
    destroy(object: WorkspaceObject): Promise<WorkspaceObject>;
    fields(): Promise<WorkspaceField[]>;
}
