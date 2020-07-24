import { EventBus } from "./eventBus";
import axios from "axios";

export function fetch(url, options) {
    return new Promise((resolve, reject) => {
        axios({
            method: options.method || "get",
            url: url,
            data: options.body,
            headers: options.headers,
            params: options.params
        }).then((response) => resolve(response.data))
        .catch((error) => reject(error.response.data));
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