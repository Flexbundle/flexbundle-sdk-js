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
        create: create,
        update: update,
        destroy: destroy
    });

    async function create(file, formData) {
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

}

function AttachmentLocal(conf = {}) {

    return Object.freeze({
        create: create,
        update: update,
        destroy: destroy
    });

    async function create(objectId, file) {
        return await localFetch("workspace.uploadFile", {
            workspaceId: conf.workspaceId,
            objectId: objectId,
            file: file
        }, conf.apiVersion);
    }

    async function update(attachment) {
        return await localFetch("attachment.update", { attachment }, conf.apiVersion);
    }

    async function destroy(attachment) {
        return await localFetch("attachment.destroy", { attachment }, conf.apiVersion);
    }
    
} 