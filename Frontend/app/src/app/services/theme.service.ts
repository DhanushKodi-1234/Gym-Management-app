import { Injectable, signal, computed } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'growwgym_theme';
  readonly currentTheme = signal<AppTheme>('dark');
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as AppTheme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.setTheme(savedTheme);
        return;
      }
    }
    // Default to dark theme for gym aesthetic
    this.setTheme('dark');
  }

  setTheme(theme: AppTheme): void {
    this.currentTheme.set(theme);
    if (typeof window !== 'undefined') {
      if (window.localStorage) {
        localStorage.setItem(this.THEME_STORAGE_KEY, theme);
      }
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      document.documentElement.classList.remove('dark-theme', 'light-theme');
      document.documentElement.classList.add(`${theme}-theme`);
      document.body.classList.remove('dark-theme', 'light-theme');
      document.body.classList.add(`${theme}-theme`);
    }
  }

  toggleTheme(): void {
    const nextTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }
}
