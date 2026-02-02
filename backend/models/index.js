const userModel = require('./user');
const chatModel = require('./chat');


userModel.hasMany(chatModel , { foreignKey: 'userId'  , onDelete: 'CASCADE' });
chatModel.belongsTo(userModel, { foreignKey: 'userId'  , onDelete: 'CASCADE' });

module.exports = {
    userModel,
    chatModel
};