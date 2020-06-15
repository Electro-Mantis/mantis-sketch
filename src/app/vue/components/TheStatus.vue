<template>
    <div class="status-wrap">
        <div class="status-label">
            Waiting for Players - Doodle while you wait
        </div>
    </div>
</template>
<script>
export default {
    name: 'TheStatus',
}
</script>
<style scoped>
.status-wrap {
    padding: 16px;
    font-size: 1.5em;
    font-weight: bold;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    border-bottom: 16px solid var(--color-background);
    position: relative;
}

.status-wrap::before,
.status-wrap::after { 
    content: '';
    position: absolute;
    bottom: 0;
    width: 32px;
    height: 32px;
}

.status-wrap::before {
    left: 0;
    background: radial-gradient(circle at top right, transparent 32px, var(--color-background) 32px);
}

.status-wrap::after {
    right: 0;
    background: radial-gradient(circle at top left, transparent 32px, var(--color-background) 32px);
}
</style>
