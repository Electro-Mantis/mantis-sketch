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

        brushSize: {
            type: [Number, String],
            default: 10,
        },
        brushColor: {
            type: String,
        },
    },

    data() {
        return {
            isDrawing: false,
            context: null,
            boundingRect: null,
        };
    },

    // Set the canvas settings as our properties change
    watch: {
        brushColor() {
            this.context.strokeStyle = this.brushColor;
        },
        brushSize() {
            this.context.lineWidth = this.brushSize;
        },
    },

    methods: {
        // Start the drawing
        paintStart(event) {
            this.isDrawing = true;
            this.paintDraw(event);
        },
        // End drawing
        paintEnd(event) {
            this.isDrawing = false;
            this.context.beginPath();

            // Send the value of the image to our v-model
            this.$emit('input', this.$el.toDataURL('image/png'));
        },
        paintDraw(event) {
            // Cancel early if we are not drawing
            if(!this.isDrawing) return

            // Draw our line between previous mouse pos and current mouse pos
            this.context.lineTo(event.clientX - this.boundingRect.left, event.clientY - this.boundingRect.top)
            this.context.stroke();
            this.context.beginPath()
            this.context.moveTo(event.clientX - this.boundingRect.left, event.clientY - this.boundingRect.top)
        },
    },
    mounted() {
        // Set up our canvas context
        this.context = this.$el.getContext('2d');

        // Set up initial canvas config
        this.context.strokeStyle = this.brushColor;
        this.context.lineWidth = this.brushSize;
        this.context.lineCap = 'round';

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
    border-radius: 1000px;
}
</style>
