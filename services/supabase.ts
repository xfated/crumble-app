import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants';

// Create a single supabase client for interacting with your database
const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY ?? ""
const CURRENT_VERSION = "1"

export const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "")

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null; 
}

export function buildSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
        success: true,
        message: "",
        data: data
    }
}

export function buildFailureResponse<T>(error: unknown): ApiResponse<T> {
    return {
        success: false,
        message: (error as Error).message,
        data: null
    }
}

interface CheckVersionRes {
    result: boolean
}

export const checkVersion = async (): Promise<ApiResponse<CheckVersionRes>> => {
    const { data, error } = await supabase.functions.invoke('group-has-match', {
        body: {
                "version": CURRENT_VERSION
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}
