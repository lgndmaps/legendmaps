"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn("users", "lastRefresh", {
                type: Sequelize.DATE,
            }),
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn("users", "lastRefresh");
    },
};
