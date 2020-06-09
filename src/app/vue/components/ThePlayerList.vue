<template>
    <div class="player-wrap">
        <ul class="players">
            <li class="player" v-for="player in players" :key="player.id">
                <img class="player__avatar" :src="player.avatar" alt="Plater Avatar">
                <div class="player__name" :style="{color: player.color}">{{player.name}}</div>
                <div class="player__score">Score: {{player.score}}</div>
                <div class="player__indicator" v-if="player.typing" >💬</div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    name: 'ThePlayerList',
    computed: {
        ...mapState('users', [
            'player',
            'players',
            'typingPlayers',
        ]),
    }
}
</script>

<style scoped>
.player-wrap {
    border: 2px solid;
}

.players {
    list-style: none;
    margin: 0;
    padding: 8px;
}

.player {
    display: grid;
    grid-template-columns: 45px 1fr auto;
    grid-template-rows: 1fr .5fr;
    grid-template-areas: "avatar name icon" "avatar score icon";
    align-items: center;
    grid-gap: 0 16px;
}

.player + .player {
    margin-top: 15px;
}

.player__avatar {
    grid-area: avatar;
    width: 100%;
    height: auto;
    border-radius: 100%;
    border: solid 2px;
}

.player__name {
    grid-area: name;
    font-weight: bold;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.25em;
}

.player__score {
    grid-area: score;
    font-weight: bold;
    opacity: .5;
}

.player__indicator {
    grid-area: icon;
    font-size: 1.5em;
    justify-self: center;
    align-self: center;
    line-height: 1;
}
</style>
