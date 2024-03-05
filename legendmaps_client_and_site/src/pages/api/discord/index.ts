import { NextApiRequest, NextApiResponse } from "next";
import useProvider, { getProvider } from "../../../app/hooks/useProvider";
import settings from "../../../settings";
import { Client, Intents } from "discord.js";
import { BigNumber, Contract } from "ethers";
import zip from "lodash/zip";
import { LEGEND_MAPS_ABI } from "../../../contracts/LMAbis/abis";

const guildId = settings.DISCORD_SERVER_ID;
const roleId = settings.DISCORD_ROLE_ID;
const botToken = process.env.BOT_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
client.once("ready", () => {
    console.debug("Ready!");
});

client.login(botToken);

const getTokensAndUrisForAddress = async (address: string) => {
    const mainProvider = getProvider();
    const contract = new Contract("0xBFf184118BF575859Dc6A236E8C7C4F80Dc7c25c", LEGEND_MAPS_ABI, mainProvider);

    if (contract) {
        const balance = await contract.balanceOf(address);
        const tokens = [];
        for (let i = 0; i < balance; i++) {
            const token = await contract.tokenOfOwnerByIndex(address, i);
            tokens.push(token);
        }
        //   const tokenURIs = await fetchTokenUrisViaMultiCall(provider, contract.address, tokens);

        return zip(tokens.map((id: BigNumber) => id.toNumber()));
    }
};

const getTokenUris = async (address: string) => {
    const tokensAndUris = await Promise.all([getTokensAndUrisForAddress(address)]);

    const tokenData = {
        legendmaps: tokensAndUris[0],
    };

    return tokenData;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (!client.isReady()) {
        return res.status(500).json({ statusCode: 500, message: "Discord client not initialized" });
    }
    if (req.method !== "POST") {
        return res.status(404).end();
    }

    if (!req?.body?.address || !req.body?.uid) {
        return res.status(500).json({ statusCode: 500, message: "No address provided" });
    }

    const tokenUris = await getTokenUris(req.body.address);
    let isHolder = false;

    if (tokenUris?.legendmaps?.length) {
        isHolder = true;
    }

    if (!isHolder) {
        return res.status(200).json({ error: "You don't own any Legend Maps" });
    }

    const guild = client.guilds.cache.get(guildId);
    try {
        if (guild) {
            const guildMember = await guild.members.fetch(req.body?.uid);
            const role = await guild.roles.fetch(roleId);
            const editedMember = await guildMember.roles.add(role);
            res.status(200);
        }
        res.status(200).json({ error: "Guild not found" });
    } catch (e) {
        res.status(500).json({ error: `Error while adding role: ${e}` });
    }
}
