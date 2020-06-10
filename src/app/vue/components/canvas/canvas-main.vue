<template>
    <div class="canvas-main">
        <canvas 
            ref="canvasEl"
            tabindex="0"
            :width="sizeX"
            :height="sizeY"
            @mousedown="paintStart"
            @mouseup="paintEnd"
            @blur="paintEnd"
            @mousemove="paintDraw"
        ></canvas>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import PxBrush from 'px-brush';
import { throttle } from '../../../../shared/debounce';

export default {
    name: 'CanvasMain',
    data(){
        return {
            isDrawing: false,
            context: null,
            brush: null,
            prevBrushPos: null,
            boundingRect: null,
            sizeX:836,
            sizeY:600,
        };
    },

    computed: {
        ...mapState('draw', [
            'color',
            'size',
        ]),

        ...mapState('users', [
            'player',
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
            // Cancel early if we are not drawing
            if(!this.isDrawing) return

            // Reset the drawing states
            this.isDrawing = false;
            this.prevBrushPos = null;
            this.$socket.emit('draw-stop');
        },
        paintDraw(event) {
            // Cancel early if we are not drawing
            if(!this.isDrawing) return

            // Get our bounding rect (for mouse calculations)
            this.boundingRect = this.$refs.canvasEl.getBoundingClientRect();

            // Get our current brush pos, if we don't have a prev pos, set it to current pos
            const currentBrushPos = this.getCanvasPos(event);
            if ( !this.prevBrushPos ) {
                this.prevBrushPos = currentBrushPos;
            }

            // use pxBrush to draw a line from prev pos to current pos
            const brushData = {
                from: this.prevBrushPos,
                to: currentBrushPos,
                size: this.size,
                color: this.color,
            };

            this.brush.draw(brushData);

            this.broadcastDrawInput(brushData);

            // Set our prev pos to current pos
            this.prevBrushPos = currentBrushPos;
        },

        drawCanvas(data) {
            this.brush.draw(data);
        },

        broadcastDrawInput: throttle(function(data) {
            data['id'] = this.player.id;
            this.$socket.emit('draw-input', data);
        }, 20),

        getCanvasPos(event) {
            return {
                x: event.clientX - this.boundingRect.left,
                y: event.clientY - this.boundingRect.top,
            }
        }
    },

    sockets: {
        syncDrawing(data) {
            this.drawCanvas(data);
        },

        drawHistory(history) {
            console.log('GOT HISTORY', history);
            history.forEach(step => {
                this.drawCanvas(step);
            });
        }
    },

    mounted() {
        // Set up our canvas context
        this.context = this.$refs.canvasEl.getContext('2d');

        // Set up our Pixel Brush
        this.brush = new PxBrush(this.$refs.canvasEl);

        // Get our bounding rect (for mouse calculations)
        this.boundingRect = this.$refs.canvasEl.getBoundingClientRect();
    }
}
</script>
<style scoped>
.canvas-main {
    height: 100%;
    position: relative;
}

.canvas-main canvas {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
