import { ARRAY, BOOLEAN, DataTypes, INTEGER, JSON, JSONB, Sequelize, STRING, TEXT } from "sequelize";

import {
    Adventurer,
    AdventurerBlacklist,
    AdventurerDescriptionLikes,
    AdventurerDescriptionVersions,
    AllowlistReservation,
    Campaign,
    CampaignRecord,
    Character,
    GameSession,
    LegendMap,
    LegendMapDetails,
    PendingRewards,
    Powerup,
    RewardRequests,
    RunRecord,
    User,
} from "./models";

const sequelizeNoUpdateAttributes = require("sequelize-noupdate-attributes");

const sequelize = new Sequelize(process.env.DB_NAME || "", process.env.DB_USER || "", process.env.DB_PASSWORD || "", {
    dialect: "postgres",
    host: process.env.DB_HOST || "",
    port: parseInt(process.env.DB_PORT || "5432") || 5432,
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    ssl: true,
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});
sequelizeNoUpdateAttributes(sequelize);
// const sequelize = new Sequelize(
//   `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`
// );

// Init all models
User.init(
    {
        nonce: {
            allowNull: false,
            type: INTEGER,
            defaultValue: (): number => Math.floor(Math.random() * 10000), // Initialize with a random nonce
        },
        publicAddress: {
            allowNull: false,
            type: STRING,
            unique: true,
            //@ts-ignore
            noUpdate: true,
        },
        username: {
            type: STRING,
            unique: true,
        },
        discordId: {
            type: STRING,
            unique: true,
        },
        ens: {
            type: STRING,
            unique: true,
        },
        role: {
            type: STRING,
            allowNull: false,
            defaultValue: "user",
        },
        roles: {
            type: ARRAY(STRING),
            allowNull: false,
            defaultValue: ["user"],
        },
        lastRefresh: {
            type: DataTypes.DATE,
        },
    },
    {
        modelName: "user",
        sequelize, // This bit is important
        timestamps: false,
    },
);

AllowlistReservation.init(
    {
        publicAddress: {
            allowNull: false,
            type: STRING,
            unique: true,
            //@ts-ignore
            noUpdate: true,
            primaryKey: true,
        },
        project: {
            type: STRING,
            allowNull: false,
            //@ts-ignore
            noUpdate: true,
        },
    },
    {
        modelName: "allowlist_reservations",
        sequelize, // This bit is important
        timestamps: false,
    },
);

Adventurer.init(
    {
        tokenId: {
            allowNull: false,
            type: INTEGER,
            unique: true,
            primaryKey: true,
        },
        name: {
            allowNull: false,
            type: STRING,
        },
        first_name: {
            type: STRING,
        },
        last_name: {
            type: STRING,
        },
        image: {
            type: STRING,
        },
        image_transparent: {
            type: STRING,
        },
        image_card: {
            type: STRING,
        },
        brawn: {
            type: INTEGER,
        },
        agility: {
            type: INTEGER,
        },
        guile: {
            type: INTEGER,
        },
        spirit: {
            type: INTEGER,
        },
        bags_total: {
            type: INTEGER,
        },
        traits: { type: ARRAY(STRING) },
        art_background: {
            type: STRING,
        },
        art_armor: {
            type: STRING,
        },
        art_head: {
            type: STRING,
        },
        art_weapon: {
            type: STRING,
        },
        art_gear: {
            type: STRING,
        },
        art_shield: {
            type: STRING,
        },
        art_special: {
            type: STRING,
        },
        art_rarity: {
            type: INTEGER,
        },
        description_version: {
            type: INTEGER,
        },
        owner: {
            type: STRING,
        },
        nativeTokenId: {
            type: INTEGER,
        },
        project: {
            type: STRING,
        },
    },
    {
        modelName: "adventurer",
        sequelize, // This bit is important
        timestamps: false,
    },
);

