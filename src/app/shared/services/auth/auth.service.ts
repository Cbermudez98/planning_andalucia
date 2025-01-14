import { AuthResponse, SupabaseClient } from '@supabase/supabase-js';
import { Injectable } from '@angular/core';
import { supabaseClient } from '../../../core/supabase/supabase';
import { IUser, IUserLogin, IUserMetadata } from '../../../interfaces/IUser';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabaseClient: SupabaseClient = supabaseClient;

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router
  ) {}

  async create(user: IUser, metadata: IUserMetadata): Promise<AuthResponse> {
    try {
      return await this.supabaseClient.auth.signUp({
        ...user,
        options: {
          data: metadata,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: IUserLogin) {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) {
      throw new Error();
    }
    return data;
  }

  async refresh() {
    const session = await this.isLogin();
    const { data, error } = await this.supabaseClient.auth.refreshSession({
      refresh_token: session.data.session?.refresh_token || '',
    });
    if (error) {
      throw error;
    }
    return data;
  }

  async isLogin() {
    return await this.supabaseClient.auth.getSession();
  }

  async onAuthStatChange() {
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        this.storageService.clear();

        this.router.navigate(['/']);
      }
    });
  }

  async getCurrentName(): Promise<string> {
    const auth = await this.isLogin();
    const { name, last_name } = auth.data.session?.user.user_metadata as any;
    return `${name} ${last_name}`;
  }

  async logOut() {
    await this.supabaseClient.auth.signOut({
      scope: 'global',
    });
  }
}
