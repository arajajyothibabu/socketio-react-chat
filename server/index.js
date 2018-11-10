
const server = require('http').createServer();

const conn = require('./db').conn;
const io = require('socket.io')(server);

server.listen(3000);

const { User, Conversation, Message } = require('./db').models;
conn.sync({ logging: false, force: true });

const mobileSockets = {};

io.on('connection', socket => {
    console.log("New socket connected...!");
    socket.on('newUser', credentials => {
        const { name, password } = credentials;
        console.log(name);
        Promise.all([
            User.findOrCreate({
                where: {
                    name,
                    password
                }
            }),
            User.findAll()
        ])
            .then(([user, users]) => {
                mobileSockets[user[0].id] = socket.id;
                socket.emit('userCreated', { user: user[0], users });
                socket.broadcast.emit('newUser', user[0]);
            });
    });

    socket.on('chat', users => {
        Conversation.findOrCreateConversation(users.user.id, users.receiver.id)
            .then(conversation => socket.emit('priorMessages', conversation.messages));
    });

    socket.on('message', ({ text, sender, receiver }) => {
        Message.createMessage(text, sender, receiver)
            .then(message => {
                socket.emit('incomingMessage', message);
                const receiverSocketId = mobileSockets[receiver.id];
                socket.to(receiverSocketId).emit('incomingMessage', message);
            });
    });

});


