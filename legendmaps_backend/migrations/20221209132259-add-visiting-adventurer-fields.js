"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn("adventurers", "nativeTokenId", {
                type: Sequelize.INTEGER,
            }),
            queryInterface.addColumn("adventurers", "project", {
                type: Sequelize.STRING,
                defaultValue: "LM",
            }),
            queryInterface.addColumn("characters", "nativeTokenId", {
                type: Sequelize.INTEGER,
            }),
            queryInterface.addColumn("characters", "project", {
                type: Sequelize.STRING,
                defaultValue: "LM",
            }),
        ]);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn("adventurers", "nativeTokenId"),
            queryInterface.removeColumn("adventurers", "project"),
            queryInterface.removeColumn("characters", "nativeTokenId"),
            queryInterface.removeColumn("characters", "project");
    },
};
