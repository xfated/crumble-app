import { PlaceDetailRow } from './interfaces'
import { supabase, ApiResponse, buildFailureResponse, buildSuccessResponse } from '../supabase'


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
        return buildFailureResponse<NearbyPlacesRes>(error)
    }
    return buildSuccessResponse<NearbyPlacesRes>(data)
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
        return buildFailureResponse<CreateGroupRes>(error)
    }
    return buildSuccessResponse<CreateGroupRes>(data)
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
        return buildFailureResponse<JoinGroupRes>(error)
    }
    return buildSuccessResponse<JoinGroupRes>(data)
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
        return buildFailureResponse<GroupGetNearbyPlacesRes>(error)
    }
    return buildSuccessResponse<GroupGetNearbyPlacesRes>(data)
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
        return buildFailureResponse<AddGroupLikeRes>(error)
    }
    return buildSuccessResponse<AddGroupLikeRes>(data)
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
        return buildFailureResponse<GroupHasMatchRes>(error)
    }
    return buildSuccessResponse<GroupHasMatchRes>(data)
}

export const placeService = {
    getNearbyPlaces,
    createGroup,
    joinGroup,
    groupGetNearbyPlaces,
    groupAddLike,
    groupHasMatch,
}
