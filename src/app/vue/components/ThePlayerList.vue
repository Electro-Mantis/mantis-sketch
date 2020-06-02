<template>
    <div class="player-wrap">
        <ul class="players">
            <li class="player" v-for="player in players" :key="player.id">
                <div class="player__name" :style="{color: player.color}">{{player.name}}</div>
                <div class="player__score">{{player.score}}</div>
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
</style>
