import { supabase, ApiResponse, buildFailureResponse, buildSuccessResponse } from '../supabase'

const addFeedback = async (rating: number, description: string) => {
    const { data, error } = await supabase.functions.invoke('geocoding-get-latlong', {
        body: {
                rating,
                description
            }
        })
    if (error) {
        console.error(error)
    }
}