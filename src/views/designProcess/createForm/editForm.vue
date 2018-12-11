<template>
  <div>
    <editForm :editFormData="formList" :editFormName="editFormName" :editDescription="editDescription"></editForm>
  </div>
</template>

<script>
  import editForm from '@/components/Form/index'
  import { formDetail } from '@/api/createForm'
  export default {
    // 注册引入的组件
    components: { editForm },
    data() {
      return {
        formId: '',
        formList: [],
        editFormName: '',
        editDescription: ''
      }
    },
    created() {
      this.formId = this.$route.query.formId
      formDetail(this.formId).then(resp => {
        const list = resp.data.data.formInfos
        this.editFormName = resp.data.data.databaseFormName
        this.editDescription = resp.data.data.formDescription
        if (list.length !== 0) {
          list.forEach(e => {
            const Le = {
              ele: '',
              obj: {}
            }
            Le.ele = e.elementType
            Le.obj = e
            this.formList.push(Le)
          })
        }
      })
    }
  }
</script>

<style scoped>
* {
	margin: 0;
	padding: 0
}
</style>
