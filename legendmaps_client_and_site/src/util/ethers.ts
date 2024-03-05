import { BigNumber } from "ethers";

export const convertBigNumber = (num: BigNumber) => {
    try {
        return num.toNumber();
    } catch {
        return 0;
    }
};
