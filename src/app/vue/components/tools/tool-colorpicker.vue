<template>
    <div class="color-picker">
        <div class="main-picker">
            <label class="sr-only" for="player-color">Player Color</label>
            <input class="color color--custom" id="player-color" type="color" v-model="color">
        </div>
        <div class="palette">
            <button class="color" type="button" v-for="thisColor in palette" :key="thisColor" :style="{background: thisColor}" :value="thisColor" @click="setColor(thisColor)"></button>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import Color from 'color';

export default {
    name:"ToolColorpicker",
    data() {
        return {
            palette: [],
        };
    },
    computed: {
        color: {
            get() {
                return this.$store.state.draw.color;
            },
            set(value) {
                this.setColor(value);
            },
        },
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
            'setColor',
        ]),
    },
    mounted() {
        // Set up palette colors
        const startColor = Color('#e23232');
        for (let i = 0; i <= 255; i += 16) {
            this.palette.push(startColor.hsl().hue(i).hex());
        }
        this.palette.push('#ffffff');
        this.palette.push('#000000');
    }
}
</script>
<style scoped>
.color {
    width: 1em;
    height: 1em;
    border-radius: 100%;
    overflow: hidden;
    padding: 0;
    font-size: 1.25em;
    border: 0;
    box-shadow: 2px 2px 4px rgba(0,0,0,.25);
    color: inherit;
    display: inline-block;
    line-height: 1;
}

.color:focus {
    outline: none;
}

.color--custom {
    font-size: 3em;
    margin-right: 0.05em;
    margin-top: -.01em;
}

.color-picker {
    display: flex;
}

.palette {
    width: 13.5em;
    columns: 10;
}

.palette .color {
    margin-left: 0.25em;
    margin-bottom: 0.25em;
}

input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}

input[type="color"]::-webkit-color-swatch {
	border: none;
    color: #e23232;
}
</style>
