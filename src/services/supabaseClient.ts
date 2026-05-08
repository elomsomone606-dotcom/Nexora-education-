/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Le client est exporté pour être utilisé dans toute l'application.
// Si les clés sont manquantes, les appels échoueront gracieusement.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { status: 'online', message: 'Connecté au backend Nexora' };
  } catch (err) {
    return { status: 'offline', message: 'Hébergement Supabase non configuré' };
  }
};
