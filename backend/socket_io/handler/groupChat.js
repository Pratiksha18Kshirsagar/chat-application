const groupchatHandler = (io, socket) => {

    socket.on("join_Group", ({ groupId }) => {
        socket.join(groupId);
        console.log(`${socket.user.Name} joined group ${groupId}`);
    });

    socket.on("media_message", ({ roomId, mediaUrl, type }) => {
        io.to(roomId).emit("media_message", {
            senderName: socket.user.Name,
            mediaUrl,
            type
        });
    });



    // group message
    socket.on("Group-message", ({ groupId, message }) => {

        console.log("Group message:", groupId, message);

        io.to(groupId).emit("receive_message", {
            text: message,
            user: socket.user.Name,
            email: socket.user.Email
        });
    });
};

module.exports = groupchatHandler;
