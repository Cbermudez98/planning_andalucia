import { AuthResponse, SupabaseClient } from '@supabase/supabase-js';
import { Injectable } from '@angular/core';
import { supabaseClient } from '../../../core/supabase/supabase';
import { IUser, IUserMetadata } from '../../../interfaces/IUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabaseClient: SupabaseClient = supabaseClient;

  constructor() {}

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
}
