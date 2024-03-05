const LOCAL_DEV_ENV_NAME = "local";
const TEST_ENV_NAME = "test";

const NODE_ENV = process.env.NODE_ENV ?? LOCAL_DEV_ENV_NAME;
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? NODE_ENV;

const DEV_AUTH_PASSWORD = process.env.DEV_AUTH_PASSWORD || "";

const DEV_API_URL_ADDRESS = "localhost"; //localhost

const SENTRY_DSN = "sentry_dsn";

const POWERUP_COST = 10;

const API_URLS = {
    production: process.env.ENV_API_URL || "https://api.legendmaps.io/api",
    staging: "https://legendmaps.io/api",
    "deployed-development": "https://devapi.legendmaps.io/api",
    development: "https://devapi.legendmaps.io/api",
    local: "http://localhost:8000/api",
};

const APP_URLS = {
    production: "https://legendmaps.io",
    staging: "https://dev.legendmaps.io",
    "deployed-development": "https://dev.legendmaps.io",
    development: "https://dev.legendmaps.io",
    local: "http://" + DEV_API_URL_ADDRESS + ":3000",
};

const PROVIDER_URLS = {
    public:
        process.env.NODE_ENV === "production"
            ? "infura"
            : "infura",
    token: process.env.POLYGON_RPC_URL || "polygon",
};

const MAINNET_INFURA_URL = "infura";

const INFURA_IDS = {
    public: "000",
    server: "000",
};

const IPFS_IMAGE_URL = `https://cloudflare-ipfs.com/ipfs/`;
const IPFS_JSON_URL = `https://cloudflare-ipfs.com/ipfs/QmYJhPws7QqEBf2cxe9ZCE64CPtUWe7KiHKeiSuPbttUc4/`;

const DISCORD_SERVER_ID = "0";
const DISCORD_ROLE_ID = "0";

const WS_URLS = {
    production: process.env.ENV_API_URL || "wss://api.legendmaps.io",
    staging: "wss://api.legendmaps.io",
    "deployed-development": "https://devapi.legendmaps.io",
    development: "wss://devapi.legendmaps.io",
    local: "ws://" + DEV_API_URL_ADDRESS + ":8000",
};

const settings = {
    NODE_ENV,
    APP_ENV,
    WS_URL: WS_URLS[APP_ENV],
    APP_URL: APP_URLS[APP_ENV],
    API_URL: API_URLS[APP_ENV],
    SENTRY_DSN: [LOCAL_DEV_ENV_NAME, TEST_ENV_NAME].includes(NODE_ENV) ? "" : SENTRY_DSN,
    INFURA_ID: process.env.INFURA_ID || "0",
    DISCORD_REDIRECT_URL: process.env.DISCORD_REDIRECT_URL || `${APP_URLS[APP_ENV]}/verify`,
    PROVIDER_URLS,
    MAINNET_INFURA_URL,
    DEV_AUTH_PASSWORD,
    DISCORD_SERVER_ID,
    DISCORD_ROLE_ID,
    IPFS_IMAGE_URL,
    IPFS_JSON_URL,
    INFURA_IDS,
    NETWORK_ID: process.env.NODE_ENV === "production" ? 1 : 1,
    S3_URL: "https://files.legendmaps.io/",
    VISITOR_IMAGE_URL: "https://files.legendmaps.io/adv/p250/portrait_",
    IMAGE_URL: "https://files.legendmaps.io/mapsimages/",
    ADVENTURERS_CONTRACT_ADDRESS:
        process.env.NODE_ENV === "production"
            ? "0xCA72feCc4BDb993650654A9881F2Be15a7875796"
            : "0xCA72feCc4BDb993650654A9881F2Be15a7875796",
    COIN_ADDRESS: process.env.TOKEN_CONTRACT_ADDRESS ?? "0",
    POWERUP_CONTRACT_ADDRESS: process.env.POWERUP_CONTRACT_ADDRESS ?? "0",
    TOKEN_ADDRESS: process.env.TOKEN_ADDRESS ?? "0",
    TOKEN_CONTRACT_CHAIN_ID: process.env.TOKEN_CONTRACT_CHAIN_ID ? parseInt(process.env.TOKEN_CONTRACT_CHAIN_ID) : 5,
    POWERUP_COST,
};

export default settings;
