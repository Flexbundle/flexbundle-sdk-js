import { fakeFlexbundle, fakeLocalFlexbundle } from "./helpers/fakeFlexbundle";

describe("Flexbundle API", () => {

    it("makes a get objects request", async () => {
        const Flexbundle = fakeFlexbundle();
        const objects = await Flexbundle.workspace("123").get();
        expect(objects.length).toBeGreaterThan(0);
    });

    it("makes a get object by id request", async () => {
        const Flexbundle = fakeFlexbundle();
        const object = await Flexbundle.workspace("123").getById(1);
        expect(object.col1).toBeDefined();
    });

    it("makes a create object request", async () => {
        const Flexbundle = fakeFlexbundle();
        const object = await Flexbundle.workspace("123").create(
            { col1: "Dummy", col2: "4Real", workspace_id: "123" }
        );
        expect(object.id).toBeDefined();
    });

    it("makes a update object request", async () => {
        const Flexbundle = fakeFlexbundle();
        const object = await Flexbundle.workspace("123").update(
            { id: 1, col1: "John", col2: "Lenon", workspace_id: "123" }
        );
        expect(object.col2).toBe("Lenon");
    });

    it("makes a partial update object request", async () => {
        const Flexbundle = fakeFlexbundle();
        const object = await Flexbundle.workspace("123").partialUpdate(
            { id: 1, col2: "Doe" }
        );
        expect(object.col2).toBe("Doe");
    });

    it("makes a destroy object request", async () => {
        const Flexbundle = fakeFlexbundle();
        const object = await Flexbundle.workspace("123").destroy(
            { id: 3 }
        );
        expect(object.id).toBe(3);
    });

    it("makes a get users request", async () => {
        const Flexbundle = fakeFlexbundle();
        const users = await Flexbundle.users().get();
        expect(users.length).toBeGreaterThan(0);
    });

    it("makes a get user by id request", async () => {
        const Flexbundle = fakeFlexbundle();
        const user = await Flexbundle.users().getById(1);
        expect(user.name).toBeDefined();
    });

    it("makes a create user request", async () => {
        const Flexbundle = fakeFlexbundle();
        const user = await Flexbundle.users().create(
            { name: "Dummy", email: "dummy@doe.test", active: true }
        );
        expect(user.id).toBeDefined();
    });

    it("makes a update user request", async () => {
        const Flexbundle = fakeFlexbundle();
        const user = await Flexbundle.users().update(
            { id: 1, name: "John Dummy", email: "john@doe.test", active: true }
        );
        expect(user.name).toBe("John Dummy");
    });

    it("makes a destroy user request", async () => {
        const Flexbundle = fakeFlexbundle();
        const user = await Flexbundle.users().destroy(
            { id: 3 }
        );
        expect(user.id).toBe(3);
    });

    it("makes a get groups request", async () => {
        const Flexbundle = fakeFlexbundle();
        const groups = await Flexbundle.groups().get();
        expect(groups.length).toBeGreaterThan(0);
    });

    it("makes a get group by id request", async () => {
        const Flexbundle = fakeFlexbundle();
        const group = await Flexbundle.groups().getById(1);
        expect(group.name).toBeDefined();
    });

    it("makes a create group request", async () => {
        const Flexbundle = fakeFlexbundle();
        const group = await Flexbundle.groups().create(
            { name: "Dummy Group" }
        );
        expect(group.id).toBeDefined();
    });

    it("makes a update group request", async () => {
        const Flexbundle = fakeFlexbundle();
        const group = await Flexbundle.groups().update(
            { id: 1, name: "Dummy Group Updated" }
        );
        expect(group.name).toBe("Dummy Group Updated");
    });

    it("makes a destroy group request", async () => {
        const Flexbundle = fakeFlexbundle();
        const group = await Flexbundle.groups().destroy(
            { id: 3 }
        );
        expect(group.id).toBe(3);
    });

    it("makes a functions request", async () => {
        const Flexbundle = fakeFlexbundle();
        const response = await Flexbundle.execute("dummy", {
            method: "post",
            data: { firstName: "abc" }
        })
        expect(response).toBeDefined();
    });

});

describe("Flexbundle Local (Iframe)", () => {

    it("makes a get objects request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const objects = await Flexbundle.workspace("123").get();
        expect(objects.length).toBeGreaterThan(0);
    });

    it("makes a get object by id request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").getById(2);
        expect(object.col1).toBeDefined();
    });

    it("makes a create object request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").create(
            { col1: "Dummy", col2: "4Real", workspace_id: "123" }
        );
        expect(object.id).toBeDefined();
    });

    it("makes a update object request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").update(
            { id: 2, col1: "John", col2: "Lenon", workspace_id: "123" }
        );
        expect(object.col2).toBe("Lenon");
    });

    /*
    it("makes a partial update object request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").partialUpdate(
            { id: 2, col2: "Doe" }
        );
        expect(object.col2).toBe("Doe");
    });
    */

    it("makes a destroy object request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").destroy(
            { id: 4 }
        );
        expect(object.id).toBe(4);
    });

    it("makes a workspace fields request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const fields = await Flexbundle.workspace("123").get();
        expect(fields.length).toBeGreaterThan(0);
    });

    it("makes a get users request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const users = await Flexbundle.users().get();
        expect(users.length).toBeGreaterThan(0);
    });

    it("makes a get user by id request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const user = await Flexbundle.users().getById(1);
        expect(user.name).toBeDefined();
    });

    it("makes a create user request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const user = await Flexbundle.users().create(
            { name: "Dummy", email: "dummy@doe.test", active: true }
        );
        expect(user.id).toBeDefined();
    });

    it("makes a update user request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const user = await Flexbundle.users().update(
            { id: 1, name: "John Dummy", email: "john@doe.test", active: true }
        );
        expect(user.name).toBe("John Dummy");
    });

    it("makes a destroy user from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const user = await Flexbundle.users().destroy(
            { id: 4 }
        );
        expect(user.id).toBe(4);
    });

    it("makes a get groups request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const groups = await Flexbundle.groups().get();
        expect(groups.length).toBeGreaterThan(0);
    });

    it("makes a get group by id request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const group = await Flexbundle.groups().getById(1);
        expect(group.name).toBeDefined();
    });

    it("makes a create group request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const group = await Flexbundle.groups().create(
            { name: "Dummy Group" }
        );
        expect(group.id).toBeDefined();
    });

    it("makes a update group request from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const group = await Flexbundle.groups().update(
            { id: 1, name: "Group Updated Local" }
        );
        expect(group.name).toBe("Group Updated Local");
    });

    it("makes a destroy group from local", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const group = await Flexbundle.groups().destroy(
            { id: 4 }
        );
        expect(group.id).toBe(4);
    });

    it("makes a functions  request", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const response = await Flexbundle.execute("dummy", {
            method: "post",
            data: { firstName: "abc" }
        })
        expect(response).toBeDefined();
    });

    it("publish/subscribe events", (done) => {
        const Flexbundle = fakeLocalFlexbundle();
        const topic = "dummy.event";
        const unsub = Flexbundle.subscribe(topic, (data) => {
                unsub();
                expect(data).toBeDefined();
                done();
            
        });
        Flexbundle.publish(topic, {});
    });

});

