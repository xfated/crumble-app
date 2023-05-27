import { supabase, ApiResponse, buildFailureResponse, buildSuccessResponse } from '../supabase'
import { getLocales } from 'expo-localization'

interface AutocompleteRes {
    predictions: string[]
}

const autocompleteAddressWithCountry = async (input: string): Promise<ApiResponse<AutocompleteRes>> => {
    const locales = getLocales()
    let country = "";
    if (locales) {
        country = locales[0].regionCode?.toLowerCase() ?? ""
    }
    
    const { data, error } = await supabase.functions.invoke('autocomplete', {
        body: {
                input,
                country
            }
        })
    
    if (error) {
        return buildFailureResponse<AutocompleteRes>(error)
    }
    return buildSuccessResponse<AutocompleteRes>(data)
}

const autocompleteAddressAll = async (input: string): Promise<ApiResponse<AutocompleteRes>> => {
    const { data, error } = await supabase.functions.invoke('autocomplete', {
        body: {
                input,
                
            }
        })
    
    if (error) {
        return buildFailureResponse<AutocompleteRes>(error)
    }
    return buildSuccessResponse<AutocompleteRes>(data)
}

/**
 * Gets predictions for device country first, then all countries
 */
const autocompleteAddress = async (input: string): Promise<string[]> => {
    const predictionsWithCountry = await autocompleteAddressWithCountry(input)
    const predictionsAll = await autocompleteAddressAll(input)
    const predictions: string[] = []
    if (predictionsWithCountry.data?.predictions) {
        predictionsWithCountry.data.predictions.forEach(pred => {
            predictions.push(pred) 
        })
    }
    if (predictionsAll.data?.predictions) {
        predictionsAll.data.predictions.forEach(pred => {
            if (!predictions.includes(pred)) {
                predictions.push(pred) 
            }
        })
    }
    return predictions
}

export const autocomplete = {
    autocompleteAddress
}
