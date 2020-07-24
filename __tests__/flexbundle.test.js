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

    it("makes a workspace fields request", async () => {
        const Flexbundle = fakeFlexbundle();
        const fields = await Flexbundle.workspace("123").fields();
        expect(fields.length).toBeGreaterThan(0);
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

    it("makes a get objects request", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const objects = await Flexbundle.workspace("123").get();
        expect(objects.length).toBeGreaterThan(0);
    });

    it("makes a get object by id request", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").getById(2);
        expect(object.col1).toBeDefined();
    });

    it("makes a create object request", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").create(
            { col1: "Dummy", col2: "4Real", workspace_id: "123" }
        );
        expect(object.id).toBeDefined();
    });

    it("makes a update object request", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").update(
            { id: 2, col1: "John", col2: "Lenon", workspace_id: "123" }
        );
        expect(object.col2).toBe("Lenon");
    });

    it("makes a partial update object request", async () => {
        const Flexbundle = fakeLocalFlexbundle();
        const object = await Flexbundle.workspace("123").partialUpdate(
            { id: 2, col2: "Doe" }
        );
        expect(object.col2).toBe("Doe");
    });

    it("makes a destroy object request", async () => {
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

