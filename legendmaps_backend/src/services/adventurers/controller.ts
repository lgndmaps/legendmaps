import {NextFunction, Request, Response} from "express";
import Sequelize, {QueryTypes} from "sequelize";
import {sequelize} from "../../db";
import {
    Adventurer,
    AdventurerBlacklist,
    AdventurerDescription,
    AdventurerDescriptionVersions,
    User,
} from "../../models";
import {ADVENTURER_PROJECTS, ARRAY_COLUMNS, SEARCH_FIELDS} from "../../constants/adventurers";
import {RequestWithSession} from "../../types/requests";
import {getAdventurerTokenUris, getProvider} from "../../utils/contractUtils";
import {Description} from "@ethersproject/properties";

const {Op} = Sequelize;

const handleHasNextPage = (count: number, page: number, limit: number): boolean => {
    return count > +page * limit;
};
// find all
export const find = async (req: Request, res: Response, next: NextFunction) => {

    let {
        orderBy = "tokenId",
        order = "asc",
        page = 1,
        search = "",
        brawn = "",
        agility = "",
        guile = "",
        spirit = "",
        total = "",
        onlyDescriptions = false,
        isUserQuery = false,
        publicAddress = undefined,
    } = req.query;
    const limit = isUserQuery ? 300 : 12;


    const searchKey = Object.keys(search)[0];
    let searchValue = search[searchKey];
    if (searchKey === "tokenId") {

        searchValue = searchValue.split(",").map((tokenId) => parseInt(tokenId));
        if (searchValue > 10000) {
            searchValue = 0;
        }

    }
    let BAGSString = "";
    let bagsClause = null;
    if (
        brawn !== "" ||
        agility !== "" ||
        guile !== "" ||
        spirit !== "" ||
        total !== "" ||
        onlyDescriptions != "false"
    ) {
        bagsClause = {};
    }
    if (brawn !== "") {
        bagsClause["brawn"] = {
            [Op.gte]: brawn,
        };
        BAGSString += `AND brawn > ${brawn} `;
    }
    if (agility !== "") {
        bagsClause["agility"] = {
            [Op.gte]: agility,
        };
        BAGSString += `AND agility > ${agility} `;
    }
    if (guile !== "") {
        bagsClause["guile"] = {
            [Op.gte]: guile,
        };
        BAGSString += `AND guile > ${guile} `;
    }
    if (spirit !== "") {
        bagsClause["spirit"] = {
            [Op.gte]: spirit,
        };
        BAGSString += `AND spirit > ${spirit} `;
    }
    if (total !== "") {
        bagsClause["bags_total"] = {
            [Op.gte]: total,
        };
        BAGSString += `AND bags_total > ${total} `;
    }

    if (onlyDescriptions == "true") {
        bagsClause["description_version"] = {
            [Op.ne]: null,
        };
    }

    const offset = page ? (+page - 1) * limit : 0;

    let whereClause = {};
    let arrayResults: Adventurer[] | [] | void | Object[];
    let totalLength: { count: number }[] | null;

    if (publicAddress) {
        whereClause["owner"] = {
            [Op.iLike]: publicAddress,
        };
    } else {
        whereClause["tokenId"] = {
            [Op.lt]: 10000,
        };
    }
    if (searchValue && searchKey) {
        if (searchKey === SEARCH_FIELDS.TOKEN_ID) {
            page = 1;
            whereClause = {

                ...whereClause,
                ...bagsClause,
                [searchKey]: {
                    [Op.in]: searchValue,
                },
            };
        } else {
            // This is to iLike search array fields, Sequelize doesn't seem to have a way to do this
            if (ARRAY_COLUMNS.includes(searchKey)) {
                totalLength = await sequelize.query(
                    `SELECT count(*)
        FROM adventurers
        WHERE EXISTS (
          SELECT * FROM unnest(${searchKey}) as n
          WHERE n LIKE :search 
        )`,
                    {
                        replacements: {search: `%${searchValue}%`},
                        type: QueryTypes.SELECT,
                    },
                );

                const containsQuery = {
                    [searchKey]: {
                        [Op.overlap]: [...searchValue.split(",")],
                    },
                };

                whereClause = {
                    ...whereClause,
                    ...containsQuery,
                    ...bagsClause,
                };
            } else {
                // Default key value search
                whereClause = {
                    ...whereClause,
                    [searchKey]: {[Op.iLike]: `%${searchValue}%`},
                    ...bagsClause,
                };
            }
        }
    } else if (bagsClause) {
        whereClause = {
            ...whereClause,
            ...bagsClause,
        };
    }

    if (arrayResults) {
        const {count} = totalLength[0] || {count: 0};
        const hasNextPage = handleHasNextPage(count, +page, limit);
        return res.json({count, page, hasNextPage, rows: arrayResults});
    }
    // check if seach query has any of the searchable fields

    //console.log("final where clause is ", whereClause);
    const querySettings = {
        where: whereClause,
        limit,
        order: [[`${orderBy}`, order]],
        offset,
    };

    // @ts-ignore seems there is a type bug with order the double [[]] was required to fix
    return await Adventurer.findAndCountAll(querySettings)
        .then((maps) => {
            const hasNextPage = handleHasNextPage(maps.count, +page, limit);
            return res.json({page, hasNextPage, ...maps});
        })
        .catch((err) => {
            console.log(err, "err");
            return next(err);
        });
};

