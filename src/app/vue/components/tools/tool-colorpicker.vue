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
            palette: [
                '#DC143C',
                '#FF8C00',
                '#FFFF00',
                
                '#32CD32',
                '#008000',
                '#40E0D0',
                '#4169E1',
                '#2424bb',
                '#4B0082',
                '#800080',

                '#ffffff',
                '#C0C0C0',
                '#505050',
                '#000000',
            ],
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
    font-size: 3.1em;
    box-sizing: border-box;
    margin-bottom: 0;
}

.color-picker {
    display: flex;
    background: var(--color-background);
    border-radius: 40px;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    padding-top: 0.5em;
    padding-left: 0.5em;
}

.palette {
    width: 18.75em;
    padding-right: .5em;
}

.palette .color {
    margin-left: 0.5em;
    margin-bottom: 0.5em;
}

input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}

input[type="color"]::-webkit-color-swatch {
	border: none;
    color: #e23232;
}
</style>
