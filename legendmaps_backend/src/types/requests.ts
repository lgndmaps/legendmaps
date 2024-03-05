import { Request } from "express";
import { Session, SessionData } from "express-session";
import { SerializedGameSessionD, SerializedCampaignD, SerializedCharacterD } from "../game_engine/types/types";
import { Campaign, Character, GameSession } from "../models";
import { SiweMessage } from "../packages/siwe/client";

export type RequestWithSession = Request & {
    session: Session & Partial<SessionData> & LMSession;
};

export type LMSession = {
    jwt?: string;
    userId?: number;
    ens?: string;
    nonce?: string | null;
    siwe?: SiweMessage;
    movesSinceSave?: number;
    activeCampaign?: SerializedCampaignD;
    activeCharacter?: SerializedCharacterD;
    gameSession?: SerializedGameSessionD;
};
