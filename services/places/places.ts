import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'
import { NearbyPlacesRes, PlaceDetailRow } from './interfaces'
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const SUPABASE_URL = "https://bcrqmjamhjxtdittmwhf.supabase.co"
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcnFtamFtaGp4dGRpdHRtd2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMDQ0NTEsImV4cCI6MTk5NjY4MDQ1MX0.GyD6t8RXw1u9iB5VColnV7QAJ4WhsRRVXU9lM-dSnHA"

const supabase = createClient(SUPABASE_URL, ANON_KEY)

export const getNearbyPlaces = async (category: string, lat: number, long: number, radius: number, nextPageToken: string): Promise<NearbyPlacesRes | null> => {
    const { data, error } = await supabase.functions.invoke('get-nearby-places', {
        body: {
                category,
                lat,
                long,
                radius,
                nextPageToken
            }
        })
    
    if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json()
        console.error('Function returned an error', errorMessage)
    } else if (error instanceof FunctionsRelayError) {
        console.error('Relay error:', error.message)
    } else if (error instanceof FunctionsFetchError) {
        console.error('Fetch error:', error.message)
    }
    
    return data
}
