import { supabase, ApiResponse, buildFailureResponse, buildSuccessResponse } from '../supabase'

interface AutocompleteRes {
    predictions: string[]
}

const autocompleteAddress = async (input: string): Promise<ApiResponse<AutocompleteRes>> => {
    const { data, error } = await supabase.functions.invoke('autocomplete', {
        body: {
                input
            }
        })
    
    if (error) {
        return buildFailureResponse<AutocompleteRes>(error)
    }
    return buildSuccessResponse<AutocompleteRes>(data)
}

export const autocomplete = {
    autocompleteAddress
}
