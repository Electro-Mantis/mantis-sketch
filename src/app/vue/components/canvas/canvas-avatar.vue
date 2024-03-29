<template>
    <canvas 
        class="avatar-canvas"
        tabindex="0"
        :width="sizeX"
        :height="sizeY"
        @mousedown="paintStart"
        @mouseup="paintEnd"
        @blur="paintEnd"
        @mousemove="paintDraw"
    ></canvas>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import PxBrush from 'px-brush';

export default {
    name: 'CanvasAvatar',
    props: {
        value: {
            type: String,
            required: false,
        },

        sizeX: {
            type: Number,
            required: true,
        },
        sizeY: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            isDrawing: false,
            context: null,
            brush: null,
            prevBrushPos: null,
            boundingRect: null,
        };
    },

    computed: {
        ...mapState('draw', [
            'color',
            'size',
        ]),
    },

    // Set the canvas settings as our properties change
    watch: {
        color() {
            this.context.strokeStyle = this.color;
        },
        size() {
            this.context.lineWidth = this.size;
        },
    },

    methods: {
        // Start the drawing
        paintStart(event) {
            // Enable and start the drawing
            this.isDrawing = true;
            this.paintDraw(event);
        },
        // End drawing
        paintEnd(event) {
            // Reset the drawing states
            this.isDrawing = false;
            this.prevBrushPos = null;

            // Send the value of the image to our v-model
            this.$emit('input', this.$el.toDataURL('image/png'));
        },
        paintDraw(event) {
            // Cancel early if we are not drawing
            if(!this.isDrawing) return

            // Get our current brush pos, if we don't have a prev pos, set it to current pos
            const currentBrushPos = this.getCanvasPos(event);
            if ( !this.prevBrushPos ) {
                this.prevBrushPos = currentBrushPos;
            }

            // use pxBrush to draw a line from prev pos to current pos
            this.brush.draw({
                from: this.prevBrushPos,
                to: currentBrushPos,
                size: this.size,
                color: this.color,
            });

            // Set our prev pos to current pos
            this.prevBrushPos = currentBrushPos;
        },

        getCanvasPos(event) {
            return {
                x: event.clientX - this.boundingRect.left,
                y: event.clientY - this.boundingRect.top,
            }
        }
    },
    mounted() {
        // Set up our canvas context
        this.context = this.$el.getContext('2d');

        // Set up our Pixel Brush
        this.brush = new PxBrush(this.$el);

        // Get our bounding rect (for mouse calculations)
        this.boundingRect = this.$el.getBoundingClientRect();

        // Emit our initial image value
        this.$emit('input', this.$el.toDataURL('image/png'));
    }
}
</script>

<style scoped>
.avatar-canvas {
    display: block;
    border: 2px solid;
}

.avatar-canvas:focus {
    outline: none!important;
}
</style>
