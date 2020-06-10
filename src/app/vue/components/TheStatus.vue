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
    border: 2px solid;
    padding: 16px;
    font-size: 1.5em;
    font-weight: bold;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}
</style>
