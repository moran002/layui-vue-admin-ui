<template>
  <lay-layer v-model="update" :title="title" :area="['70%', '100%']">
    <div style="width: 100%; text-align: center">
      <lay-json-schema-form :model="updateParams" :schema="updateSchema" ></lay-json-schema-form>
      <lay-button type="primary" @click="save">提交</lay-button>
      <lay-button size="sm" @click="cancel">取消</lay-button>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">

import {update, title, options, updateSchema, updateParams} from "@/views/system/user/model/updateUser";
import {RoleService} from "@/api/system/role";
import {UserService} from "@/api/system/user";
import {layer} from "@layui/layui-vue";

const showEdit = (row: any) => {
  update.value = true;
  findRoles();
  if (!row) {
    title.value = '添加'
  } else {
    title.value = '编辑'
    updateParams.value = JSON.parse(JSON.stringify(row))
  }
}

const findRoles = async () => {
  const res = await RoleService.simpleList();
  options.value = res.data;
}

const cancel = async () => {
  title.value = '';
  update.value = false;
  updateParams.value = {
    id: '',
    account: '',
    nickName: '',
    email: '',
    mobile: '',
    roleIds: [],
  }
}

const save = () => {
  if (updateParams.value.id) {
    UserService.update(updateSchema).then((res) => {
      layer.msg(res.msg, {icon: 1, time: 1000})
      update.value = false;
      emit('success')
    })
  }else {
    UserService.create(updateSchema).then((res) => {
      layer.msg(res.msg, {icon: 1, time: 1000})
      update.value = false;
      emit('success')
    })
  }
}

const emit = defineEmits(['success']);
defineExpose({showEdit})
</script>

<style scoped>

</style>