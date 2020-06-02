import socket from 'socket.io';
let playerList = [];
let playerLimbo = [];

const setup = function(server) {
    const io = socket(server);

    io.on('connection', socket => {

        socket.on('sign-in', player => {
            // If we have an old id, try to retrieve it from limbo
            const retrievedPlayer = playerLimbo.filter(p => p.id == player.oldid)[0];

            let returnMessage = '';

            // If we are able to retrieve a player from limbo, then override 
            // the data that was sent in, and broadcast the saved player info back to the client.
            if (retrievedPlayer !== undefined) {
                player = retrievedPlayer;
                console.log('Retrieved Player', player);
                returnMessage = 'Welcome back, ' + player.name + ' 👋';

                socket.emit('retrievePlayerData', player);

                // We don't have a valid player obj, but we were still given an old id. We exit out in this case.
            } else if (player.oldid) {
                console.log(player.oldid, 'has expired. Not signing in.');
                return;
            }

            // Alert the chat of the new player
            // Our message hasn't been written yet, welcome the new player.
            returnMessage = returnMessage ? returnMessage : player.name + ' has joined 👋';
            io.emit('messageChannel', {
                message: returnMessage,
                time: Date.now(),
            });


            // Add the new player to the chat and refresh the list for everybody.
            playerList.push(player);
            io.emit('refreshPlayers', playerList);
        });

        socket.on('sign-out', id => {
            // Get the player's info that is signing off, and alert chat.
            const leavingPlayer = playerList.filter(p => p.id === id)[0];
            console.log('Player', leavingPlayer);
            io.emit('messageChannel', {
                message: leavingPlayer.name + ' has left 😔',
                time: Date.now(),
            });

            // Add the leaving player to the limbo, so he can potentially join back in.
            playerLimbo.push(leavingPlayer);

            // Filter that player our of the active player list and refresh
            playerList = playerList.filter(p => p.id !== id);
            io.emit('refreshPlayers', playerList);
        });

        socket.on('message', data => {
            data['time'] = Date.now();
            io.emit('messageChannel', data);
        });
    });
}
// endregion

export {setup};
