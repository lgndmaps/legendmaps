import { NextFunction, Request, Response } from "express";

import { User } from "../../models/user.model";
import { Client, Intents } from "discord.js";
import { getProvider, getMapTokenUris, getAdventurerTokenUris } from "../../utils/contractUtils";
import { RequestWithSession } from "../../types/requests";
import { SiweMessage } from "../../packages/siwe/client";
import { providers } from "ethers";
import { DBInterface } from "../../game_engine/utils/dbInterface";

const guildId = process.env.GUILD_ID || "894636506281549825";
const roleId = process.env.ROLE_ID || "918526053163602022";
const advRoleId = process.env.ROLE_ID || "963788115141619712";
const scribeRoleId = "918531195267084300";
const loreKeeperRoleId = "916763597118533673";
const blessedRoleId = "903689890674389122";

const botToken = process.env.BOT_TOKEN;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});
client.once("ready", () => {
    console.debug("Ready!");
});

client.login(botToken);

export const find = (req: Request, res: Response, next: NextFunction) => {
    // If a query string ?publicAddress=... is given, then filter results
    const whereClause =
        req.query && req.query.publicAddress
            ? {
                  where: { publicAddress: req.query.publicAddress },
              }
            : undefined;

    return User.findAll(whereClause)
        .then((users: User[]) => res.json(users))
        .catch(next);
};

export const get = (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (process.env.DEBUGGING_GAME == "true") {
        return (
            User.findOne({
                where: { publicAddress: process.env.GAME_DEBUG_ADDRESS },
            })
                ////////////////////////////////////////////////////
                // Step 1: Get the user with the given publicAddress
                ////////////////////////////////////////////////////
                .then((user: User | null) => {
                    if (!user) {
                        res.status(401).send({
                            error: `User with publicAddress ${process.env.GAME_DEBUG_ADDRESS} is not found in database`,
                        });

                        return null;
                    }

                    return user;
                })
                ////////////////////////////////////////////////////
                // Step 2: Verify digital signature
                ////////////////////////////////////////////////////
                .then(async (user: User | null) => {
                    if (!(user instanceof User)) {
                        // Should not happen, we should have already sent the response
                        throw new Error('User is not defined in "Verify digital signature".');
                    }
                    const ens = req.body.ens;
                    //const message = new SiweMessage(req.body.message);

                    // const infuraProvider = new providers.JsonRpcProvider(
                    //   {
                    //     allowGzip: true,
                    //     url: `${process.env.SERVER_PROVIDER_URL}`,
                    //     headers: {
                    //       Accept: "*/*",
                    //       Origin: `http://localhost:${process.env.PORT || 8000}`,
                    //       "Accept-Encoding": "gzip, deflate, br",
                    //       "Content-Type": "application/json",
                    //     },
                    //   },
                    //   Number.parseInt(message.chainId)
                    // );

                    // await infuraProvider.ready;
                    // const fields: SiweMessage = await message.validate();
                    //console.log("SESSION: ", req.session);
                    // console.log("FIELDS: ", fields);
                    // if (fields.nonce !== req.session.nonce) {
                    //   throw new Error(`Invalid nonce.`);
                    // }

                    if (user.ens !== req.body.ens) {
                        Object.assign(user, { ens: req.body.ens });

                        const newUser = await user.save();
                    }

                    req.session.userId = user.id;
                    //req.session.siwe = {};
                    req.session.ens = ens;

                    req.session.nonce = null;
                    // req.session.cookie.expires = new Date(fields?.expirationTime);
                    // console.log(fields);
                    res.json(user);
                })
                .catch(next)
        );
    }
    if (req.session.userId) {
        return User.findByPk(req.session.userId)
            .then((user: User | null) => res.json(user))
            .catch(next);
    } else {
        return res.status(422).send({ error: "invalid session" });
    }
};

export const create = (req: Request, res: Response, next: NextFunction) => {
    return User.create(req.body)
        .then((user: User) => {
            return res.json(user);
        })
        .catch(next);
};

export const patch = (req: RequestWithSession, res: Response, next: NextFunction) => {
    // Only allow to fetch current user
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    return User.findByPk(req.session.userId)
        .then((user: User | null) => {
            if (!user) {
                return user;
            }

            Object.assign(user, req.body);
            return user.save();
        })
        .then(async (user: User | null) => {
            return user
                ? res.json(user)
                : res.status(401).send({
                      error: `User with publicAddress ${req.session.userId} is not found in database`,
                  });
        })
        .catch(next);
};

export const updateOwned = (req: RequestWithSession, res: Response, next: NextFunction) => {
    // Only allow to fetch current user
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    return User.findByPk(req.session.userId)
        .then(async (user: User | null) => {
            if (!user) {
                return res.status(401).send({
                    error: `User with publicAddress ${req.session.userId} is not found in database`,
                });
            }

            if (user.lastRefresh) {
                const currDate = new Date();
                const diff = Math.abs(currDate.getTime() - user.lastRefresh.getTime()) / (1000 * 60 * 60 * 24);

                if (diff < 1) {
                    return res.status(401).send({
                        error: `Can only refresh once daily`,
                    });
                }
            }

            await DBInterface.refreshUserOwnership(user.publicAddress);
            Object.assign(user, { lastRefresh: new Date() });
            user.save();
            return res.status(200).send({ message: "success" });
        })
        .catch(next);
};

export const discord = (req: RequestWithSession, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    return User.findByPk(userId)
        .then(async (user: User | null) => {
            if (user && req.body.discordId) {
                const guild = client.guilds.cache.get(guildId);
                const tokenUris = await getMapTokenUris(getProvider(), user.publicAddress);
                const advTokenUris = await getAdventurerTokenUris(getProvider(), user.publicAddress);
                if (tokenUris?.legendmaps?.length || advTokenUris?.adventurers?.length) {
                    try {
                        if (guild) {
                            const guildMember = await guild.members.fetch(req.body.discordId);
                            if (tokenUris?.legendmaps?.length) {
                                const role = await guild.roles.fetch(roleId);
                                //@ts-ignore
                                const editedMember = await guildMember.roles.add(role);
                            }
                            if (advTokenUris?.adventurers?.length) {
                                const role = await guild.roles.fetch(advRoleId);
                                //@ts-ignore
                                const editedMember = await guildMember.roles.add(role);
                            }
                            return user;
                        } else {
                            return null;
                        }
                    } catch (e) {
                        return null;
                    }
                }
                return null;
            }
            return null;
        })
        .then(async (user: User | null) => {
            try {
                if (!user) {
                    res.status(401).json({ error: "Could not set role" });
                    return;
                }
                const guild = client.guilds.cache.get(guildId);
                let rolesUpdate = [];
                try {
                    if (guild) {
                        const guildMember = await guild.members.fetch(req.body.discordId);
                        rolesUpdate = guildMember.roles.cache.map((r) =>
                            r.id === scribeRoleId
                                ? "scribe"
                                : r.id === loreKeeperRoleId
                                ? "lore-keeper"
                                : r.id === blessedRoleId
                                ? "blessed"
                                : undefined,
                        );
                    }
                } catch (e) {
                    return null;
                }
                Object.assign(user, { ...req.body, roles: rolesUpdate.filter((r) => r !== undefined) });
                user.save()
                    .then(() => {
                        res.status(200).json(user);
                        return;
                    })
                    .catch((e) => {
                        res.status(401).json({ error: "Could not set role" });
                        return;
                    });
            } catch {
                res.status(401).json({ error: "Could not set role" });
                return;
            }
        })

        .catch(next);
};
