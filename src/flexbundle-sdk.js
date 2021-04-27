import { isEmpty } from "lodash";
import { isBrowser } from "./utils/requestUtil";
import { EventBus } from "./utils/eventBus";
import Workspace from "./api/workspace";
import Users from "./api/users";
import Groups from "./api/groups";
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
        groups: groups,
        execute: execute,
        publish: publish,
        subscribe: subscribe,
        attachment: attachment
    });

    function configure(opts = {}) {
        if(!isEmpty(opts)) {
            config.endpointUrl = opts.endpointUrl || config.endpointUrl;
            config.apiVersion = opts.apiVersion || config.apiVersion;
            config.apiKey = opts.apiKey;
            config.apiKeyHeader = opts.apiKeyHeader || config.apiKeyHeader;
        }
    }

    function workspace(workspaceId) {
        return Workspace(config, workspaceId);
    }

    function users() {
        return Users(config);
    }

    function groups() {
        return Groups(config);
    }

    async function execute(functionUrl, options) {
        return await functionExecution(config)
            .execute(functionUrl, options);
    }

    function publish(topic, data, parent) {
        if(parent) {
            EventBus.publishOnParent(topic, data, config.apiVersion);
        } else {
            EventBus.publish(topic, data);
        }
    }

    function subscribe(topic, handler) {
        return EventBus.subscribe(topic, handler);
    }

    function attachment() {
        return Attachment(config);
    }
}
