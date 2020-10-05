import { 
    isBrowser, getRequestHeader, 
    getDownloadRequestHeader, getUploadRequestHeader 
} from "../utils/requestUtil";
import { fetch, localFetch } from "../utils/fetch";

export default function Attachment(opts) {

    const attachmentConf = {
        attachmentUrl: `${opts.endpointUrl}/${opts.apiVersion}/attachment`,
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
        upload: upload,
        download: download,
        updateMetadata: updateMetadata,
        destroy: destroy
    });

    async function upload(file, metadata, uploadProgress) {
        if(file) {
            metadata = metadata || {};
            if(!metadata.id) {
                method = "PUT";
                metadata = await fetch(`${conf.attachmentUrl}`, {
                    method: "POST",
                    headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                    body: {
                        name: metadata.name || file.name,
                        file_type: file.type,
                        workspace_id: metadata.workspaceId,
                        item_id: metadata.objectId
                    }
                });
            }
            const formData = new FormData();
            formData.append("file", file);
            await fetch(`${conf.attachmentUrl}/${metadata.id}/upload`, {
                method: "POST",
                headers: getUploadRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: formData,
                uploadProgress: uploadProgress
            });
            return metadata;
        }
        throw new Error("File not provided!");   
    }

    async function updateMetadata(metadata) {
        if (metadata && metadata.id) {
            const response = await fetch(`${conf.attachmentUrl}/${attachment.id}`, {
                method: "PUT",
                headers: getRequestHeader(conf.apiKey, conf.apiKeyHeader),
                body: attachment
            });
            return response;
        }
        throw new Error("Attachment metadata or file id not provided!");
    }

    async function download(attachmentId) {
      if(attachmentId) {
        const response = await fetch(`${conf.attachmentUrl}/${attachmentId}/download`, {
            method: "GET",
            headers: getDownloadRequestHeader(conf.apiKey, conf.apiKeyHeader),
            responseType: "blob"
        });
        return response;
      }
      throw new Error("File Id not provided!");    
    }

    async function destroy(attachmentId) {
        if (attachmentId) {
            const response = await fetch(`${conf.attachmentUrl}/${attachmentId}`, {
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
        upload: upload,
        download: download,
        updateMetadata: updateMetadata,
        destroy: destroy
    });

    async function upload(file, metadata, uploadProgress) {
        return await localFetch("attachment.upload", {
            metadata: metadata,
            file: file,
            uploadProgress: uploadProgress
        }, conf.apiVersion);
    }

    async function updateMetadata(metadata) {
        return await localFetch("attachment.updateMetadata", {
            metadata: metadata
        }, conf.apiVersion);
    }

    async function download(attachmentId) {
        return await localFetch("attachment.download", {
            attachmentId: attachmentId
        }, conf.apiVersion);  
    }

    async function destroy(attachmentId) {
        return await localFetch("attachment.destroy", { 
            attachmentId:attachmentId
        }, conf.apiVersion);
    }
    
} 