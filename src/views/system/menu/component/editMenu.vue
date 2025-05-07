<template>
  <lay-layer v-model="edit" :title="title" :area="['70%', '90%']">
    <lay-json-schema-form :model="updateMenu" :schema="schema" ></lay-json-schema-form>
    <div style="width: 100%; text-align: center">
      <lay-button type="primary"  @click="save">提交</lay-button>
      <lay-button size="sm" @click="cancel">取消</lay-button>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import {layer} from "@layui/layui-vue";
import {edit, title, updateMenu, schema} from "@/views/system/menu/model/updateMenu"
import {MenuService} from "@/api/system/menu";

const showEdit = async (type:number, row: any) => {
  edit.value = true;
  if (type === 0) {
    title.value = "新增";
  }else if (type === 1) {
    title.value = "新增";
    updateMenu.value.parentId = row.id
  }else {
    title.value = "编辑";
    updateMenu.value = JSON.parse(JSON.stringify(row));
  }
}

const cancel = async () => {
  updateMenu.value = {
    id: '',
    parentId: '',
    title: '',
    type: 1,
    sort: 0,
    icon: '',
    path: '',
    component: '',
    isShow: true,
    api: '',
  };
  title.value = '';
  edit.value = false;
}

const emit = defineEmits(['fetchData']);
const save = () => {
  if (updateMenu.value.id) {
    MenuService.update(updateMenu.value).then(({code, msg}) => {
      if (code === 200) {
        layer.msg('保存成功！', {icon: 1, time: 1000})
        cancel();
        edit.value = false;
        emit('fetchData');
      } else {
        layer.msg(msg, {icon: 2, time: 1000})
      }
    });
  }else {
    MenuService.create(updateMenu.value).then(({code, msg}) => {
      if (code === 200) {
        layer.msg('保存成功！', {icon: 1, time: 1000})
        cancel();
        edit.value = false;
        emit('fetchData');
      } else {
        layer.msg(msg, {icon: 2, time: 1000})
      }
    });
  }

}

defineExpose({showEdit});
</script>

<style scoped>

</style>