// Nearby Places
interface OpeningHours {
	open_now: boolean;
}

export interface Place {
	name: string;
	place_id: string;
	vicinity: string;
	types: string[];
	price_level: number;
	rating: number;
	user_ratings_total: number;
	business_status: string;
	opening_hours: OpeningHours;
}

export interface NearbyPlacesRes {
	next_page_token: string;
	results: Place[];
}

// Place Details
export interface PhotoRow {
    id?: number;
    created_at?: number;
	height: number;
	width: number;
	photo_reference: string;
}

export interface ReviewRow {
    id?: number,
    created_at?: number;
	author_name: string;
	time: string;
	rating: number;
	relative_time_description: string;
	profile_photo_url: string;
	language: string;
	original_language: string;
	text: string;
}

export interface PlaceDetailRow {
    place_id: string,
    created_at?: string,
	name: string,
	url: string,
	lat: number,
    long: number,
	formatted_address: string;
    photos: PhotoRow[];
    reviews: ReviewRow[];
	dine_in: boolean;
	takeout: boolean;
	serves_breakfast: boolean;
	serves_lunch: boolean;
	serves_dinner: boolean;
}