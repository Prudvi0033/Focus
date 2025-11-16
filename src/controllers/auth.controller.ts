import type { Context } from "hono";

export const signUp = async (c: Context) => {
    try {
        const {username, email, password} = await c.req.json()
        
    } catch (error) {
        
    }
}