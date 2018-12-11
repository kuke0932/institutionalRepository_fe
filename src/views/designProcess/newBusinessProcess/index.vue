<template>
    <div>
      <iframe :src="'/static/model/modeler.html?modelId='+modelId" frameborder="0" style="width: 100%; height: 973px"></iframe>
    </div>
</template>

<script>
    import { content } from '@/api/newBusinessProcess'
    export default {
      name: 'index',
      data() {
        return {
          modelId: ''
        }
      },
      mounted() {
        this.showContent()
      },
      methods: {
        showContent() {
          content().then(resp => {
            this.modelId = resp.data.data
          })
        }
      }
    }
</script>

<style scoped>

</style>
