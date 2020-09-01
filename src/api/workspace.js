import { isBrowser, getQueryString, getRequestHeader } from "../utils/requestUtil";
import { fetch, localFetch } from "../utils/fetch";

export default function Workspace(opts, workspaceId) {

    const workspaceConf = {
        workspaceUrl: `${opts.endpointUrl}/${opts.apiVersion}/workspace/${workspaceId}`,
        fieldsUrl: `${opts.endpointUrl}/${opts.apiVersion}/field`,
        attachmentUrl: `${opts.endpointUrl}/${opts.apiVersion}/attachment`,
        apiKey: opts.apiKey,
        apiKeyHeader: opts.apiKeyHeader,
        apiVersion: opts.apiVersion,
        workspaceId: workspaceId
    };

    if (!workspaceId) {
        throw new Error("Workspace Id not provided!");
    }
    return workspaceConf.apiKey
        ? WorkspaceApi(workspaceConf, workspaceId)
        : isBrowser && WorkspaceLocal(workspaceConf, workspaceId);
}

function WorkspaceApi(conf) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        partialUpdate: partialUpdate,
        destroy: destroy,
        fields: fields,
        uploadFile: uploadFile,
        downloadFile: downloadFile
    });

    async function get(query) {
        const requestParams = query && getQueryString(query);
        const requestUrl = requestParams
            ? `${conf.workspaceUrl}/object?${requestParams}`
            : `${conf.workspaceUrl}/object`;
        const response = await fetch(requestUrl, {
            method: "GET",
            withCredentials: true,
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
        });
        return response;
    }

    async function getById(id) {
        if (id) {
            const response = await fetch(`${conf.workspaceUrl}/object/${id}`, {
                method: "GET",
                withCredentials: true,
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        return null;
    }

    async function create(object) {
        const response = await fetch(`${conf.workspaceUrl}/object`, {
            method: "POST",
            withCredentials: true,
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
            body: object
        });
        return response;
    }

    async function update(object) {
        if (object && object.id) {
            const response = await fetch(`${conf.workspaceUrl}/object/${object.id}`, {
                method: "PUT",
                withCredentials: true,
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: object
            });
            return response;
        }
        throw new Error("Object Id not provided!");
    }

    async function partialUpdate(object) {
        if (object && object.id) {
            const response = await fetch(`${conf.workspaceUrl}/object/${object.id}`, {
                method: "PATCH",
                withCredentials: true,
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: object
            });
            return response;
        }
        throw new Error("Object Id not provided!");
    }

    async function destroy(object) {
        if (object && object.id) {
            const response = await fetch(`${conf.workspaceUrl}/object/${object.id}`, {
                method: "DELETE",
                withCredentials: true,
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
            });
            return response;
        }
        throw new Error("Object Id not provided!");
    }

    async function fields() {
        const requestParams = getQueryString({ 
            query: { 
                workspace_id: conf.workspaceId 
            }, sort: "order_x,id"
        });
        const fields = await fetch(`${conf.fieldsUrl}?${requestParams}`, {
            method: "GET",
            withCredentials: true,
            headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader)
        });
        fields && fields.forEach((field) => {
            const helper = field && field.helper;
            if(helper && (typeof helper === 'string' || helper instanceof String)) {
                try { field.helper = JSON.parse(helper) } 
                catch(e) {}
            }
        });
        return fields;  
    }
    
    async function uploadFile(objectId, file, formData) {
        if(objectId && file) {
            const fileData = await fetch(`${conf.attachmentUrl}`, {
                method: "POST",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: {
                    name: file.name,
                    file_type: file.type,
                    workspace_id: conf.workspaceId,
                    item_id: objectId
                }
            });
            formData = formData || new FormData();
            formData.append("file", file);
            const response = await fetch(`${conf.attachmentUrl}/${fileData.id}/upload`, {
                method: "POST",
                headers: getUploadRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: formData
            });
            return fileData;
        }
        throw new Error("Object Id or file not provided!");    
    }

    async function downloadFile(fileId) {
      if(fileId) {
        const response = await fetch(`${conf.attachmentUrl}/${fileId}/download`, {
            method: "GET",
            headers: getDownloadRequestHeader(conf.apiKey, conf.apiKeyHeader),
            responseType: "blob"
        });
        return response;
      }
      throw new Error("File Id not provided!");    
    }

}

function WorkspaceLocal(conf = {}) {

    return Object.freeze({
        get: get,
        getById: getById,
        create: create,
        update: update,
        partialUpdate: partialUpdate,
        destroy: destroy,
        fields: fields,
        uploadFile: uploadFile,
        downloadFile: downloadFile
    });

    async function get(query) {
        return await localFetch("workspace.get", {
            query: query,
            workspaceId: conf.workspaceId
        }, conf.apiVersion);
    }

    async function getById(id) {
        return await localFetch("workspace.getById", {
            id: id,
            workspaceId: conf.workspaceId
        }, conf.apiVersion);
    }

    async function create(object) {
        return await localFetch("workspace.create", {
            object: object,
            workspaceId: conf.workspaceId
        }, conf.apiVersion);
    }

    async function update(object) {
        return await localFetch("workspace.update", {
            object: object,
            workspaceId: conf.workspaceId
        }, conf.apiVersion);
    }

    async function partialUpdate(object) {
        return await localFetch("workspace.partialUpdate", {
            object: object,
            workspaceId: conf.workspaceId
        }, conf.apiVersion);
    }

    async function destroy(object) {
        return await localFetch("workspace.destroy", {
            object: object,
            workspaceId: conf.workspaceId
        }, conf.apiVersion);
    }

    async function fields() {
        return await localFetch("workspace.fields", {
            workspaceId: conf.workspaceId
        }, conf.apiVersion);
    }

    async function uploadFile(objectId, file) {
        return await localFetch("workspace.uploadFile", {
            workspaceId: conf.workspaceId,
            objectId: objectId,
            file: file
        }, conf.apiVersion);
    }

    async function downloadFile(fileId) {
        return await localFetch("workspace.downloadFile", {
            workspaceId: conf.workspaceId,
            fileId: fileId
        }, conf.apiVersion);
    }

} 