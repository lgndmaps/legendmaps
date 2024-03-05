export const settings = {
    TOKEN_CONTRACT_ADDRESS: process.env.TOKEN_CONTRACT_ADDRESS || "KEY_HERE",
    POWERUP_CONTRACT_ADDRESS: process.env.POWERUP_CONTRACT_ADDRESS || "KEY_HERE",
    TOKEN_CHAIN_ID: process.env.TOKEN_CONTRACT_CHAIN_ID ? parseInt(process.env.TOKEN_CONTRACT_CHAIN_ID) : 5,
    TOKEN_PROVIDER_URL: process.env.POLYGON_RPC_URL ?? "infura or like here",
    TOKEN_SIGNER_PRIVATE_KEY: process.env.CONTRACT_PRIVATE_KEY,
};
