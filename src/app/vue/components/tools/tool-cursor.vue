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
        ]),
        ...mapState('users', [
            'player',
        ])
    }
}
</script>
<style scoped>
    .cursor {
        position: absolute;
        top: 0;
        left: 0;
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
        box-shadow: 2px 2px var(--color-border),
                    inset 1px 1px black;
        border-radius: 100%;
        box-sizing: border-box;
    }

    .cursor__label {
        position: absolute;
        top: calc(-50% - .5em);
        height: 1em;
        line-height: 1;
        left: 8px;
        white-space: nowrap;
        font-weight: bold;
        text-shadow:
            -1px -1px 0 white,  
             1px -1px 0 white,
            -1px 1px 0 white,
             1px 1px 0 white;
    }
</style>
