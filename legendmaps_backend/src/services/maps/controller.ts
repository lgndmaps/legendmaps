import {NextFunction, Request, Response} from "express";
import Sequelize, {QueryTypes} from "sequelize";
import {sequelize} from "../../db";
import {LegendMap} from "../../models/map.model";
import {ARRAY_COLUMNS, SEARCH_FIELDS} from "../../constants/maps";
import {LegendMapDetails, RunRecord} from "../../models";
import {fn} from "sequelize";

const {Op} = Sequelize;

const handleHasNextPage = (count: number, page: number, limit: number): boolean => {
    return count > +page * limit;
};
// find all maps
export const find = async (req: Request, res: Response, next: NextFunction) => {
    let {
        orderBy = "tokenId",
        order = "asc",
        page = 1,
        search = "",
        isUserQuery = false,
        publicAddress = undefined,
    } = req.query;
    const searchKey = Object.keys(search)[0];
    let searchValue = search[searchKey];
    if (searchKey === "tokenId") {
        searchValue = searchValue.split(",").map((tokenId) => parseInt(tokenId));
    }
    const limit = isUserQuery ? 300 : 12;

    const offset = page ? (+page - 1) * limit : 0;

    let whereClause = {};
    let arrayResults: LegendMap[] | [] | void | Object[];
    let totalLength: { count: number }[] | null;

    if (publicAddress) {
        whereClause["owner"] = {
            [Op.iLike]: publicAddress,
        };
    }
    if (searchValue && searchKey) {
        if (searchKey === SEARCH_FIELDS.TOKEN_ID) {
            page = 1;
            whereClause = {
                ...whereClause,
                [searchKey]: {
                    [Op.in]: searchValue,
                },
            };
        } else {
            // This is to iLike search array fields, Sequelize doesn't seem to have a way to do this
            if (ARRAY_COLUMNS.includes(searchKey)) {
                totalLength = await sequelize.query(
                    `SELECT count(*)
        FROM maps
        WHERE EXISTS (
          SELECT * FROM unnest(${searchKey}) as n
          WHERE n LIKE :search 
        )`,
                    {
                        replacements: {search: `%${searchValue}%`},
                        type: QueryTypes.SELECT,
                    },
                );
                arrayResults = await sequelize
                    .query(
                        `SELECT *
          FROM maps
          WHERE EXISTS (
            SELECT * FROM unnest(${searchKey}) as n
            WHERE n LIKE :search 
          ) ORDER BY "${orderBy}" ${order} LIMIT :limit OFFSET :offset `,
                        {
                            replacements: {
                                search: `%${searchValue}%`,
                                col: searchKey,
                                order,
                                orderBy,
                                limit,
                                offset,
                            },
                            type: QueryTypes.SELECT,
                        },
                    )
                    .then((maps: LegendMap[]) => maps)
                    .catch((err) => {
                        console.log(err, "err");
                        return next(err);
                    });
            }
            // Default key value search
            whereClause = {
                ...whereClause,
                [searchKey]: {[Op.iLike]: `%${searchValue}%`},
            };
        }
    }

    if (arrayResults) {
        const {count} = totalLength[0] || {count: 0};
        const hasNextPage = handleHasNextPage(count, +page, limit);
        return res.json({count, page, hasNextPage, rows: arrayResults});
    }
    // check if seach query has any of the searchable fields
    const querySettings = {
        where: whereClause,
        limit,
        order: [[`${orderBy}`, order]],
        offset,
    };

    // @ts-ignore seems there is a type bug with order the double [[]] was required to fix
    return await LegendMap.findAndCountAll(querySettings)
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

    const query: string = 'SELECT maps."asciiMap",' +
        '       maps.biome,' +
        '       maps."challengeRating",' +
        '       maps.dweller,' +
        '       maps."enemyRarityRank",' +
        '       maps."featureRarityRank",' +
        '       maps.glitch,' +
        '       maps.image,' +
        '       maps."itemRarityRank",' +
        '       maps.items,' +
        '       maps.lineart,' +
        '       maps.name,' +
        '       maps.owner,' +
        '       maps."roomCount",' +
        '       maps."specialRoom",' +
        '       maps."tokenId",' +
        '       maps.traps,' +
        '       maps."wallMaterial",' +
        '       "map_details"."details" as details,' +
        '       COUNT("run_records"."mapId") AS total_count,' +
        '       SUM(CASE WHEN run_records.died = true THEN 1 ELSE 0 END) AS died_count,' +
        '       SUM("run_records"."chestsOpened") AS chests_opened,' +
        '       SUM("run_records"."goldLooted") AS gold_looted,' +
        '       SUM("run_records"."itemsLooted") AS items_looted' +
        ' FROM maps' +
        ' LEFT JOIN run_records ON "maps"."tokenId" = "run_records"."mapId"' +
        ' LEFT JOIN map_details ON "maps"."tokenId" = "map_details"."tokenId"' +
        ' WHERE "maps"."tokenId" = ' + tokenId + '' +
        ' GROUP BY "maps"."tokenId", "map_details"."tokenId"';

    let mainMapDataQuery = await sequelize.query(query, {type: QueryTypes.SELECT}).catch((e) => {
        console.log("ERROR!", e);
        return "error";
    });
    //This type is currently defined on client, still need to add type server side map + details + causes of death array
    let mapResults: any = mainMapDataQuery[0];

    let codQuerySQL: string = 'SELECT "causeOfDeath", COUNT("causeOfDeath") as count FROM "run_records" WHERE "run_records"."mapId" = ' + tokenId + ' AND "causeOfDeath" IS NOT NULL AND "causeOfDeath" != \'\' GROUP BY "causeOfDeath" ORDER BY count DESC LIMIT 5;';
    let codQuery = await sequelize.query(codQuerySQL, {type: QueryTypes.SELECT}).catch((e) => {
        console.log("ERROR!", e);
        return "error";
    });
    mapResults.causesOfDeath = codQuery;
    
    return res.json(mapResults);

    /*
    const map = await LegendMap.findOne({
            where: {
                tokenId: tokenId,
            },
            include: [{model: LegendMapDetails},

            ]
        }
    )
        .then((mapDetails: any | null) => {
            if (mapDetails) {
                //console.dir(mapDetails, {depth: 2});
                let jsonresponse = res.json(mapDetails);
                //console.log("JSON RESPONSE: " + JSON.stringify(jsonresponse));
                return jsonresponse;
            } else {
                return res.json({error: "map not found"});
            }
        })
        .catch((e) => {
            console.log(e, "err");
            return next(e);
        })
*/


};


