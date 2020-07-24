import { EventBus } from "../src/utils/eventBus";

describe("Event Bus Messaging", () => {

    it("calls subscription handler", async (done) => {
        const topic = "dummy.subs1";
        const unsub = EventBus.subscribe(topic, (data) => {
            unsub();
            expect(data).toBeDefined();
            done();
        });
        EventBus.publish(topic, {});
    });

    it("unsubscribes an event", async () => {
        const topic = "dummy.subs2";
        const unsub = EventBus.subscribe(topic, () => {});
        unsub();
        expect(EventBus.hasListeners(topic)).toBe(false);
    });

});