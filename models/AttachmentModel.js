/*
 * Model Definition
 */

const AttachmentModel = database.define('attachment', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bytes: {
    type: Sequelize.INTEGER(16).UNSIGNED,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  width: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
  height: {
    type: Sequelize.INTEGER(10).UNSIGNED,
  },
});

/*
 * Export
 */

module.exports = AttachmentModel;
