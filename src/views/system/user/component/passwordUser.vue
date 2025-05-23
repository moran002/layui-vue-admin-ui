<template>
  <lay-layer v-model="password" title="重置密码" :area="['70%', '100%']">
    <lay-json-schema-form :model="passwordParams" :schema="passwordSchema" required></lay-json-schema-form>
    <div style="width: 100%; text-align: center">
      <lay-button type="primary" @click="save">提交</lay-button>
      <lay-button size="sm" @click="cancel">取消</lay-button>
    </div>
  </lay-layer>
</template>


<script setup lang="ts">
import {UserService} from "@/api/system/user";
import {layer} from "@layui/layui-vue";
import {reactive, ref} from "vue";

const showPassword = (row: any) => {
  passwordParams.value = JSON.parse(JSON.stringify(row))
  password.value = true;
}
const cancel = async () => {
  password.value = false;
  passwordParams.value = {
    id: '',
    password: '',
    password2: '',
  }
}
const save = () => {
  UserService.password(passwordParams.value).then((res) => {
    password.value = false;
    if (res.code === 200) {
      layer.msg(res.msg, {icon: 1, time: 1000})
    }
  })
}
defineExpose({showPassword})

const password = ref(false);
const passwordParams = ref({
  id: '',
  password: '',
  password2: '',
})

const passwordSchema = reactive({
  password: {
    label: '新密码',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入新密码',
    },
    colProps: {
      md: 20,
    }
  },
  password2: {
    label: '确认密码',
    type: 'input',
    props: {
      type: 'text',
      placeholder: '请输入新密码',
    },
    colProps: {
      md: 20
    }
  },
})
</script>

<style scoped>

</style>