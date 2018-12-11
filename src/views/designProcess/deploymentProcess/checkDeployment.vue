<template>
    <div>
      <iframe :src="'/static/model/modeler.html?modelId='+modelId" frameborder="0" style="width: 100%; height: 973px"></iframe>
    </div>
</template>

<script>
    export default {
      name: 'index',
      data() {
        return {
          modelId: ''
        }
      },
      mounted() {
        this.modelId = this.$route.query.modelId
      },
      methods: {
      }
    }
</script>

<style scoped>

</style>