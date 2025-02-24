import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../../../core/supabase/supabase';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  private readonly supabaseClient: SupabaseClient = supabaseClient;

  constructor() {}

  async insert<T>(table: string, data: T): Promise<any> {
    try {
      const resp = await this.supabaseClient.from(table).insert(data).select();
      return resp.data?.at(0);
    } catch (error) {
      throw error;
    }
  }

  async update(query: {
    table: string;
    value: string;
    column: string;
    data: Record<string, any>;
  }): Promise<void> {
    try {
      const response = await this.supabaseClient
        .from(query.table)
        .update(query.data)
        .eq(query.column, query.value);
    } catch (error) {
      throw error;
    }
  }

  async getAllByUserId<T>(table: string, user_id: string): Promise<T[]> {
    try {
      const response = await this.supabaseClient
        .from(table)
        .select()
        .eq('user_id', user_id);
      return response.data as T[];
    } catch (error) {
      throw error;
    }
  }

  async getSingleByUserId<T>(query: {
    table: string;
    user_id: string;
    id: string;
  }): Promise<T> {
    try {
      const response = await this.supabaseClient
        .from(query.table)
        .select()
        .filter('user_id', 'is', query.user_id)
        .filter('id', 'id', query.id);
      return response.data?.at(0) as T;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(data: { table: string; id: string }) {
    try {
      const response = await this.supabaseClient
        .from(data.table)
        .delete()
        .eq('id', data.id);
    } catch (error) {
      throw error;
    }
  }

  async getSingleById<T>(data: {
    table: string;
    property: string;
    value: string;
  }): Promise<T> {
    try {
      const response = await this.supabaseClient
        .from(data.table)
        .select()
        .eq(data.property, data.value);
      return response.data?.at(0) as T;
    } catch (error) {
      throw error;
    }
  }

  async getInnerJoin<T>(data: { table: string; query: string }): Promise<T[]> {
    try {
      const response = await this.supabaseClient
        .from(data.table)
        .select(data.query);
      return response.data as T[];
    } catch (error) {
      throw error;
    }
  }

  async getInnerJoinWithWhere<T>(data: {
    table: string;
    query: string;
    property: string;
    value: string;
  }): Promise<T[]> {
    try {
      const response = await this.supabaseClient
        .from(data.table)
        .select(data.query)
        .eq(data.property, data.value);
      return response.data as T[];
    } catch (error) {
      throw error;
    }
  }

  async getDataEqualAndLike<T>(query: {
    table: string;
    grade: string;
    like: string;
  }): Promise<T> {
    const { data, error } = await this.supabaseClient
      .from(query.table)
      .select('*')
      .eq('grade', query.grade)
      .ilike('name', `%${query.like}%`)
      .limit(1);

    if (error) {
      throw error;
    }
    return data.at(0) as any;
  }
}