export const getSingle = async (req: Request, res: Response, next: NextFunction) => {
    const {tokenId} = req.params;
    return Adventurer.findOne({
        where: {
            tokenId: tokenId,
        },
    })
        .then(async (adventurerDetails: any | null) => {
            if (adventurerDetails) {

                //COPY OVER BASIC STATS
                let statsQuery1: string = "SELECT COUNT(public.\"run_records\".\"mapId\") AS total_count, SUM(CASE WHEN run_records.died = true THEN 1 ELSE 0 END) AS died_count, SUM(\"run_records\".\"chestsOpened\") AS chests_opened, SUM(\"run_records\".\"goldLooted\") AS gold_looted, SUM(\"run_records\".\"itemsLooted\") AS items_looted, SUM(\"run_records\".\"itemsPurchased\") AS items_purchased, SUM(\"run_records\".\"potionsDrunk\") AS potions_drunk, SUM(\"run_records\".\"scrollsRead\") AS scrolls_read, SUM(\"run_records\".\"storyEventsCompleted\") AS events_completed FROM run_records WHERE \"advId\" = " + tokenId;


                let advStats = await sequelize.query(statsQuery1, {type: QueryTypes.SELECT}).catch((e) => {
                    console.log("ERROR!", e);
                    return "error";
                });

                let advStatsResults: any = advStats[0];

                Object.assign(adventurerDetails.dataValues, advStatsResults);


                //GET DWELLERS KILLed
                let dkCountQuery = "SELECT SUM(array_length(\"run_records\".\"dwellersKilled\", 1)) as dwellers_killed FROM run_records WHERE \"run_records\".\"advId\" = " + tokenId;

                let dkQuery = await sequelize.query(dkCountQuery, {type: QueryTypes.SELECT}).catch((e) => {
                    console.log("ERROR!", e);
                    return "error";
                });


                Object.assign(adventurerDetails.dataValues, dkQuery[0]);

                //GET CASUES OF DEATH
                let codQuerySQL: string = 'SELECT "causeOfDeath", COUNT("causeOfDeath") as count FROM "run_records" WHERE "run_records"."advId" = ' + tokenId + ' AND "causeOfDeath" IS NOT NULL AND "causeOfDeath" != \'\' GROUP BY "causeOfDeath" ORDER BY count DESC LIMIT 5;';
                let codQuery = await sequelize.query(codQuerySQL, {type: QueryTypes.SELECT}).catch((e) => {
                    console.log("ERROR!", e);
                    return "error";
                });

                adventurerDetails.dataValues.causesOfDeath = codQuery;

                if (!adventurerDetails.description_version) {
                    return res.json(adventurerDetails);
                }
                const version = await AdventurerDescriptionVersions.findOne({
                    where: {
                        tokenId: tokenId,
                        version: adventurerDetails.description_version,
                    },
                });
                const blackListed = await AdventurerBlacklist.findOne({
                    where: {
                        tokenId: tokenId,
                    },
                });
                if (version) {
                    const response = {
                        ...adventurerDetails.dataValues,
                        lore: {
                            description: version.description,
                            version: version.version,
                            createdAt: version.createdAt,
                            authorAddressOrEns: version.authorAddressOrEns,
                        },
                        blacklisted: blackListed !== null && blackListed !== undefined,
                    };


                    res.json(response);
                } else {
                    return res.json(adventurerDetails);
                }
            } else {
                return res.json({error: "adventurer not found"});
            }
        })
        .catch(next);
};

export const updateDescription = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    const {tokenId} = req.params;
    if (!req.session.userId) {
        return res.status(422).send({error: "invalid session"});
    }
    const user = await User.findByPk(req.session.userId);

    if (!user) {
        return res.status(422).send({error: "invalid user id"});
    }

    const blackListed = await AdventurerBlacklist.findOne({
        where: {
            tokenId: tokenId,
        },
    });

    if (blackListed !== null && blackListed !== undefined) {
        return res.status(422).send({error: "adventurer edits banned"});
    }

    const advTokenUris = await getAdventurerTokenUris(getProvider(), user.publicAddress);

    if (
        advTokenUris.adventurers.find((adv) => {
            return adv[0] == tokenId;
        })
    ) {
        const original = await Adventurer.findByPk(tokenId);
        if (!original) {
            return res.status(422).send({error: "could not find description"});
        }
        const version = original.description_version ?? 0;
        const description = await AdventurerDescriptionVersions.create({
            tokenId: tokenId,
            version: version + 1,
            description: req.body.description,
            authorAddressOrEns: user.ens ?? user.publicAddress,
        });
        Object.assign(original, {description_version: description.version});
        original.save();
        res.status(200).json(description);
    } else {
        return res.status(422).send({error: "does not own adventurer"});
    }
};
