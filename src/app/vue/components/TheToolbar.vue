<template>
    <div class="toolbar-wrap">
        <tool-colorpicker v-model="internalColorValue" />
    </div>
</template>
<script>
import ToolColorpicker from './tools/tool-colorpicker.vue';

export default {
    name: 'TheToolbar',
    components: {
        ToolColorpicker,
    },
    props: {
        colorValue: {
            required: true,
            type: String,
        }
    },
    data() {
        return {
            internalColorValue: '',
        };
    },
    watch: {
        internalColorValue() {
            this.$emit('inputColor', this.internalColorValue);
        }
    },
    mounted() {
        this.internalColorValue = this.colorValue;
    }
}
</script>
<style scoped>
.toolbar-wrap {
    border: solid 2px;
}
</style>
