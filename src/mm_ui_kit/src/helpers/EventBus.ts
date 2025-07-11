import { ref, Ref } from "vue";

// Define an interface for your events
interface EventBusEvents {
  [key: string]: unknown[];
}

interface EventBus {
  events: Ref<EventBusEvents>;
  $on<T>(event: string, callback: (data: T) => void): void;
  $emit<T>(event: string, data: T): void;
}

// Create a ref to store your events
const events = ref<EventBusEvents>({});

// Create EventBus as a generic type
export const eventBus: EventBus = {
  events,
  $on(event, callback) {
    if (!this.events.value[event]) {
      this.events.value[event] = [];
    }
    this.events.value[event].push(callback);
  },
  $emit(event, data) {
    if (this.events.value[event]) {
      this.events.value[event].forEach((callback: (data: unknown) => void) => {
        callback(data);
      });
    }
  },
};
