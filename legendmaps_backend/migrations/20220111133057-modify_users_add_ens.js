"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn("users", "ens", {
                type: Sequelize.STRING,
                unique: true,
            }),
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn("users", "ens");
    },
};
