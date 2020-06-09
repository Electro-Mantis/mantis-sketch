<template>
    <div class="toolbar-wrap">
        <tool-colorpicker/>
        <tool-brushsize/>
    </div>
</template>
<script>
import ToolColorpicker from './tools/tool-colorpicker.vue';
import ToolBrushsize from './tools/tool-brushsize.vue';

export default {
    name: 'TheToolbar',
    components: {
        ToolColorpicker,
        ToolBrushsize,
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
    border: solid 2px;
}
</style>
