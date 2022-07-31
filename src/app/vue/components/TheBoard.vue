<template>
    <div class="board-wrap" @mousemove="getMousePos">
        <tool-cursor class="cursor--mycursor" :mouseX="mouseX" :mouseY="mouseY"/>
        <div class="overlay"></div>
        <canvas-main />
    </div>
</template>

<script>
import CanvasMain from './canvas/canvas-main.vue';
import ToolCursor from './tools/tool-cursor.vue';

import { throttle, debounce } from '../../../shared/debounce';

export default {
    name: 'TheBoard',
    components: {
        CanvasMain,
        ToolCursor,
    },

    data() {
        return {
            mouseX: 0,
            mouseY: 0,
            boundingRect: null,
        };
    },

    methods: {
        getMousePos(event) {
            this.boundingRect = this.$el.getBoundingClientRect();
            this.mouseX = event.clientX - this.boundingRect.left;
            this.mouseY = event.clientY - this.boundingRect.top;
        },
    },

    mounted() {
        this.boundingRect = this.$el.getBoundingClientRect();
    }
}
</script>

<style scoped>
.board-wrap {
    height: 600px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    border: 0;
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

.cursor--mycursor {
    display: none;
}

.board-wrap:hover .cursor--mycursor {
    display: block;
}
</style>
