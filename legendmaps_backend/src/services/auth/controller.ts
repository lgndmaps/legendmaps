import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { providers } from "ethers";
import { config } from "../../config";
import { User } from "../../models/user.model";
import { LMSession, RequestWithSession } from "../../types/requests";

import { generateNonce, SiweMessage, ErrorTypes } from "../../packages/siwe/client";

export const getNonce = (req: RequestWithSession, res: Response) => {
    req.session.nonce = generateNonce();
    req.session.save(() => res.status(200).send(req.session.nonce).end());
};

export const logout = (req: RequestWithSession, res: Response) => {
    req.session.destroy(() => {
        res.status(200).end();
    });
};

export const create = (req: RequestWithSession, res: Response, next: NextFunction) => {
    const { message, publicAddress } = req.body;
    if (!message || !publicAddress)
        return res.status(400).send({ error: "Request should have signature and publicAddress" });

    return (
        User.findOne({ where: { publicAddress } })
            ////////////////////////////////////////////////////
            // Step 1: Get the user with the given publicAddress
            ////////////////////////////////////////////////////
            .then(async (user: User | null) => {
                if (!user) {
                    return await User.create(req.body);
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
                const message = new SiweMessage(req.body.message);

                const infuraProvider = new providers.JsonRpcProvider(
                    {
                        allowGzip: true,
                        url: `${process.env.SERVER_PROVIDER_URL}`,
                        headers: {
                            Accept: "*/*",
                            Origin: `http://localhost:${process.env.PORT || 8000}`,
                            "Accept-Encoding": "gzip, deflate, br",
                            "Content-Type": "application/json",
                        },
                    },
                    Number.parseInt(message.chainId),
                );

                await infuraProvider.ready;
                const fields: SiweMessage = await message.validate();
                // console.log("SESSION: ", req.session);
                // console.log("FIELDS: ", fields);
                if (fields.nonce !== req.session.nonce) {
                    throw new Error(`Invalid nonce.`);
                }

                if (user.ens !== req.body.ens) {
                    Object.assign(user, { ens: req.body.ens });

                    const newUser = await user.save();
                }

                req.session.userId = user.id;
                req.session.siwe = fields;
                req.session.ens = ens;

                req.session.nonce = null;
                req.session.cookie.expires = new Date(fields?.expirationTime);

                res.end();
            })
            .catch(next)
    );
};
