<template>
    <div class="toolbar-wrap window-module">
        <tool-colorpicker/>
        <tool-brushsize/>
        <tool-brushtype/>
    </div>
</template>
<script>
import ToolColorpicker from './tools/tool-colorpicker.vue';
import ToolBrushsize from './tools/tool-brushsize.vue';
import ToolBrushtype from './tools/tool-brushtype.vue';

export default {
    name: 'TheToolbar',
    components: {
        ToolColorpicker,
        ToolBrushsize,
        ToolBrushtype,
    },
    data() {
        return {
        };
    },
    mounted() {
    }
}
</script>
<style scoped>
.toolbar-wrap {
    padding: 1rem;
    display: flex;
    align-items: center;
    position: relative;
}
</style>
