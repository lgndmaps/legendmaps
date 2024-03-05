import { RequestWithSession } from "../../types/requests";
import { CampaignUpdateData } from "../types/types";
import { DBInterface } from "./dbInterface";
import RandomUtil from "./randomUtil";

export class CampaignUtil {
    public static async createNew(id: number, advId: number, powerupId: number | null, req: RequestWithSession) {
        const result = await DBInterface.fetchCampaign(id);
        //console.log("RESULT ", result);
        //TODO need some sort of validation and confirmation at this step. Forfeiting any progress and currency etc
        if (result) {
            await DBInterface.concludeCampaign(id);
        }

        const newCampaignData = await DBInterface.startNewCampaign(advId, id, powerupId, 3);
        return newCampaignData;
    }

    public static async updateCampaignInDB(id: number, updateData: CampaignUpdateData) {
        const campaign = await DBInterface.fetchCampaign(id);
        if (campaign) {
            Object.assign(campaign, updateData);
            const result = await campaign.save();
            return result;
        }
        return null;
    }

    public static async fetch(id: number) {
        const result = await DBInterface.fetchCampaignRaw(id);
        return result;
    }

    public static async getMapOptions(id: number) {
        const campaign = await DBInterface.fetchCampaign(id);
        if (!campaign) {
            console.log("No campaign found");
            return null;
        }
        let runNumber = campaign.runNumber;
        if (campaign.campaignRunStats?.[0] || campaign.runNumber > 0) {
            runNumber++;
        }
        let maps = [];
        for (let i = runNumber * 3; i < runNumber * 3 + 3; i++) {
            if (campaign?.mapSeeds?.length > i) {
                maps.push(campaign?.mapSeeds[i]);
            }
        }
        //maps = [0, 10, 100]; -- debug to force particlar maps.
        return maps;
    }

    public static async createOrFetch(id: string, req: RequestWithSession) {}

    public static async endCampaign(id: string) {}
}
