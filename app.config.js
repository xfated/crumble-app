module.exports = ({ config }) => {
    return {
        ...config,
        extra: {
            SUPABASE_URL: process.env.SUPABASE_URL || "",
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ""
        }   
    }
}