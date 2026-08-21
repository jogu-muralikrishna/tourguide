import { UserProfile, UserRole } from '../types';
import { eventBus } from './eventBus';

const AUTH_USER_KEY = 'tourguide_auth_user';
const USERS_REGISTRY_KEY = 'tourguide_users_registry';

// Initial default user profiles for development demo
const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    id: 'user-vip-001',
    name: 'Alexander Sterling',
    email: 'alexander.sterling@monaco-voyages.com',
    phone: '+1 (555) 382-9901',
    preferredCurrency: '₹',
    preferredLanguage: 'English',
    role: 'USER',
    travelPreferences: {
      budgetStyle: 'Premium',
      interests: ['Gastronomy', 'Coastal Sanctuaries', 'Helicopter Transit'],
      transportation: 'Fastest',
    },
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'user-admin-001',
    name: 'Chief Dispatcher Vane',
    email: 'admin@tourguide.ai',
    phone: '+1 (800) 992-TOUR',
    preferredCurrency: '₹',
    preferredLanguage: 'English',
    role: 'ADMIN',
    createdAt: '2026-07-15T08:00:00.000Z',
  },
];

export class AuthService {
  private static getStoredUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(USERS_REGISTRY_KEY);
      if (data) return JSON.parse(data);
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    } catch {
      return INITIAL_DEMO_USERS;
    }
  }

  private static saveUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users registry', e);
    }
  }

  static getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      return null;
    }
  }

  static getEffectiveUser(): UserProfile {
    const current = this.getCurrentUser();
    if (current) return current;

    // Guest mode fallback user
    return {
      id: 'guest-session',
      name: 'Guest Traveler',
      email: 'guest@tourguide.internal',
      preferredCurrency: '₹',
      role: 'GUEST',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
  }

  static async signUp(name: string, email: string, role: UserRole = 'USER'): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanEmail = email.trim().toLowerCase();
    const users = this.getStoredUsers();

    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (user) {
      // User already exists, log in
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      eventBus.publish({ type: 'USER_SIGNED_IN', payload: { userId: user.id, email: user.email } });
      return user;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim() || 'Distinguished Traveler',
      email: cleanEmail,
      preferredCurrency: '₹',
      preferredLanguage: 'English',
      role,
      travelPreferences: {
        budgetStyle: 'Balanced',
        interests: ['Beaches', 'Gastronomy', 'Culture'],
        transportation: 'Fastest',
      },
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

    eventBus.publish({ type: 'USER_SIGNED_IN', payload: { userId: newUser.id, email: newUser.email } });
    return newUser;
  }

  static async login(email: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getStoredUsers();

    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      // Auto-provision user in demo mode
      return this.signUp(cleanEmail.split('@')[0], cleanEmail);
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    eventBus.publish({ type: 'USER_SIGNED_IN', payload: { userId: user.id, email: user.email } });
    return user;
  }

  static logout(): void {
    const user = this.getCurrentUser();
    localStorage.removeItem(AUTH_USER_KEY);
    if (user) {
      eventBus.publish({ type: 'USER_SIGNED_OUT', payload: { userId: user.id } });
    }
  }

  static getAllUsers(): UserProfile[] {
    return this.getStoredUsers();
  }
}
