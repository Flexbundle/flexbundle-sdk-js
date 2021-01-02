import { 
    isBrowser, getQueryString, getRequestHeader
} from "../utils/requestUtil";
import { fetch, localFetch } from "../utils/fetch";

export default function Groups(opts) {

    const groupsConf = {
        groupsUrl: `${opts.endpointUrl}/${opts.apiVersion}/group`,
        apiKey: opts.apiKey,
        apiKeyHeader: opts.apiKeyHeader,
        apiVersion: opts.apiVersion
    };

    return groupsConf.apiKey
        ? GroupsApi(groupsConf)
        : isBrowser && GroupsLocal(groupsConf);
}

function GroupsApi(conf) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        destroy: destroy
    });

    async function get(query) {
        const requestParams = query && getQueryString(query);
        const requestUrl = requestParams
            ? `${conf.groupsUrl}?${requestParams}`
            : `${conf.groupsUrl}`;
        const response = await fetch(requestUrl, {
            method: "GET",
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
        });
        return response;
    }

    async function getById(id) {
        if (id) {
            const response = await fetch(`${conf.groupsUrl}/${id}`, {
                method: "GET",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        return null;
    }

    async function create(group) {
        const response = await fetch(`${conf.groupsUrl}`, {
            method: "POST",
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
            body: group
        });
        return response;
    }

    async function update(group) {
        if (group && group.id) {
            const response = await fetch(`${conf.groupsUrl}/${group.id}`, {
                method: "PUT",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: group
            });
            return response;
        }
        throw new Error("Group Id not provided!");
    }

    async function destroy(group) {
        if (group && group.id) {
            const response = await fetch(`${conf.groupsUrl}/${group.id}`, {
                method: "DELETE",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        throw new Error("Group Id not provided!");
    }

}

function GroupsLocal(conf = {}) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        destroy: destroy
    });

    async function get(query) {
        return await localFetch("group.get", { query }, conf.apiVersion);
    }

    async function getById(id) {
        return await localFetch("group.getById", { id }, conf.apiVersion);
    }

    async function create(group) {
        return await localFetch("group.create", { group }, conf.apiVersion);
    }

    async function update(group) {
        return await localFetch("group.update", { group }, conf.apiVersion);
    }

    async function destroy(group) {
        return await localFetch("group.destroy", { group }, conf.apiVersion);
    }
 
} 