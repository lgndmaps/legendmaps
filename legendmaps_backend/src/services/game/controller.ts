import { NextFunction, Request, Response } from "express";

import { User } from "../../models/user.model";

import { GameSession, PendingRewards, RewardRequests } from "../../models";
import { DBInterface } from "../../game_engine/utils/dbInterface";
import { RequestWithSession } from "../../types/requests";
import { CampaignUtil } from "../../game_engine/utils/campaignUtil";
import {
    checkAdventurerOwnership,
    checkAdventurerOwnershipDB,
    getCurrentNonce,
    getHasPowerup,
    getProvider,
} from "../../utils/contractUtils";
import * as Sentry from "@sentry/node";

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

export const getCampaign = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
        //console.log("GETTING CAMPAIGN", req.session)
        if (!req.session.userId) {
            return res.status(422).send({ error: "invalid session" });
        }
        const user = await User.findByPk(req.session.userId);

        const serializedCampaignResponse = await CampaignUtil.fetch(req.session.userId);
        if (serializedCampaignResponse) {
            return res.status(200).send(serializedCampaignResponse);
        } else {
            return res.status(422).send({ error: "campaign not found" });
        }
    } catch (e) {
        console.log("HERE ", e);
    }
};

export const startCampaign = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    // console.log("STARTING CAMPAIGN", req.body)
    const { tokenId, powerupId } = req.body;
    console.log(req.body);
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    if (!tokenId) {
        return res.status(422).send({ error: "missing adventurer" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }

    if (!checkAdventurerOwnershipDB(user.publicAddress, tokenId)) {
        Sentry.captureEvent({
            message: "Invalid adventurer triggered",
            extra: {
                user_id: req.session.userId,
                token_id: tokenId,
            },
        });
        return res.status(422).send({ error: "unauthorized adventurer" });
    }

    const result = await DBInterface.fetchCampaign(req.session.userId);
    if (result) {
        Sentry.captureEvent({
            message: "User already has a campaign",
            extra: {
                user_id: req.session.userId,
            },
        });
        return res.status(422).send({ error: "user already has a campaign" });
    }

    const hasPowerup =
        powerupId === null && typeof powerupId !== "undefined"
            ? true
            : await getHasPowerup(user.publicAddress, powerupId);
    if (!hasPowerup) {
        Sentry.captureEvent({
            message: "Does not own powerup",
            extra: {
                powerup_id: powerupId,
            },
        });
        return res.status(422).send({ error: "Does not own powerup" });
    }

    const newCampaign = await CampaignUtil.createNew(req.session.userId, tokenId, powerupId, req);
    if (newCampaign) {
        return res.status(200).send(newCampaign);
    }
    Sentry.captureEvent({
        message: "campaign could not be created",
        extra: {
            user_id: req.session.userId,
        },
    });
    return res.status(422).send({ error: "campaign could not be created" });
};

export const getAvailableMaps = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const result = await CampaignUtil.getMapOptions(req.session.userId);
    if (result === null) {
        return res.status(422).send({ error: "campaign not found" });
    }
    return res.status(200).send({ mapOptions: result });
};

export const startSession = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    const { tokenId } = req.body;

    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }

    const campaign = await CampaignUtil.fetch(req.session.userId);
    const mapOptions = await CampaignUtil.getMapOptions(req.session.userId);
    if (!campaign.campaign) {
        Sentry.captureEvent({
            message: `Invalid session. Campaign Not found`,
            extra: {
                user_id: req.session.userId,
            },
        });
        return res.status(422).send({ error: "campaign not found" });
    }
    if (!campaign.character) {
        Sentry.captureEvent({
            message: `Invalid session. Character Not found`,
            extra: {
                user_id: req.session.userId,
            },
        });
        return res.status(422).send({ error: "character not found" });
    }
    if (!mapOptions.includes(tokenId)) {
        Sentry.captureEvent({
            message: `Invalid session. Map selection invalid`,
            extra: {
                user_id: req.session.userId,
                token_id: tokenId,
            },
        });
        return res.status(422).send({ error: "invalid map selection" });
    }
    const activeSession = await DBInterface.fetchGameSession(req.session.userId);
    if (activeSession) {
        Sentry.captureEvent({
            message: `Invalid session. User already has a session`,
            extra: {
                user_id: req.session.userId,
                token_id: tokenId,
            },
        });
        return res.status(422).send({ error: "user already has a session" });
    }
    console.log("CREATING GAME SESSION WITH CHARACTER " + JSON.stringify(campaign.character));
    const newSession = await DBInterface.createGameSession(
        req.session.userId,
        tokenId,
        campaign.campaign,
        campaign.character,
    );

    if (newSession) {
        req.session.gameSession = newSession.gameSession;
        return res.status(200).send(newSession.gameSession);
    }
    Sentry.captureEvent({
        message: `game session could not be created`,
        extra: {
            user_id: req.session.userId,
            token_id: tokenId,
        },
    });
    return res.status(422).send({ error: "game session could not be created" });
};

