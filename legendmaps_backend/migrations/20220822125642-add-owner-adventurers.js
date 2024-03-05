"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn("adventurers", "owner", {
                type: Sequelize.STRING,
            }),
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn("adventurers", "owner");
    },
};
