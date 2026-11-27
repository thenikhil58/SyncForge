export function getReplicaId(documentId, storage, randomValues) {
  const storageKey = `syncforge.replica.${documentId}`;
  const storedReplicaId = storage.getItem(storageKey);
  if (storedReplicaId && /^tab-[a-f0-9]{32}$/.test(storedReplicaId)) {
    return storedReplicaId;
  }

  const bytes = randomValues(new Uint8Array(16));
  const replicaId = `tab-${Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("")}`;
  storage.setItem(storageKey, replicaId);
  return replicaId;
}
