import socket from 'socket.io';
import {getObjectIndex} from '../../shared/object';

let playerList = [];
let playerLimbo = [];
let drawHistory = [];


const updatePlayer = function(id, attrs) {
    const index = getObjectIndex(playerList, 'id', id);
    const keys = Object.keys(attrs);
    
    keys.forEach(key => {
        playerList[index][key] = attrs[key];
    });
}

const setup = function(server) {
    const io = socket(server);

    io.on('connection', socket => {

        // region Sign In/Out
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

                // We don't have a valid player obj, but we were still given an old id. We exit out in this case.
            } else if (player.oldid) {
                console.log(player.oldid, 'has expired. Not signing in.');
                return;
            }

            socket.emit('retrievePlayerData', player);

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

            // If we have a drawing, then we need to send the drawing to our new player
            socket.emit('drawHistory', drawHistory);
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
        // endregion Sign In/Out

        // region Messaging
        socket.on('message', data => {
            data['time'] = Date.now();
            if (data.playerID) {
                console.log('we have an id');
                const player = playerList.filter(p => p.id === data.playerID)[0];
                data['player'] = {
                    id: player.playerID,
                    name: player.name,
                    color: player.color,
                };
            }

            console.log('message Data', data);
            io.emit('messageChannel', data);
        });

        socket.on('type-start', data => {
            updatePlayer(data.id, {typing: true});
            io.emit('refreshPlayers', playerList);
        });

        socket.on('type-end', data => {
            updatePlayer(data.id, { typing: false });
            io.emit('refreshPlayers', playerList);
        });
        // endregion Messaging

        // region Drawing
        let previousBrushPos = null;
        

        socket.on('draw-input', data => {
            // If we don't have prev brush pos, cache it, else get from cache
            // This is to compensate for latency. The server stores the last known position
            if(!previousBrushPos && data.from) {
                previousBrushPos = data.from;
            } else {
                data.from = previousBrushPos;
            }

            drawHistory.push(data);
            socket.broadcast.emit('syncDrawing', data);

            if(data.to) {
                previousBrushPos = data.to;
            }
        });

        socket.on('draw-stop', () => {
            previousBrushPos = null;
        });
        // endregion Drawing
    });
}
// endregion

export {setup};
