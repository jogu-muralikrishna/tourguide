import { AppEvent } from '../types';

type EventListener = (event: AppEvent) => void;

class EventBus {
  private listeners: EventListener[] = [];
  private eventHistory: AppEvent[] = [];

  subscribe(listener: EventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  publish(event: AppEvent): void {
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 100) {
      this.eventHistory.pop();
    }
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in event listener', err);
      }
    });
  }

  emit(event: AppEvent): void {
    this.publish(event);
  }

  getHistory(): AppEvent[] {
    return [...this.eventHistory];
  }
}

export const eventBus = new EventBus();
