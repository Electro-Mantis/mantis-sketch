<template>
    <div class="tool-type">
        <button :class="{'button': true, 'active': type.id === toolType}" v-for="(type, key) in types" :key="key" :title="type.label" @click="setToolType(type.id)">
            <i :class="type.icon"></i>
        </button>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'ToolBrushtype',
    computed: {
        toolType: {
            get() {
                return this.$store.state.draw.toolType;
            },
            set(value) {
                this.setToolType(value);
            },
        }
    },

    data() {
        return {
            types: {
                brush: {
                    label: 'Paintbrush',
                    id: 'brush',
                    icon: 'fas fa-paint-brush',
                },
                bucket: {
                    label: 'Bucket Fill',
                    id: 'bucket',
                    icon: 'fas fa-fill-drip',
                },
                eraser: {
                    label: 'Eraser',
                    id: 'eraser',
                    icon: 'fas fa-eraser',
                },
                clear: {
                    label: 'Clear Image',
                    id: 'clear',
                    icon: 'fas fa-trash-alt',
                },
            }
        };
    },

    methods: {
        ...mapMutations('draw', [
            'setToolType',
        ]),
    }
}
</script>
<style scoped>
    .tool-type {
        display: flex;
        flex-wrap: wrap;
        min-width: 85px;
    }

    .tool-type .button {
        font-size: 1em;
        height: 2em;
        width: 2em;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px;
    }
</style>
