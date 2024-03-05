import { ISession } from "../types/userTypes";

export const getDisplayName = (session: ISession) => {
    return session.username ? session.username : session.ens ? session.ens : session.publicAddress;
};
