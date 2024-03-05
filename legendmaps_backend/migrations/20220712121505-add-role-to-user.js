"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn("users", "role", {
                type: Sequelize.STRING,
                defaultValue: "user",
            }),
            queryInterface.addColumn("users", "roles", {
                type: Sequelize.Array(STRING),
                defaultValue: ["user"],
            }),
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn("users", "role");
    },
};
