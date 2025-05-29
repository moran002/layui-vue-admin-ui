<template>
  <lay-layer
      v-model="password"
      title="重置密码"
      :area="['500px', '400px']"
      :shade="true"
      :shade-close="false"
      class="password-reset-layer"
  >
    <div class="password-reset-container">
      <lay-json-schema-form
          :model="passwordParams"
          :schema="passwordSchema"
          class="password-form"
      ></lay-json-schema-form>

      <div class="form-actions">
        <lay-space>
          <lay-button type="primary" size="lg" @click="save">
            <lay-icon type="ok"></lay-icon>
            提交
          </lay-button>
          <lay-button size="lg" @click="cancel">
            <lay-icon type="close"></lay-icon>
            取消
          </lay-button>
        </lay-space>
      </div>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { UserService } from "@/api/system/user";
import { layer } from "@layui/layui-vue";
import { reactive, ref } from "vue";

const showPassword = (row: any) => {
  passwordParams.value = {
    id: row.id,
    password: '',
    password2: ''
  };
  password.value = true;
};

const cancel = () => {
  password.value = false;
  resetForm();
};

const resetForm = () => {
  passwordParams.value = {
    id: '',
    password: '',
    password2: '',
  };
};

const save = () => {
  if (passwordParams.value.password !== passwordParams.value.password2) {
    layer.msg("两次输入的密码不一致", { icon: 2, time: 2000 });
    return;
  }

  if (passwordParams.value.password.length < 6) {
    layer.msg("密码长度不能少于6位", { icon: 2, time: 2000 });
    return;
  }

  UserService.password(passwordParams.value).then((res) => {
    if (res.code === 200) {
      layer.msg(res.msg, { icon: 1, time: 1000 });
      password.value = false;
      resetForm();
    }
  });
};

defineExpose({ showPassword });

const password = ref(false);
const passwordParams = ref({
  id: '',
  password: '',
  password2: '',
});

const passwordSchema = reactive({
  password: {
    label: '新密码',
    type: 'input',
    required: true,
    props: {
      type: 'password',
      placeholder: '请输入新密码(至少6位)',
      showPassword: true,
      autocomplete: 'new-password'
    },
    rules: [
      { min: 6, message: '密码长度不能少于6位' }
    ],
    colProps: {
      span: 24
    }
  },
  password2: {
    label: '确认密码',
    type: 'input',
    required: true,
    props: {
      type: 'password',
      placeholder: '请再次输入新密码',
      showPassword: true,
      autocomplete: 'new-password'
    },
    colProps: {
      span: 24
    }
  },
});
</script>

<style scoped>
.password-reset-layer {
  display: flex;
  flex-direction: column;
}

.password-reset-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.password-form {
  flex: 1;
}

.form-actions {
  padding-top: 20px;
  border-top: 1px solid #f2f2f2;
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .password-reset-container {
    padding: 15px;
  }

  .form-actions {
    padding-top: 15px;
  }
}
</style>