export const getSession = (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    return GameSession.findByPk(req.session.userId)
        .then((gameSession: GameSession | null) => {
            if (gameSession) {
                return res.json(gameSession);
            } else {
                return res.json({ error: "session not found" });
            }
        })
        .catch(next);
};

export const endSession = (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }

    DBInterface.concludeGame(req.session.userId);
    req.session.gameSession = undefined;
    return res.status(200).send({ message: "session ended" });
};

export const endRun = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }

    return DBInterface.concludeRun(req.session.userId, user.publicAddress)
        .then((campaign) => {
            req.session.gameSession = undefined;

            return res.status(200).send({ campaign });
        })
        .catch((e) => {
            return res.status(422).send({ message: e });
        });
};

export const endCampaign = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }

    DBInterface.concludeCampaign(req.session.userId);
    req.session.gameSession = undefined;
    return res.status(200).send({ message: "campaign ended" });
};

export const processLevelUp = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    const { selectedSkill } = req.body;

    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const user = await User.findByPk(req.session.userId);

    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }

    const campaign = await DBInterface.fetchCampaignRaw(req.session.userId);
    const character = campaign.character;
    if (!character) {
        return res.status(422).send({ error: "character not found" });
    }

    if (!character.data?.skillOptionIds?.includes(selectedSkill)) {
        return res.status(422).send({ error: "invalid skill selected" });
    }

    const updatedCampaign = await DBInterface.doLevelUp(selectedSkill, req.session.userId, character.id);
    if (!updatedCampaign) {
        return res.status(422).send({ error: "level up failed" });
    }
    return res.status(200).send(updatedCampaign);
};

export const getPendingRewards = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }
    const pendingRewards = await PendingRewards.findAll({
        where: {
            userId: req.session.userId,
            claimed: false,
        },
        order: [["id", "DESC"]],
    });

    let nonce = await getCurrentNonce(user.publicAddress);

    return res.status(200).send({ pendingRewards, currentNonce: nonce || 0 });
};

export const getRedeemedRewards = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }
    const redeemedRewards = await RewardRequests.findAll({
        where: {
            userId: req.session.userId,
        },
    });
    if (!redeemedRewards?.length) {
        return res.status(422).send({ error: "no rewards" });
    }
    let nonce = await getCurrentNonce(user.publicAddress);

    return res.status(200).send({ redeemedRewards, currentNonce: nonce || 0 });
};

export const claimAllPendingRewards = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }
    const pendingRewards = await PendingRewards.findAll({
        where: {
            userId: req.session.userId,
            claimed: false,
        },
    });

    if (!pendingRewards?.length) {
        return res.status(422).send({ error: "no pending rewards" });
    }
    const rewardRequests = await DBInterface.claimPendingRewards(user, pendingRewards);
    return res.status(200).send({ pendingRewards, rewardRequests });
};

export const claimPendingReward = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    const { rewardId } = req.body;

    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }
    const pendingReward = await PendingRewards.findByPk(rewardId);

    if (!pendingReward) {
        return res.status(422).send({ error: "no pending rewards" });
    }
    if (pendingReward.userId !== user.id) {
        return res.status(422).send({ error: "attempt to claim other user's rewards" });
    }
    if (pendingReward.claimed === true) {
        return res.status(422).send({ error: "reward already claimed" });
    }
    const rewardRequests = await DBInterface.claimPendingRewards(user, [pendingReward]);

    return res.status(200).send({ pendingReward: { ...pendingReward, claimed: true }, rewardRequests });
};

export const clearPendingReward = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    const { rewardId } = req.body;

    if (!req.session.userId) {
        return res.status(422).send({ error: "invalid session" });
    }
    if (!rewardId) {
        return res.status(422).send({ error: "invalid pending reward" });
    }
    const user = await User.findByPk(req.session.userId);
    if (!user) {
        return res.status(422).send({ error: "user not found" });
    }
    const pendingReward = await PendingRewards.findByPk(rewardId);

    if (!pendingReward || pendingReward.userId !== req.session.userId) {
        return res.status(422).send({ error: "invalid pending reward" });
    }

    await pendingReward.destroy();

    return res.status(200).send({ message: "reward removed" });
};
