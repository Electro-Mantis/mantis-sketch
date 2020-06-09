<template>
    <div class="brush-size">
        <label for="brush-size" class="sr-only">Brush Size</label>
        <input id="brush-size" type="range" v-model="size" :min="2" :max="20">
        <div class="brush-size__value">{{size}}</div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
    name:'toolBrushsize',
    computed: {
        size: {
            get() {
                return this.$store.state.draw.size;
            },
            set(value) {
                this.setSize(value);
            },
        }
    },
    methods: {
        ...mapMutations('draw', [
            'setSize',
        ]),
    }
}
</script>
<style scoped>
.brush-size {
    display: flex;
    align-items: center;
}

.brush-size__value {
    margin-left: 1em;
}
</style>
