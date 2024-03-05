"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn("campaigns", "campaignRunStats", {
                type: Sequelize.JSONB,
            }),
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn("campaignss", "campaignRunStats");
    },
};
