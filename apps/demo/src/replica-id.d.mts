export type ReplicaStorage = Pick<Storage, "getItem" | "setItem">;
export type RandomValues = (bytes: Uint8Array) => Uint8Array;

export function getReplicaId(
  documentId: string,
  storage: ReplicaStorage,
  randomValues: RandomValues
): string;
