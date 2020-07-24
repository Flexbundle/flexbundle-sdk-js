import { forEach, remove, includes, isEmpty } from "lodash";
import { nanoid } from "nanoid";
import { isBrowser } from "./requestUtil";

export const EventBus = (() => {

    const topics = {};
    const disposableTopics = [];
    let subscriptionSeq = 0;

    isBrowser && window.parent &&
        window.addEventListener("message", resolveFrameMessage, false);

    return Object.freeze({
        subscribe: subscribe,
        publish: publish,
        hasListeners: hasListeners,
        publishOnParent: publishOnParent
    });

    function resolveFrameMessage(event) {
        const { topic, data, error } = event.data;
        if(topic && topics[topic]) {
            publish(topic, {data, error});
            if(includes(disposableTopics, topic)) {
                remove(disposableTopics, (t) => t === topic);
                delete topics[topic];
            }
        }
    }

    function subscribe(topic, handler) {
        if (topic && handler) {
            subscriptionSeq++;
            const ref = subscriptionSeq;
            let listeners = topics[topic];
            if(!listeners) {
                listeners = [];
                topics[topic] = listeners;
            }
            listeners.push({ref: ref, handler: handler});
            return () => {
                remove(topics[topic], (subs) => subs.ref === ref);
            };
        }
        return null;
    }

    function publish(topic, data) {
        let listeners = topic && topics[topic];
        forEach(listeners, (listener) => listener.handler(data) );
    }

    function hasListeners(topic) {
        return topic && !isEmpty(topics[topic]);
    }

    function publishOnParent(method, data, version) {
        if(isBrowser && window.parent) {
            const requestId = nanoid();
            window.parent.postMessage({ method, data, requestId, version }, "*");
            disposableTopics.push(requestId);
            return requestId;
        }
        throw new Error("Current environment it's not a browser or parent window doesn't exists");
    }

})();