AdventurerDescriptionVersions.init(
    {
        tokenId: {
            allowNull: false,
            type: INTEGER,
        },
        description: {
            type: TEXT,
        },
        version: {
            type: INTEGER,
            allowNull: false,
        },
        authorAddressOrEns: {
            type: STRING,
            allowNull: false,
        },
    },
    {
        modelName: "adventurer_description_version",
        sequelize,
        timestamps: true,
    },
);

AdventurerDescriptionLikes.init(
    {
        tokenId: {
            allowNull: false,
            type: INTEGER,
            unique: "unique_like",
        },
        walletAddress: {
            allowNull: false,
            type: STRING,
            unique: "unique_like",
        },
    },
    {
        modelName: "adventurer_description_likes",
        sequelize,
        timestamps: true,
    },
);

AdventurerBlacklist.init(
    {
        tokenId: {
            allowNull: false,
            type: INTEGER,
            unique: "unique_like",
        },
        walletAddress: {
            allowNull: false,
            type: STRING,
            unique: "unique_like",
        },
    },
    {
        modelName: "adventurer_blacklist",
        sequelize,
        timestamps: true,
    },
);

Adventurer.hasMany(AdventurerDescriptionVersions, {
    foreignKey: "tokenId",
});

Adventurer.hasMany(AdventurerDescriptionLikes, {
    foreignKey: "tokenId",
});

LegendMap.init(
    {
        tokenId: {
            allowNull: false,
            type: INTEGER,
            unique: true,
            primaryKey: true,
        },
        name: {
            allowNull: false,
            type: STRING,
        },
        image: {
            type: STRING,
        },
        items: { type: ARRAY(STRING) },
        wallMaterial: { type: STRING },
        biome: { type: STRING },
        traps: { type: ARRAY(STRING) },
        lineart: { type: STRING },
        dweller: { type: ARRAY(STRING) },
        roomCount: { type: INTEGER },
        asciiMap: { type: ARRAY(STRING) },
        glitch: { type: STRING },
        challengeRating: { type: INTEGER },
        itemRarityRank: { type: INTEGER },
        enemyRarityRank: { type: INTEGER },
        featureRarityRank: { type: INTEGER },
        specialRoom: { type: STRING },
        owner: {
            type: STRING,
        },
    },
    {
        modelName: "map",
        sequelize, // This bit is important
        timestamps: false,
    },
);

LegendMapDetails.init(
    {
        tokenId: {
            allowNull: false,
            type: INTEGER,
            unique: true,
            primaryKey: true,
        },
        details: {
            type: JSONB,
        },
    },
    {
        modelName: "map_details",
        sequelize, // This bit is important
        timestamps: false,
    },
);

LegendMap.hasOne(LegendMapDetails, {
    foreignKey: "tokenId",
});

Campaign.init(
    {
        sessionId: {
            allowNull: true,
            type: INTEGER,
            unique: true,
        },
        activeStep: {
            type: STRING,
        },
        runNumber: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        campaignLength: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 3,
        },
        mapSeeds: {
            type: ARRAY(INTEGER),
        },

        campaignRunStats: {
            type: JSONB,
        },
    },
    {
        modelName: "campaign",
        sequelize,
        timestamps: true,
    },
);

RunRecord.init(
    {
        id: {
            allowNull: false,
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        died: {
            allowNull: false,
            type: BOOLEAN,
            defaultValue: false,
        },
        runNumber: {
            allowNull: false,
            type: INTEGER,
            validate: {
                min: 1,
                max: 5,
            },
        },
        dwellersKilled: {
            allowNull: false,
            type: ARRAY(STRING),
            defaultValue: [],
        },
        chestsOpened: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        foodEaten: {
            allowNull: false,

            type: INTEGER,
            defaultValue: 0,
        },
        goldLooted: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        itemsLooted: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        itemsPurchased: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        potionsDrunk: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        scrollsRead: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        storyEventsCompleted: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        turns: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        causeOfDeath: {
            allowNull: true,
            type: STRING,
        },
    },
    {
        modelName: "run_record",
        sequelize,
        timestamps: true,
    },
);

Adventurer.hasMany(RunRecord, {
    foreignKey: "advId",
});

LegendMap.hasMany(RunRecord, {
    foreignKey: "mapId",
});

CampaignRecord.init(
    {
        advId: {
            allowNull: true,
            type: INTEGER,
        },
        died: {
            allowNull: false,
            type: BOOLEAN,
            defaultValue: false,
        },
        runNumber: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 0,
        },
        campaignLength: {
            allowNull: false,
            type: INTEGER,
            defaultValue: 3,
        },
        campaignStats: {
            allowNull: false,
            type: JSONB,
        },
        userId: {
            allowNull: false,
            type: INTEGER,
        },
    },
    {
        modelName: "campaign_record",
        sequelize,
        timestamps: true,
    },
);

