<template>
    <div class="player-wrap">
        <ul class="players">
            <li class="player" v-for="player in players" :key="player.id">
                <img class="player__avatar" :src="player.avatar" alt="Plater Avatar">
                <div class="player__name" :style="{color: player.color}">{{player.name}}</div>
                <div class="player__score">Score: {{player.score}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'ThePlayerList',
    props: {
        players: {
            type: Array,
            required: true,
        }
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
    grid-template-columns: 45px 1fr;
    grid-template-rows: 1fr .5fr;
    grid-template-areas: "avatar name" "avatar score";
    align-items: center;
    grid-gap: 0 16px;
    margin-right: -8px;
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
    padding-right: 8px;
}

.player__score {
    grid-area: score;
    border-top: 2px solid;
    padding-top: .25em;
    font-weight: bold;
}
</style>
