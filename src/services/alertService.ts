import { TravelAlert, AlertType, AlertSeverity, DailyItineraryItem, WeatherData } from '../types';
import { eventBus } from './eventBus';

const STORAGE_KEY = 'tourguide_travel_alerts';

export class AlertService {
  public static getAlerts(): TravelAlert[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveAlerts(alerts: TravelAlert[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts.slice(0, 30)));
    } catch (e) {
      console.error('Error saving alerts', e);
    }
  }

  public static createAlert(
    type: AlertType,
    title: string,
    message: string,
    severity: AlertSeverity = 'INFO',
    actionLink?: string,
    actionLabel?: string
  ): TravelAlert {
    const alerts = this.getAlerts();

    // Prevent duplicate spam alerts within 1 hour
    const existing = alerts.find(
      (a) => a.title === title && Date.now() - new Date(a.createdAt).getTime() < 3600000
    );
    if (existing) {
      return existing;
    }

    const newAlert: TravelAlert = {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
      severity,
      createdAt: new Date().toISOString(),
      read: false,
      actionLink,
      actionLabel,
    };

    alerts.unshift(newAlert);
    this.saveAlerts(alerts);

    eventBus.emit({
      type: 'ALERT_CREATED',
      payload: { alertId: newAlert.id, type, title },
    });

    return newAlert;
  }

  public static markAsRead(alertId: string): void {
    const alerts = this.getAlerts().map((a) => (a.id === alertId ? { ...a, read: true } : a));
    this.saveAlerts(alerts);
  }

  public static markAllAsRead(): void {
    const alerts = this.getAlerts().map((a) => ({ ...a, read: true }));
    this.saveAlerts(alerts);
  }

  public static clearAll(): void {
    this.saveAlerts([]);
  }

  public static getUnreadCount(): number {
    return this.getAlerts().filter((a) => !a.read).length;
  }

  // Evaluate weather and generate proactive alerts without spam
  public static evaluateWeatherAlerts(weather?: WeatherData, destination?: string): void {
    if (!weather) return;

    if (weather.rainProbability >= 65) {
      this.createAlert(
        'WEATHER',
        `High Precipitation Advisory for ${destination || 'Destination'}`,
        `${weather.rainProbability}% rain probability detected (${weather.condition}). Consider shifting outdoor coastal/heritage activities to morning or exploring covered pavilions.`,
        'WARNING',
        '#itinerary',
        'Inspect Schedule'
      );
    }

    if (weather.windSpeed && parseInt(weather.windSpeed) > 35) {
      this.createAlert(
        'WEATHER',
        'High Wind Advisory',
        `Sustained wind gusts of ${weather.windSpeed} detected. Marine/boat transit may face delays.`,
        'INFO'
      );
    }
  }

  // Evaluate budget and generate alert if spending surpasses allocation
  public static evaluateBudgetAlerts(spent: number, budget: number, currency: string = '₹'): void {
    if (budget <= 0) return;

    if (spent > budget) {
      const over = spent - budget;
      this.createAlert(
        'BUDGET',
        'Expedition Budget Overrun',
        `Current recorded spend exceeds planned target by ${currency}${over.toLocaleString()}. The AI Copilot can suggest cheaper alternative activities.`,
        'IMPORTANT',
        '#command-center',
        'Optimize Budget'
      );
    } else if (spent > budget * 0.85) {
      this.createAlert(
        'BUDGET',
        'Budget Threshold (85% Utilized)',
        `You have utilized ${currency}${spent.toLocaleString()} of your ${currency}${budget.toLocaleString()} allocation.`,
        'INFO'
      );
    }
  }
}
