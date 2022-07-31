<template>
    <div class="player-wrap">
        <transition-group name="player-list" tag="ol" class="players">
            <li class="player window-module" v-for="player in rankedPlayers" :key="player.id">
                <img class="player__avatar" :src="player.avatar" alt="Plater Avatar">
                <div class="player__name" :style="{color: player.color}">{{player.name}}</div>
                <div class="player__score">Score: {{player.score}}</div>
                <div class="player__indicator" v-if="player.typing" >💬</div>
            </li>
        </transition-group>
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
        rankedPlayers() {
            return this.players.sort((a,b) => a.score > b.score);
        }
    }
    
}
</script>

<style scoped>
.player-wrap {
    position: relative;
    display: grid;
    grid-template-columns: 2rem 1fr;
    grid-template-rows: 1fr;
}

.player-wrap::after {
    content: '';
    grid-column: 2;
    grid-row: 1;
    border: 2px solid var(--color-border);
    background-image: var(--background-stripes);
    box-shadow: .25rem .25rem 0 var(--color-border);
}

.players {
    list-style: none;
    margin: 0;
    padding: 0;
    grid-column: 1/-1;
    grid-row: 1;
    isolation: isolate;
    margin-right: 1.25rem;
    margin-bottom: 1.25rem;
    counter-reset: rank;
}

.player {
    display: grid;
    grid-template-columns: 20px 1fr 1.5em auto;
    grid-template-rows: 1fr .5fr;
    grid-template-areas: "avatar name icon rank" "avatar score icon rank";
    align-items: center;
    gap: 0 .75rem;
    padding: 8px;
    color: var(--color-font);
    margin-top: 1rem;
    background-image: none;
    counter-increment: rank;
}

.player::after {
    content: '#' counter(rank);
    grid-area: rank;
    font-weight: bold;
}

.player__avatar {
    grid-area: avatar;
    width: 100%;
    height: auto;
    border-radius: 0;
    border: solid 2px;
    width: 45px;
    justify-self: flex-end;
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

.player-list-move {
    transition: transform 0.5s ease-out;
}
</style>
