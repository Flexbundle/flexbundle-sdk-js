import _ from "lodash";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import FlexbundleSdk from "../../src/flexbundle-sdk";

const port = 3100;

const token = "123";

const fields = [
    {name: "col1", label: "First Name", type: "string", workspace_id: "123"},
    {name: "col2", label: "Last Name", type: "string", workspace_id: "123"}
];

const data = [
    {id: 1, col1: "John", col2: "Doe", workspace_id: "123"},
    {id: 2, col1: "Marie", col2: "Doe", workspace_id: "123"},
    {id: 3, col1: "Dummy", col2: "Doe", workspace_id: "123"},
    {id: 4, col1: "Dummy", col2: "Doe", workspace_id: "123"}
];

let server = null;

beforeAll(async () => {
    startLocalMock();
    server = await startMock();
});

afterAll(async () => {
   server && await server.close();
});

test("server sucessfully started", async () => {
    expect(server).toBeDefined();
});

export function fakeFlexbundle() {
    return FlexbundleSdk({
        endpointUrl: `http://localhost:${port}`,
        apiVersion: "v1",
        apiKey: token,
        apiKeyHeader:"-u"
    });
}

export function fakeLocalFlexbundle() {
    return FlexbundleSdk({ apiVersion: "v1" });
}

function startMock() {

    return new Promise((resolve) => {

        const app = express();

        app.use(cors());

        app.use(bodyParser.json());

        app.use(authMiddleware);

        app.get("/v1/field", (req, res) => {
            res.json(fields);
        });

        app.get("/v1/:workspaceId/object", (req, res) => {
            res.json(data);
        });

        app.get("/v1/:workspaceId/object/:id", (req, res) => {
            const object = _.find(data, obj => obj.id == req.params.id);
            res.json(object);
        });

        app.post("/v1/:workspaceId/object", (req, res) => {
            const obj = req.body || {};
            obj.id = data.length + 1;
            data.push(obj)
            res.json(obj);
        });
    
        app.put("/v1/:workspaceId/object/:id", update);
    
        app.patch("/v1/:workspaceId/object/:id", update);
    
        app.delete("/v1/:workspaceId/object/:id", (req, res) => {
            const index = _.findIndex(data, o => o.id == req.params.id);
            const deleted = index !== -1 && data.splice(index, 1);
            res.json(deleted && deleted[0]);
        });   
        
        app.post("/v1/function/dummy/execute", (req, res) => {
            res.json(req.body);
        })
        
       const server = app.listen(port, () => resolve(server));

    });
    
    function update(req, res) {
        const obj = _.find(data, o => o.id == req.params.id);
        if(!obj) {
            res.status(400).json({error: "Object not found"}); 
        } else {
            res.json( _.extend(obj, req.body || {}));
        } 
    }
    
    function authMiddleware(req, res, next) {
        if (req.get('-u') === token) {
            next();
        } else {
            res.status(401).json({error: "Non authorized request"})
        }
    }

}

function startLocalMock() {
    window.addEventListener("message", async (e) => {
        const request = e.data;
        request.requestId && resolveParentRequest(request);
    });
    
    async function resolveParentRequest(request) {
        const parts = request.method && request.method.split(".");
        if (!_.isEmpty(parts) && parts.length == 2) {
            const flexbundleSdk = fakeFlexbundle();
            const requestId = request.requestId;
            const requestData = request.data;
            const requestType = parts[0];
            const requestName = parts[1];
            let data = null;
            let error = null;
            try {
                if (requestType === "workspace") {
                    const workspace = flexbundleSdk.workspace(requestData.workspaceId);
                    data = await workspace[requestName]
                        (requestData.query || requestData.object || requestData.id);
                } else if (requestType === "functions") {
                    data = await flexbundleSdk.execute(requestData.function, requestData.data);
                } else {
                    error = `Unknow request type ${requestType}`;
                }
            } catch (e) { error = e.message; }
            window.postMessage({
                topic: requestId,
                data: data,
                error: error
            }, "*");
        }
    }

}




