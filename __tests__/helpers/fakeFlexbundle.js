import _ from "lodash";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import FlexbundleSdk from "../../src/flexbundle-sdk";

const port = 3100;

const token = "123";

const fields = [
    { name: "col1", label: "First Name", type: "string", workspace_id: "123" },
    { name: "col2", label: "Last Name", type: "string", workspace_id: "123" },
    { name: "col3", label: "Gender", type: "string", workspace_id: "123", helper: JSON.stringify([{ value: "M" }, { value: "F" }]) }
];

const data = [
    { id: 1, col1: "John", col2: "Doe", workspace_id: "123" },
    { id: 2, col1: "Marie", col2: "Doe", workspace_id: "123" },
    { id: 3, col1: "Dummy", col2: "Doe", workspace_id: "123" },
    { id: 4, col1: "Dummy", col2: "Doe", workspace_id: "123" }
];

const users = [
    { id: 1, name: "John Doe", email: "john@doe.test", active: true },
    { id: 2, name: "Marie Doe", email: "marie@doe.test", active: false },
    { id: 3, name: "Mario Doe", email: "mario@doe.test", active: true },
    { id: 4, name: "Elton Doe", email: "elton@doe.test", active: true }
];

const groups = [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
    { id: 3, name: "Group 3" },
    { id: 4, name: "Group 4" }
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
        apiKeyHeader: "-u"
    });
}

export function fakeLocalFlexbundle() {
    Object.defineProperty(document, 'referrer', { value: "*" });
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

        app.get("/v1/workspace/:workspaceId/object", (req, res) => {
            res.json(data);
        });

        app.get("/v1/workspace/:workspaceId/object/:id", (req, res) => {
            const object = _.find(data, obj => obj.id == req.params.id);
            res.json(object);
        });

        app.post("/v1/workspace/:workspaceId/object", (req, res) => {
            const obj = req.body || {};
            obj.id = data.length + 1;
            data.push(obj)
            res.json(obj);
        });

        app.put("/v1/workspace/:workspaceId/object/:id", update);

        app.patch("/v1/workspace/:workspaceId/object/:id", update);

        app.delete("/v1/workspace/:workspaceId/object/:id", (req, res) => {
            const index = _.findIndex(data, o => o.id == req.params.id);
            const deleted = index !== -1 && data.splice(index, 1);
            res.json(deleted && deleted[0]);
        });

        app.get("/v1/user", (req, res) => { res.json(users) });

        app.get("/v1/user/:id", (req, res) => {
            const user = _.find(users, u => u.id == req.params.id);
            res.json(user);
        });

        app.post("/v1/user", (req, res) => {
            const user = req.body || {};
            user.id = users.length + 1;
            users.push(user)
            res.json(user);
        });

        app.put("/v1/user/:id", (req, res) => {
            const user = _.find(users, u => u.id == req.params.id);
            if (!user) {
                res.status(400).json({ error: "User not found" });
            } else {
                res.json(_.extend(user, req.body || {}));
            }
        });

        app.delete("/v1/user/:id", (req, res) => {
            const index = _.findIndex(users, u => u.id == req.params.id);
            const deleted = index !== -1 && users.splice(index, 1);
            res.json(deleted && deleted[0]);
        });

        app.get("/v1/group", (req, res) => { res.json(groups) });

        app.get("/v1/group/:id", (req, res) => {
            const group = _.find(groups, g => g.id == req.params.id);
            res.json(group);
        });

        app.post("/v1/group", (req, res) => {
            const group = req.body || {};
            group.id = group.length + 1;
            groups.push(group)
            res.json(group);
        });

        app.put("/v1/group/:id", (req, res) => {
            const group = _.find(groups, g => g.id == req.params.id);
            if (!group) {
                res.status(400).json({ error: "Group not found" });
            } else {
                res.json(_.extend(group, req.body || {}));
            }
        });

        app.delete("/v1/group/:id", (req, res) => {
            const index = _.findIndex(groups, g => g.id == req.params.id);
            const deleted = index !== -1 && groups.splice(index, 1);
            res.json(deleted && deleted[0]);
        });

        app.post("/v1/function/dummy/execute", (req, res) => {
            res.json(req.body);
        });

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
            res.status(401).json({ error: "Non authorized request" })
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
                } else if (requestType === "user") {
                    const users = flexbundleSdk.users();
                    data = await users[requestName]
                        (requestData.query || requestData.user || requestData.id);
                } else if (requestType === "group") {
                    const groups = flexbundleSdk.groups();
                    data = await groups[requestName]
                        (requestData.query || requestData.group || requestData.id);
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




