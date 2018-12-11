<template>
  <div class="container">
    <preview v-for="(item, index) in template_form" :key="index" :ele="item.ele" :obj="item.obj"></preview>
  </div>
</template>
<script>
export default {
  props: ['editFormData'],
  data() {
    return {
      template_form: this.editFormData || []
    }
  },
  watch: {
    editFormData(val) {
      console.log(val)
      // val.forEach((v, index) => {
      //   switch (v.ele) {
      //     case 'input':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       this.createForm.createFormInputs.push(v.obj)
      //       break
      //     case 'select':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       this.createForm.createFormSelects.push(v.obj)
      //       break
      //     case 'radio':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       this.createForm.createFormRadios.push(v.obj)
      //       break
      //     case 'checkbox':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       this.createForm.createFormCheckboxs.push(v.obj)
      //       break
      //     case 'datepicker':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       this.createForm.createFormDatepickers.push(v.obj)
      //       break
      //     case 'cascader':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       // v.obj.oneLevelId = this.oneLevelId
      //       // v.obj.oneLevelName = this.oneLevelName
      //       // v.obj.twoLevelId = this.twoLevelId
      //       // v.obj.twoLevelName = this.twoLevelName
      //       this.createForm.createFormCascaders.push(v.obj)
      //       break
      //     case 'address':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       this.createForm.createFormAddress.push(v.obj)
      //       break
      //     case 'uploads':
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       v.obj.index = index++
      //       this.createForm.createFormUploads = v.obj
      //       break
      //     case 'text':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items) || '[]'
      //       this.createForm.createFormTexts.push(v.obj)
      //       break
      //     case 'hr':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items)
      //       this.createForm.createFormHrs.push(v.obj)
      //       break
      //     case 'title':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items) || '[]'
      //       this.createForm.createFormTitles = v.obj
      //       break
      //     case 'p':
      //       v.obj.index = index
      //       v.obj.items = JSON.stringify(v.obj.items) || '[]'
      //       this.createForm.createFormPS.push(v.obj)
      //       break
      //   }
      // })
    }
  },
  created() {
    console.log(this.template_form)
    // this.template_form = JSON.parse(localStorage.getItem('template_form') || '[]')
  }
}

</script>
