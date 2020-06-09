<template>
    <div class="color-picker">
        <div class="main-picker">
            <label class="sr-only" for="player-color">Player Color</label>
            <input class="color color--custom" id="player-color" type="color" v-model="internalValue">
        </div>
        <div class="palette">
            <button class="color" type="button" v-for="color in palette" :key="color" :style="{background: color}" :value="color" @click="internalValue = color"></button>
        </div>
    </div>
</template>
<script>
import Color from 'color';

export default {
    name:"ToolColorpicker",
    props:{
        value: {
            required: true,
            type: String,
            default: '#000'
        }
    },
    data() {
        return {
            internalValue: '',
            palette: [],
        };
    },
    watch: {
        internalValue() {
            this.$emit('input', this.internalValue);
        }
    },
    mounted() {
        this.internalValue = this.value;
        const color = Color('#e23232');
        for (let i = 0; i <= 255; i += 16) {
            this.palette.push(color.hsl().hue(i).hex());
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
    border: solid 2px;
    color: inherit;
    display: inline-block;
    line-height: 1;
}

.color:focus {
    outline: none;
}

.color--custom {
    font-size: 2.75em;
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
