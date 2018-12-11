<template>
  <div>
    <el-button type="primary" @click="save">保存</el-button>
    <el-tree
      :data="treeFolder"
      node-key="id"
      ref="tree"
      default-expand-all
      highlight-current
      :expand-on-click-node='false'
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
  import { treeFolderPermission, treeFolder } from '@/api/folder'
  import { moveFile } from '@/api/file'
  let _treeFolder
  export default {
    name: 'file',
    components: {
    },
    props: {
      folder: {
        type: Object,
        required: true,
        default: { id: '', label: '' }
      },
      fileIds: {
        type: String,
        required: true
      }
    },
    data() {
      _treeFolder = this.$store.getters.name === 'admin' ? treeFolder : treeFolderPermission
      return {
        multipleSelection: [],
        treeFolder: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      this.fetchTreeData()
    },
    methods: {
      fetchTreeData() {
        _treeFolder().then(resp => {
          this.treeFolder = resp.data.data
        })
      },
      save() {
        const node = this.$refs['tree'].getCurrentNode()
        if (!node) {
          this.$message({
            type: 'warning',
            message: '请选择要移动到的文件夹！'
          })
        }
        if (node.id === this.folder.id) {
          this.$message({
            type: 'warning',
            message: '该文件已在当前文件夹中！'
          })
        } else {
          moveFile(this.fileIds, node.id).then(resp => {
            this.$message({
              type: 'success',
              message: resp.data.message,
              onClose: () => {
                this.$emit('closeDialog', 'move')
              }
            })
          })
        }
      }
    }
  }
</script>

