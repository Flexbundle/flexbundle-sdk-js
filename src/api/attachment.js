import { 
    isBrowser, getQueryString, getRequestHeader, 
    getDownloadRequestHeader, getUploadRequestHeader 
} from "../utils/requestUtil";
import { fetch, localFetch } from "../utils/fetch";

export default function Attachment(opts) {

    const attachmentConf = {
        attachmentURL: `${opts.endpointUrl}/${opts.apiVersion}/attachment`,
        apiKey: opts.apiKey,
        apiKeyHeader: opts.apiKeyHeader,
        apiVersion: opts.apiVersion
    };

    return attachmentConf.apiKey
        ? AttachmentApi(attachmentConf)
        : isBrowser && AttachmentLocal(attachmentConf);
}

function AttachmentApi(conf) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        destroy: destroy,
        uploadFile: uploadFile
    });

    async function get(query) {
        const requestParams = query && getQueryString(query);
        const requestUrl = requestParams
            ? `${conf.attachmentURL}?${requestParams}`
            : `${conf.attachmentURL}`;
        const response = await fetch(requestUrl, {
            method: "GET",
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
        });
        return response;
    }

    async function getById(id) {
        if (id) {
            const response = await fetch(`${conf.attachmentURL}/${id}`, {
                method: "GET",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        return null;
    }

    async function create(attachment) {
        const response = await fetch(`${conf.attachmentURL}`, {
            method: "POST",
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
            body: attachment
        });
        return response;
    }

    async function update(attachment) {
        if (attachment && attachment.id) {
            const response = await fetch(`${conf.attachmentURL}/${attachment.id}`, {
                method: "PUT",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: attachment
            });
            return response;
        }
        throw new Error("Attachment Id not provided!");
    }

    async function destroy(attachment) {
        if (attachment && attachment.id) {
            const response = await fetch(`${conf.attachmentURL}/${attachment.id}`, {
                method: "DELETE",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        throw new Error("Attachment Id not provided!");
    }

    async function uploadFile(file, formData) {
        if(file) {
            const fileData = await fetch(`${conf.attachmentUrl}`, {
                method: "POST",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: {
                    name: file.name,
                    file_type: file.type,
                    workspace_id: conf.workspaceId
                }
            });
            formData = formData || new FormData();
            formData.append("file", file);
            const response = await fetch(`${conf.attachmentUrl}/${fileData.id}/upload`, {
                method: "POST",
                headers: getUploadRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: formData
            });
            return response;
        }
        throw new Error("File not provided!");    
    }

}

function AttachmentLocal(conf = {}) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        destroy: destroy,
        uploadFile: uploadFile
    });

    async function get(query) {
        return await localFetch("attachment.get", { query }, conf.apiVersion);
    }

    async function getById(id) {
        return await localFetch("attachment.getById", { id }, conf.apiVersion);
    }

    async function create(attachment) {
        return await localFetch("attachment.create", { attachment }, conf.apiVersion);
    }

    async function update(attachment) {
        return await localFetch("attachment.update", { attachment }, conf.apiVersion);
    }

    async function destroy(attachment) {
        return await localFetch("attachment.destroy", { attachment }, conf.apiVersion);
    }

    async function uploadFile(objectId, file) {
        return await localFetch("workspace.uploadFile", {
            workspaceId: conf.workspaceId,
            objectId: objectId,
            file: file
        }, conf.apiVersion);
    }
    
} 