'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "user",
      [
        {
          id: 1,
          username:"user1",
          name: "user1",
          email: "user1@test.com",
          password: await bcrypt.hash("123", 10),
        },
        {
          id: 2,
          username:"user2",
          name: "user2",
          email: "user2@test.com",
          password: await bcrypt.hash("1234", 10),
        },
        {
          id: 3,
          username:"user3",
          name: "user3",
          email: "user3@test.com",
          password: await bcrypt.hash("12345", 10),
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      "post",
      [
        {
          id: 1,
          title: "test1",
          description: "123",
          user_id: 1,
        },
        {
          id: 2,
          title: "test2",
          description: "2 123",
          user_id: 2,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('post', null, bulkDeleteOptions);
    await queryInterface.bulkDelete('user', null, bulkDeleteOptions);
  }
};
