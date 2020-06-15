<template>
    <div class="toolbar-wrap">
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
    padding: 16px 32px;
    display: flex;
    align-items: center;
    border-top: 15px solid var(--color-background);
    border-bottom: 0;
    position: relative;
}
.toolbar-wrap::before,
.toolbar-wrap::after {
    content: '';
    position: absolute;
    top: 0;
    width: 32px;
    height: 32px;
}

.toolbar-wrap::before {
    left: 0;
    background: radial-gradient(circle at bottom right, transparent 32px, var(--color-background) 32px);
}

.toolbar-wrap::after {
    right: 0;
    background: radial-gradient(circle at bottom left, transparent 32px, var(--color-background) 32px);
}
</style>
