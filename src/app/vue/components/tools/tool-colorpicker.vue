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
    width: 1.25rem;
    height: 1.25rem;
    overflow: hidden;
    padding: 0;
    border: 0;
    color: inherit;
    display: inline-block;
    line-height: 1;
    cursor: pointer;
    border: 2px solid;
}

.color:focus {
    outline: none;
}

.color:hover {
    box-shadow: 2px 2px var(--color-border);
    transform: translate(-2px, -2px);
}

.color--custom {
    width: 3rem;
    height: 3rem;
    box-sizing: border-box;
    margin-bottom: 0;
    appearance: none;
}

.color--custom:hover {
    box-shadow: 4px 4px var(--color-border);
    transform: translate(-4px, -4px);
}

::-moz-color-swatch {
    border-color: transparent;
}

.color-picker {
    display: flex;
    gap: .5rem;
}

.palette {
    display: grid;
    grid-template-columns: repeat(10, auto);
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 18em;
    align-self: flex-start;
    gap: .5rem;
}

input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
    border: 0;
    outline: 0;
}

input[type="color"]::-webkit-color-swatch {
	border: none;
}
</style>
