import assert from "node:assert/strict";
import test from "node:test";
import { getReplicaId } from "../src/replica-id.mjs";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

test("reuses a replica ID for the same tab and creates a distinct ID for another tab", () => {
  let generated = 0;
  const randomValues = (bytes) => {
    bytes.fill(++generated);
    return bytes;
  };
  const firstTabStorage = createStorage();
  const secondTabStorage = createStorage();

  const firstTabId = getReplicaId("demo-room", firstTabStorage, randomValues);
  const reloadedTabId = getReplicaId("demo-room", firstTabStorage, randomValues);
  const secondTabId = getReplicaId("demo-room", secondTabStorage, randomValues);

  assert.match(firstTabId, /^tab-[a-f0-9]{32}$/);
  assert.equal(reloadedTabId, firstTabId);
  assert.notEqual(secondTabId, firstTabId);
});

test("uses a separate replica ID for each document in a tab", () => {
  const storage = createStorage();
  const randomValues = (() => {
    let generated = 0;
    return (bytes) => {
      bytes.fill(++generated);
      return bytes;
    };
  })();

  assert.notEqual(
    getReplicaId("demo-room", storage, randomValues),
    getReplicaId("another-room", storage, randomValues)
  );
});
