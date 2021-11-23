module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "user", // table name
        "username", // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        }
      ),
      queryInterface.addColumn("user", "imageUrl", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("user", "username"),
      queryInterface.removeColumn("user", "imageUrl"),
    ]);
  },
};
