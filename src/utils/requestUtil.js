import { keys, map, isArray, isObject, isEmpty } from "lodash";

export const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

export const getRequestHeader = (apiKey, apiKeyHeader) => {
    const headers = {
        "Content-Type": "application/json"
    };
    if(apiKey) {
        headers[apiKeyHeader] = apiKey;
    }
    return headers;
}

export const getDownloadRequestHeader = (apiKey, apiKeyHeader) => {
    const headers = {};
    if(apiKey) {
        headers[apiKeyHeader] = apiKey;
    }
    return headers;
}

export const getUploadRequestHeader = (apiKey, apiKeyHeader) => {
    const headers = {
        "Content-Type": "multipart/form-data"
    };
    if(apiKey) {
        headers[apiKeyHeader] = apiKey;
    }
    return headers;
}

export const getQueryString = (query) => {
    const params = [];
    map(keys(query), (key) => {
        let val = query[key];
        if(val) {
            if(isArray(val) || isObject(val)) {
                val = encodeURIComponent(JSON.stringify(val));
            }
            params.push(key+"="+val);
        }        
    });   
    return !isEmpty(params) && params.join("&");
}