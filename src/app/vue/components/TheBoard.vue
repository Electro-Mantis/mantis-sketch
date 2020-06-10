<template>
    <div class="board-wrap">
        <div class="overlay"></div>
        <canvas-main />
    </div>
</template>

<script>
import CanvasMain from './canvas/canvas-main.vue';

import { throttle, debounce } from '../../../shared/debounce';

export default {
    name: 'TheBoard',
    components: {
        CanvasMain,
    },
}
</script>

<style scoped>
.board-wrap {
    border: solid 2px;
    height: 600px;
    overflow: hidden;
    position: relative;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    pointer-events: none;
}
</style>
