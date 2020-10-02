import { EventBus } from "./eventBus";
import axios from "axios";

export function fetch(url, options) {
    return new Promise((resolve, reject) => {
        options = options ||  {};
        const request = {
            method: options.method || "get",
            url: url,
            data: options.body,
            headers: options.headers,
            params: options.params,
            onUploadProgress: options.uploadProgress || null
        };
        if(options.responseType) {
            request.responseType = options.responseType;
        }
        axios(request).then(response => resolve(response.data))
        .catch((error) => {
            const response = error.response && error.response.data;
            reject(response || error);
        });
    });
}

export function localFetch(method, data, version) {
    return new Promise((resolve, reject) => {
        const channel = EventBus.publishOnParent(method, data, version);
        EventBus.subscribe(channel, (response) => {
            if(response.error) {
                reject(response.error);
            } else {
                resolve(response.data);
            }
        });
    });
}