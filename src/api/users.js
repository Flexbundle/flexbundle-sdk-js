import { 
    isBrowser, getQueryString, getRequestHeader, 
    getDownloadRequestHeader, getUploadRequestHeader 
} from "../utils/requestUtil";
import { fetch, localFetch } from "../utils/fetch";

export default function Users(opts) {

    const usersConf = {
        usersUrl: `${opts.endpointUrl}/${opts.apiVersion}/user`,
        apiKey: opts.apiKey,
        apiKeyHeader: opts.apiKeyHeader,
        apiVersion: opts.apiVersion
    };

    return usersConf.apiKey
        ? UsersApi(usersConf)
        : isBrowser && UsersLocal(usersConf);
}

function UsersApi(conf) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        destroy: destroy,
        downloadImage: downloadImage
    });

    async function get(query) {
        const requestParams = query && getQueryString(query);
        const requestUrl = requestParams
            ? `${conf.usersUrl}?${requestParams}`
            : `${conf.usersUrl}`;
        const response = await fetch(requestUrl, {
            method: "GET",
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
        });
        return response;
    }

    async function getById(id) {
        if (id) {
            const response = await fetch(`${conf.usersUrl}/${id}`, {
                method: "GET",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        return null;
    }

    async function create(user) {
        const response = await fetch(`${conf.usersUrl}`, {
            method: "POST",
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
            body: user
        });
        return response;
    }

    async function update(user) {
        if (user && user.id) {
            const response = await fetch(`${conf.usersUrl}/${user.id}`, {
                method: "PUT",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: user
            });
            return response;
        }
        throw new Error("User Id not provided!");
    }

    async function destroy(user) {
        if (user && user.id) {
            const response = await fetch(`${conf.usersUrl}/${user.id}`, {
                method: "DELETE",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        throw new Error("User Id not provided!");
    }

    async function downloadImage(userId) {
      if(userId) {
        const response = await fetch(`${conf.usersUrl}/${userId}/download`, {
            method: "GET",
            headers: getDownloadRequestHeader(conf.apiKey, conf.apiKeyHeader),
            responseType: "blob"
        });
        return response;
      }
      throw new Error("User Id not provided!");    
    }

}

function UsersLocal(conf = {}) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        destroy: destroy,
        downloadImage: downloadImage
    });

    async function get(query) {
        return await localFetch("user.get", { query }, conf.apiVersion);
    }

    async function getById(id) {
        return await localFetch("user.getById", { id }, conf.apiVersion);
    }

    async function create(user) {
        return await localFetch("user.create", { user }, conf.apiVersion);
    }

    async function update(user) {
        return await localFetch("user.update", { user }, conf.apiVersion);
    }

    async function destroy(user) {
        return await localFetch("user.destroy", { user }, conf.apiVersion);
    }

    async function downloadImage(userId) {
        return await localFetch("user.downloadImage", { userId: userId }, conf.apiVersion);
    }
    
} 