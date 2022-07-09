"use strict";

const bcrypt = require("bcrypt");

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('users', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert("users", [
            {
                email: "triadi@gmail.com",
                name: "Tri Adi",
                password: bcrypt.hashSync("passwordsusah123", 25),
                profession: "admin",
                avatar: null,
                role: "admin",
                created_at: Date.now(),
                updated_at: Date.now(),
            },
            // {
            //     email: "admin@admin.com",
            //     name: "admin admin admin",
            //     password: bcrypt.hashSync("passwordsusah123", 25),
            //     profession: "admin",
            //     avatar: null,
            //     role: "admin",
            //     created_at: Date.now(),
            //     updated_at: Date.now(),
            // },
            // {
            //     email: "isardi@gmail.com",
            //     name: "Isardi",
            //     password: bcrypt.hashSync("passwordsusah123", 25),
            //     profession: "student",
            //     avatar: null,
            //     role: "student",
            //     created_at: Date.now(),
            //     updated_at: Date.now(),
            // },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('users', null, {});
         */
        await queryInterface.bulkDelete("users", null, {});
    },
};
