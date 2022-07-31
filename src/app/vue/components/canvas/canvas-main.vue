<template>
    <div class="canvas-main">
        <canvas 
            ref="canvasEl"
            tabindex="0"
            :width="sizeX"
            :height="sizeY"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @blur="handleMouseUp"
            @mousemove="handleMouseMove"
            @wheel.prevent="scrollAction"
        ></canvas>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import PxBrush from 'px-brush';
import 'floodfill';

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
            sizeX:870,
            sizeY:600,
        };
    },

    computed: {
        size: {
            get() {
                return this.$store.state.draw.size;
            },
            set(value) {
                this.setSize(value);
            },
        },

        ...mapState('draw', [
            'color',
            'toolType',
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
        ...mapMutations('draw', [
            'setSize',
        ]),

        handleMouseDown(event) {
            switch (this.toolType) {
                case 'brush':
                    this.paintStart(event);
                    break;
                case 'bucket':
                    this.BucketFillCanvas(event);
                    break;
                case 'eraser':
                    break;
            }
        },
        handleMouseUp(event) {
            switch (this.toolType) {
                case 'brush':
                    this.paintEnd(event);
                    break;
                case 'bucket':
                    break;
                case 'eraser':
                    break;
            }
        },
        handleMouseMove(event) {
            switch (this.toolType) {
                case 'brush':
                    this.paintDraw(event);
                    break;
                case 'bucket':
                    break;
                case 'eraser':
                    break;
            }
        },

        scrollAction(event) {
            console.log('SCROLL');
            this.size += (event.deltaY > 0 ? 1 : -1);
        },

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
                type: 'brush',
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

        syncCanvas(data) {
            switch (data.type) {
                case 'brush':
                    this.syncDraw(data);
                    break;
                case 'bucket':
                    this.syncBucket(data);
                    break;
                case 'eraser':
                    break;
            }
        },

        syncDraw(data) {
            this.brush.draw(data);
        },

        syncBucket(data) {
            this.context.fillStyle = data.color;
            this.context.fillFlood(data.pos.x, data.pos.y, 32);
        },

        BucketFillCanvas(event) {
            const pos = this.getCanvasPos(event);
            this.context.fillStyle = this.color;
            this.context.fillFlood(pos.x, pos.y, 32);

            this.broadcastDrawInput({
                type: 'bucket',
                pos: pos,
                color: this.color,
            })
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
            this.syncCanvas(data);
        },

        drawHistory(history) {
            console.log('GOT HISTORY', history);
            history.forEach(step => {
                this.syncCanvas(step);
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
    cursor: none;
    overflow: hidden;
}

.canvas-main canvas {
    width: 100%;
    height: 100%;
    display: block;
    cursor: none;
    border: 0;
    outline: none;
    margin-left: -1px;
    background: white;
    background-image: radial-gradient(var(--color-border) 1px, transparent 0);
    background-size: 40px 40px;
}
</style>
