const seenInboundMessageIds = new Set<string>();

/** Returns true if this id was already processed (skip handling). False = first time, proceed. */
export const isDuplicateInboundMessageId = (id: string | undefined): boolean => {
  if (!id) {
    return false;
  }

  if (seenInboundMessageIds.has(id)) {
    return true;
  }

  seenInboundMessageIds.add(id);
  return false;
};

/** Clears the dedup set (for tests only). */
export const resetInboundMessageDedupForTests = (): void => {
  seenInboundMessageIds.clear();
};
