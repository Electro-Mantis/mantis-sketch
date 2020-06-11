<template>
    <div class="cursor" :style="{
            'transform': 'translate(' + mouseX + 'px, ' + mouseY + 'px)',
        }">
        <div class="brush-indicator" :style="{
                'font-size': size + 'px',
                'backgroundColor': color,
            }">
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'ToolCursor',
    props: {
        mouseX: {
            type: Number,
            required: true,
        },
        mouseY: {
            type: Number,
            required: true,
        }
    },
    computed: {
        ...mapState('draw', [
            'color',
            'size',
        ])
    }
}
</script>
<style scoped>
    .cursor {
        position: absolute;
        top: -2px;
        left: -2px;
        z-index: 100;
        pointer-events: none;
        box-sizing: border-box;
    }

    .brush-indicator {
        width: 1em;
        height: 1em;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border: 2px solid white;
        box-shadow: .05em .05em .1em rgba(0,0,0,.25),
                    inset .05em .05em .1em rgba(0,0,0,.25);
        border-radius: 100%;
        box-sizing: border-box;
    }
</style>
