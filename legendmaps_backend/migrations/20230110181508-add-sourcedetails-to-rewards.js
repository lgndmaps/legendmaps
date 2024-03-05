'use strict';

module.exports = {


    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('pending_rewards', 'sourceDetails', {
                type: Sequelize.STRING(512),
            }),
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn('pending_rewards', 'sourceDetails');
    },


};
