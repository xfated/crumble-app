export enum Category {
    FOOD = "Food",
    TAKEAWAY = "Takeaway",
    BARS = "Bars",
    ATTRACTIONS = "Attractions"
}

export interface CategoryInfo {
    displayName: Category,
    icon: string,
    searchType: string,
    backgroundColor: string,
    textColor: string
}

export const categories: {[key in Category]: CategoryInfo} = {
    [Category.FOOD]: {
        displayName: Category.FOOD,
        searchType: "restaurant",
        icon: "food-outline",
        backgroundColor: "#FDFD96",
        textColor: "black"
    },
    [Category.TAKEAWAY]: {
        displayName: Category.TAKEAWAY,
        searchType: "meal_takeaway",
        icon: "food-takeout-box-outline",
        backgroundColor: "#d1c2b6",
        textColor: "black"
    },
    [Category.BARS]: {
        displayName: Category.BARS,
        searchType: "bar",
        icon: "glass-wine",
        backgroundColor: "#722F37",
        textColor: "white"
    },
    [Category.ATTRACTIONS]: {
        displayName: Category.ATTRACTIONS,
        searchType: "tourist_attraction",
        icon: "eiffel-tower",
        backgroundColor: "#d0efff",
        textColor: "black"
    }
}
