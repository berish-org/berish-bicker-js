export interface SubscriptionManager {
  subscribe(callback: () => void): () => void;
  notifyUpdates(): void;
}

export function createSubscriptionManager(): SubscriptionManager {
  const listeners = [];

  return {
    subscribe(listener: () => void) {
      listeners.push(listener);

      return () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },

    notifyUpdates() {
      listeners.forEach((listener) => {
        listener();
      });
    },
  };
}
