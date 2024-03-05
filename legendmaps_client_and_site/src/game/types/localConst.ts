export enum PHASER_DEPTH {
    MAP = 0, //0 is default in phaser, any number higher than 0 will be above it, internal depth is most recent on top.
    MAP_UNDERENTITY = 50,
    MAP_ENTITY = 100,
    COMBAT_UI = 200,
    COMBAT_UI_OVERLAY = 300,
    GAME_UI = 400,
    GAME_UI_OVERLAY = 500,
    CHARACTER_SHEET_UI = 600,
    CHARACTER_SHEET_UI_OVERLAY = 700,
    ABOVE_ALL = 700,
}

export enum FONT {
    TITLE_40 = "text_title_40_outline",
    TITLE_32 = "text_title_32_outline",
    TITLE_24 = "text_title",
    FLOATER_FILL = "floater_fill",
    FLOATER_OUTLINE = "floater_out",
    BODY_24_BLACKOUTLINE = "text_24_blackout",
    BODY_24 = "text_24",
    BODY_20 = "text_20",
    BOLD_24 = "bold_24",

    ASCII_18 = "ascii18",
    METER_18 = "meter_18",
}
