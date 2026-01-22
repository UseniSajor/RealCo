/**
 * Event emitter for construction project notifications.
 * Integrate with queue/notification service per spec.
 */

type EventHandler = (payload: unknown) => void | Promise<void>;

const handlers: Map<string, EventHandler[]> = new Map();

export function on(event: string, handler: EventHandler): void {
  const list = handlers.get(event) ?? [];
  list.push(handler);
  handlers.set(event, list);
}

export async function emit(event: string, payload: unknown): Promise<void> {
  const list = handlers.get(event) ?? [];
  for (const h of list) {
    await Promise.resolve(h(payload));
  }
}



