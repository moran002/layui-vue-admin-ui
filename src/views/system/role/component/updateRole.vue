<template>
  <lay-layer v-model="edit" :title="title" :area="['70%', '90%']">
    <lay-json-schema-form :model="updateRole" :schema="schema" ></lay-json-schema-form>
    <div style="width: 100%; text-align: center">
      <lay-button type="primary"  @click="save">提交</lay-button>
      <lay-button size="sm" @click="cancel">取消</lay-button>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">

import {layer} from "@layui/layui-vue";
import {RoleService} from "@/api/system/role";
import {reactive, ref} from "vue";

const emits = defineEmits(['fetchData']);
const showEdit = (row: any) => {
  edit.value = true;
  if (!row) {
    title.value = '添加'
  }else {
    title.value = '编辑'
    updateRole.value = JSON.parse(JSON.stringify(row))
  }
}

const cancel = () => {
  title.value = '';
  edit.value = false;
  updateRole.value = {
    id: '',
    name: '',
    remark: '',
  }
}
const save = () => {
  if (updateRole.value.id) {
    RoleService.update(updateRole.value).then((res) => {
      edit.value = false;
      if (res.code === 200) {
        layer.msg(res.msg, {icon: 1, time: 1000})
        emits('fetchData')
      }
    })
  }else {
    RoleService.create(updateRole.value).then((res) => {
      edit.value = false;
      if (res.code === 200) {
        layer.msg(res.msg, {icon: 1, time: 1000})
        emits('fetchData')
      }
    })
  }
}

defineExpose({showEdit})

const edit = ref(false);
const title = ref("")

const updateRole= ref({
  id: '',
  name: '',
  remark: '',
})

const schema = reactive({
  name: {
    label: '角色名称',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入角色名称',
    }
  },
  remark: {
    label: '描述',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入描述',
    }
  },
})
</script>

<style scoped>

</style>