<template>
    <div class="tool-type">
        <button class="button" v-for="(type, key) in types" :key="key" :title="type.label">
            <i :class="type.icon"></i>
        </button>
    </div>
</template>

<script>
export default {
    name: 'ToolBrushtype',
    computed: {

    },

    data() {
        return {
            types: {
                brush: {
                    label: 'Paintbrush',
                    icon: 'fas fa-paint-brush',
                },
                bucket: {
                    label: 'Bucket Fill',
                    icon: 'fas fa-fill-drip',
                },
                eraser: {
                    label: 'Eraser',
                    icon: 'fas fa-eraser',
                },
                clear: {
                    label: 'Clear Image',
                    icon: 'fas fa-trash-alt',
                },
            }
        };
    }
}
</script>
<style scoped>
    .tool-type {
        display: flex;
        flex-wrap: wrap;
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