/*
CampaignRecord.belongsTo(Adventurer, {});
Adventurer.hasMany(CampaignRecord, {});
CampaignRecord.belongsTo(LegendMap, {});
LegendMap.hasMany(CampaignRecord, {});
*/
Character.init(
    {
        level: {
            allowNull: false,
            type: INTEGER,
        },
        adventurerId: {
            allowNull: false,
            type: INTEGER,
        },
        nativeTokenId: {
            type: INTEGER,
        },
        project: {
            type: STRING,
        },
        data: {
            allowNull: true,
            type: JSONB,
        },
    },
    {
        modelName: "character",
        sequelize,
        timestamps: true,
    },
);

GameSession.init(
    {
        sessionData: {
            allowNull: false,
            type: JSON,
            unique: false,
        },
    },
    {
        modelName: "game_session",
        sequelize, // This bit is important
        timestamps: false,
    },
);

Campaign.belongsTo(User);
Campaign.hasOne(Character, {
    foreignKey: {
        allowNull: true,
    },
});

Campaign.hasOne(GameSession, {
    foreignKey: {
        allowNull: true,
    },
});

Character.belongsTo(Campaign);
Character.belongsTo(User);

GameSession.belongsTo(Campaign, {
    foreignKey: {
        allowNull: true,
    },
});

Powerup.init(
    {
        userId: {
            allowNull: false,
            type: INTEGER,
        },
        powerupId: {
            allowNull: false,
            type: INTEGER,
        },
    },
    {
        modelName: "powerup",
        sequelize, // This bit is important
        timestamps: false,
    },
);

PendingRewards.init(
    {
        userId: {
            allowNull: true,
            type: INTEGER,
        },
        spendId: {
            allowNull: false,
            type: INTEGER,
        },
        spendAmount: {
            allowNull: false,
            type: INTEGER,
        },
        issueId: {
            allowNull: false,
            type: INTEGER,
        },
        issueAmount: {
            allowNull: false,
            type: INTEGER,
        },
        source: {
            allowNull: false,
            type: STRING,
        },
        sourceDetails: {
            type: STRING,
        },
        userAddress: {
            allowNull: false,
            type: STRING,
        },
        claimed: {
            allowNull: false,
            type: BOOLEAN,
            defaultValue: false,
        },
    },
    {
        modelName: "pending_rewards",
        sequelize, // This bit is important
        timestamps: false,
    },
);
/*
PendingRewards.hasOne(RunRecord, {
    foreignKey: "runRecordId",
    constraints: false
});
*/

RewardRequests.init(
    {
        userId: {
            allowNull: false,
            type: INTEGER,
        },
        userAddress: {
            allowNull: false,
            type: STRING,
        },
        type: {
            allowNull: true,
            type: STRING,
        },
        consumedRewards: {
            allowNull: false,
            type: ARRAY(JSONB),
        },
        signature: {
            allowNull: false,
            type: STRING,
        },
        nonce: {
            allowNull: false,
            type: STRING,
        },
    },
    {
        modelName: "reward_requests",
        sequelize, // This bit is important
        timestamps: false,
    },
);

// try {
//   sequelize.authenticate();
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

// Create new tables
sequelize.sync();

export { sequelize };
