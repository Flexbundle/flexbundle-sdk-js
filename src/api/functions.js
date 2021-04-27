import { toUpper } from "lodash";
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
            if(functionsConf.apiKey) {
                return  await executeApiFunction(functionUrl, options.method, options.data);
            } else if(isBrowser) {
                return await executeLocalFunction(functionUrl, options.method, options.data);
            } else {
                throw new Error("No api key provided for function!");
            }
        } else {
            throw new Error("Function name not provided!");
        }
    }

    async function executeApiFunction(functionUrl, method, data) {
        return await fetch(`${functionsConf.functionsUrl}/${functionUrl}/execute`, {
            method: toUpper(method) || "GET",
            withCredentials: true,
            credentials: "include",
            headers: getRequestHeader(functionsConf.apiKey, functionsConf.apiKeyHeader),
            body: data
        });
    }
    
    async function executeLocalFunction(functionUrl, method, data) {
        return await localFetch("functions.execute", {
            method: toUpper(method) || "GET",
            function: functionUrl,  
            data: data
        }, functionsConf.apiVersion);
    }
}