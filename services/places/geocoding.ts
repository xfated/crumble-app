import { supabase, ApiResponse, buildFailureResponse, buildSuccessResponse } from '../supabase'
import { Geometry } from "./interfaces"

interface GeocodingDetails {
    formatted_address: string
    geometry: Geometry
    place_id: string
}

const AddressToLatLng = async (address: string): Promise<ApiResponse<GeocodingDetails>> => {
    const { data, error } = await supabase.functions.invoke('geocoding', {
        body: {
                address
            }
        })
    if (error) {
        return buildFailureResponse<GeocodingDetails>(error)
    }
    return buildSuccessResponse<GeocodingDetails>(data)
}

const LatLngToAddress = async (lat: number, lng: number) => {
    const { data, error } = await supabase.functions.invoke('geocoding', {
        body: {
                lat,
                lng
            }
        })
    
    if (error) {
        return buildFailureResponse<GeocodingDetails>(error)
    }
    return buildSuccessResponse<GeocodingDetails>(data)   
}

export const geocoding = {
    AddressToLatLng,
    LatLngToAddress
}