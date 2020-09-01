import { isBrowser } from "./utils/requestUtil";
import { EventBus } from "./utils/eventBus";
import Workspace from "./api/workspace";
import Users from "./api/users";
import functionExecution from "./api/functions";
import Attachment from "./api/attachment";

if (isBrowser) { 
    window.FlexbundleSdk = FlexbundleSdk; 
}

export default function FlexbundleSdk(opts = {}) {

    const config = {
        endpointUrl: "https://api.flexbundle.com",
        apiVersion: "v1",
        apiKeyHeader: "-u"
    };

    configure(opts);

    if (!config.apiKey && !isBrowser) {
        throw new Error("An API key is required to connect to Flexbundle");
    }

    return Object.freeze({
        configure: configure,
        workspace: workspace,
        users, users,
        execute: execute,
        publish: publish,
        subscribe: subscribe
    });

    function configure(opts = {}) {
        config.endpointUrl = opts.endpointUrl || config.endpointUrl;
        config.apiVersion = opts.apiVersion || config.apiVersion;
        config.apiKey = opts.apiKey;
        config.apiKeyHeader = opts.apiKeyHeader || config.apiKeyHeader;
    }

    function workspace(workspaceId) {
        return Workspace(config, workspaceId);
    }

    function users() {
        return Users(config);
    }

    async function execute(functionName, options) {
        return await functionExecution(config)
            .execute(functionName, options);
    }

    function publish(topic, data) {
        EventBus.publish(topic, data);
    }

    function subscribe(topic, handler) {
        return EventBus.subscribe(topic, handler);
    }

    function attachment() {
        return Attachment(config);
    }
}
