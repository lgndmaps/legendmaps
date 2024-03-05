const Joi = require("joi");
import { ORDER_BY_OPTIONS } from "../constants/maps";

const validateSearch = () =>
    Joi.string()
        .regex(/^[a-zA-Z0-9:', ]*$/)
        .message("Invalid characters in search");

const customTokenValidation = Joi.extend((joi) => {
    return {
        type: "stringArray",
        base: joi.array(),
        coerce(value, state, options) {
            return { value: value.split ? value.split(",") : value };
        },
    };
});

export const querySchema = Joi.object().keys({
    orderBy: Joi.string().valid(...Object.values(ORDER_BY_OPTIONS)),
    order: Joi.string().valid("asc", "desc"),
    brawn: Joi.number().integer().min(1).max(18),
    agility: Joi.number().integer().min(1).max(18),
    guile: Joi.number().integer().min(1).max(18),
    spirit: Joi.number().integer().min(1).max(18),
    total: Joi.number().integer().min(1).max(99),
    onlyDescriptions: Joi.boolean(),
    isUserQuery: Joi.boolean(),
    search: Joi.object().keys({
        tokenId: customTokenValidation.stringArray().items(Joi.number().integer()),
        name: validateSearch(),
        dweller: validateSearch(),
        items: validateSearch(),
        traps: validateSearch(),
        lineart: validateSearch(),
        wallMaterial: validateSearch(),
        biome: validateSearch(),
        glitch: validateSearch(),
        specialRoom: validateSearch(),
        art_head: validateSearch(),
        art_armor: validateSearch(),
        art_weapon: validateSearch(),
        art_gear: validateSearch(),
        art_shield: validateSearch(),
        art_special: validateSearch(),
        traits: validateSearch(),
    }),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    publicAddress: Joi.string(),
    project: Joi.string().valid("frwc", "gawds", "def", "fwb", "cryptocoven"),
    rewardId: Joi.number().integer().min(0),
});

// { orderBy = "tokenId", order = "asc", page = 1, search }
