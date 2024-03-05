import { NextApiRequest, NextApiResponse } from "next";
import settings from "../../../settings";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== "POST") {
        return res.status(404).end();
    }

    if (!req?.body?.code) {
        return res.status(500).json({ statusCode: 500, message: "No code" });
    }
    const details = {
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: settings.DISCORD_REDIRECT_URL,
    };
    const formBody = [];
    for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    const formStr = formBody.join("&");

    try {
        const result = await fetch(`https://discord.com/api/oauth2/token`, {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: formStr,
        });

        if (result.status === 200) {
            const response = await result.json();
            return res.status(200).json({ ...response });
        } else {
            return res.status(400).json({ error: "Invalid login" });
        }
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message });
    }
}
