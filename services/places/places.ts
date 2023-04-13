import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'
import { PlaceDetailRow } from './interfaces'
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const SUPABASE_URL = "https://bcrqmjamhjxtdittmwhf.supabase.co"
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcnFtamFtaGp4dGRpdHRtd2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMDQ0NTEsImV4cCI6MTk5NjY4MDQ1MX0.GyD6t8RXw1u9iB5VColnV7QAJ4WhsRRVXU9lM-dSnHA"
const CURRENT_VERSION = "1"

const supabase = createClient(SUPABASE_URL, ANON_KEY)

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null; 
}

function buildSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
        success: true,
        message: "",
        data: data
    }
}

function buildFailureResponse<T>(error: unknown): ApiResponse<T> {
    return {
        success: false,
        message: (error as Error).message,
        data: null
    }
}

interface NearbyPlacesRes {
	next_page_token: string;
	results: PlaceDetailRow[];
}

const getNearbyPlaces = async (category: string, lat: number, long: number, radius: number, nextPageToken: string): Promise<ApiResponse<NearbyPlacesRes>> => {
    const { data, error } = await supabase.functions.invoke('get-nearby-places', {
        body: {
                category,
                lat,
                long,
                radius,
                nextPageToken
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}

interface CreateGroupRes {
    results: PlaceDetailRow[],
    next_page_token: string,
    group_id: string,
}

const createGroup = async (category: string, min_match: number, lat: number, long: number, radius: number): Promise<ApiResponse<CreateGroupRes>> => {
    const { data, error } = await supabase.functions.invoke('create-group', {
        body: {
                category,
                min_match,
                lat,
                long,
                radius,
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}

interface JoinGroupRes {
    results: PlaceDetailRow[],
    next_page_token: string,
    group_id: string,
    place_id?: string,
}

const joinGroup = async (group_id: string): Promise<ApiResponse<JoinGroupRes>> => {
    const { data, error } = await supabase.functions.invoke('join-group', {
        body: {
                group_id
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}

interface GroupGetNearbyPlacesRes {
    results: PlaceDetailRow[],
    next_page_token: string,
    group_id: string,
}

const groupGetNearbyPlaces = async (group_id: string, next_page_token: string): Promise<ApiResponse<GroupGetNearbyPlacesRes>> => {
    const { data, error } = await supabase.functions.invoke('group-get-nearby-places', {
        body: {
                group_id,
                next_page_token
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}


interface AddGroupLikeRes {
    place_id: string | null,
}

const groupAddLike = async (group_id: string, place_id: string): Promise<ApiResponse<AddGroupLikeRes>> => {
    const { data, error } = await supabase.functions.invoke('group-add-like', {
        body: {
                group_id,
                place_id
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}

interface GroupHasMatchRes {
    place_id: string | null
}

const groupHasMatch = async (group_id: string): Promise<ApiResponse<GroupHasMatchRes>> => {
    const { data, error } = await supabase.functions.invoke('group-has-match', {
        body: {
                group_id
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}

interface CheckVersionRes {
    result: boolean
}

const checkVersion = async (): Promise<ApiResponse<CheckVersionRes>> => {
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

export const placeService = {
    getNearbyPlaces,
    createGroup,
    joinGroup,
    groupGetNearbyPlaces,
    groupAddLike,
    groupHasMatch,
    checkVersion
}
