<template>
  <div id="preview">
    <Form :label-width="100" class="b-a">
      <transition-group class="form-list-group" type="transition" :name="'flip-list'" tag="div">
        <renders v-for="(element,index) in formList" :key="index" :ele="element.ele" :obj="element.obj || {}"></renders>
      </transition-group>
    </Form>
  </div>
</template>

<script>
  import { formDetail } from '@/api/createForm'
  export default {
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
  #preview {
    width: 70%;
    min-height: 500px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background: whitesmoke;
    transition: all 0.2s linear;
  }
  #preview:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    transform: translate3d(0, 2px, 0);
  }
  * {
    margin: 0;
    padding: 0
  }
</style>
