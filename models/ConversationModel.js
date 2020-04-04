const permissions = [ 'public', 'private' ];

/*
 * Model Definition
 */

const ConversationModel = database.define('conversation', {
  id: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  permission: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [ permissions ],
        msg: 'The permission provided is invalid.',
      },
    },
  },
});

/*
 * Class Methods
 */

ConversationModel.createWithAssociations = async function({ data, userIds = [], transaction }) {
  userIds = [ ...new Set([ data.userId, ...userIds ]) ];

  const conversation = await this.create(data, { transaction });
  const conversationUsers = await database.models.conversationUser.bulkCreate((
    userIds.map(userId => ({ conversationId: conversation.id, userId }))
  ), { transaction });
  const users = await database.models.user.findAll({
    where: { id: userIds },
  }, { transaction });

  conversation.setDataValue('user', users.find(user => user.id === data.userId));
  conversation.setDataValue('conversationUsers', conversationUsers);

  conversationUsers.forEach(conversationUser => {
    conversationUser.setDataValue('user', users.find(user => {
      return conversationUser.userId === user.id;
    }));
  });

  return conversation;
};

/*
 * Export
 */

module.exports = ConversationModel;