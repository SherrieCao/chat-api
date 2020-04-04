const AttachmentModel = rootRequire('/models/AttachmentModel');
const ConversationModel = rootRequire('/models/ConversationModel');
const ConversationMessageModel = rootRequire('/models/ConversationMessageModel');
const ConversationMessageAttachmentModel = rootRequire('/models/ConversationMessageAttachmentModel');
const ConversationMessageEmbedModel = rootRequire('/models/ConversationMessageEmbedModel');
const ConversationUserModel = rootRequire('/models/ConversationUserModel');
const EmbedModel = rootRequire('/models/EmbedModel');
const UserModel = rootRequire('/models/UserModel');
const UserFollowerModel = rootRequire('/models/UserFollowerModel');

ConversationModel.belongsTo(UserModel);
ConversationModel.hasMany(ConversationMessageModel);
ConversationModel.hasMany(ConversationUserModel);

ConversationMessageModel.belongsToMany(AttachmentModel, { through: ConversationMessageAttachmentModel });
ConversationMessageModel.belongsToMany(EmbedModel, { through: ConversationMessageEmbedModel });
ConversationMessageModel.belongsTo(UserModel);

ConversationUserModel.belongsTo(ConversationModel);
ConversationUserModel.belongsTo(UserModel);

UserModel.hasMany(AttachmentModel);
UserModel.hasMany(ConversationModel);
UserModel.hasMany(EmbedModel);

UserFollowerModel.belongsTo(UserModel);
UserFollowerModel.belongsTo(UserModel, { foreignKey: 'followerUserId', as: 'followerUser' });

module.exports = database.sync({ force: true });
