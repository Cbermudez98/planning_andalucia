import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  set(key: string, data: string): void {
    localStorage.setItem(key, data);
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
