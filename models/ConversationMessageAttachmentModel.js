/*
 * Model Definition
 */

const ConversationMessageAttachmentModel = database.define('conversationMessageAttachment', {
  conversationMessageId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  attachmentId: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
});

/*
 * Export
 */

module.exports = ConversationMessageAttachmentModel;