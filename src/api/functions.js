import { toUpper, startsWith } from "lodash";
import { isBrowser, getRequestHeader } from "../utils/requestUtil";
import { fetch, localFetch } from "../utils/fetch";

export default function functionExecution (opts) {

    const functionsConf = {
        functionsUrl: `${opts.endpointUrl}/${opts.apiVersion}/function`,
        apiKey: opts.apiKey,
        apiKeyHeader: opts.apiKeyHeader,
        apiVersion: opts.apiVersion,
    }

    return Object.freeze({ execute: execute });

    async function execute(functionUrl, options = {}) {
        if(functionUrl) {
            options = options || {};
            const url = getFunctionUrl(functionUrl);
            const method = toUpper(options.method) || "GET";
            if(functionsConf.apiKey) {
                return  await executeApiFunction(url, method, options.data);
            } else if(isBrowser) {
                return await executeLocalFunction(url, method, options.data);
            } else {
                throw new Error("No api key provided for function!");
            }
        } else {
            throw new Error("Function name not provided!");
        }
    }

    async function executeApiFunction(functionUrl, method, data) {
        return await fetch(functionUrl, {
            method: method,
            withCredentials: true,
            credentials: "include",
            headers: getRequestHeader(functionsConf.apiKey, functionsConf.apiKeyHeader),
            body: data
        });
    }
    
    async function executeLocalFunction(functionUrl, method, data) {
        return await localFetch("functions.execute", {
            method: method,
            function: functionUrl,  
            data: data
        }, functionsConf.apiVersion);
    }

    function getFunctionUrl(candidateUrl) {
        let url = candidateUrl;
        if(!url) {
            throw new Error("Function url not provided!");   
        } else if(!startsWith(url, functionsConf.functionsUrl)) {
            if(/^\/?[0-9a-fA-F]{8}\/[a-zA-Z0-9_]{1}(\??.*)?$/.test(url)) {
                url = `${functionsConf.functionsUrl}/${url}`;
            } else {
                throw new Error("Function relative path {"+url+"} not valid!");   
            }
        } 
        return url;       
    }
}