import type { Context } from "hono";

export const weeklyReport = (c: Context) => {
    try {
       const {userId} = c.get('user') 
    } catch (error) {
        
    }
}