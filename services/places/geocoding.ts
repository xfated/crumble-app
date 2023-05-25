import { supabase, ApiResponse, buildFailureResponse, buildSuccessResponse } from '../supabase'
import { Geometry } from "./interfaces"

interface GeocodingDetails {
    formatted_address: string
    geometry: Geometry
    place_id: string
}

const AddressToLatLng = async (address: string): Promise<ApiResponse<GeocodingDetails>> => {
    const { data, error } = await supabase.functions.invoke('geocoding-get-latlong', {
        body: {
                address
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)
}

const LatLngToAddress = async (lat: number, lng: number) => {
    const { data, error } = await supabase.functions.invoke('geocoding-get-address', {
        body: {
                lat,
                lng
            }
        })
    
    if (error) {
        return buildFailureResponse(error)
    }
    return buildSuccessResponse(data)   
}

export const geocoding = {
    AddressToLatLng,
    LatLngToAddress
}