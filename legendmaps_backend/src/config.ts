/**
 * JWT config.
 */
export const config = {
    algorithms: ["HS256" as const],
    secret: process.env.JWT_SECRET || "secret",
};
