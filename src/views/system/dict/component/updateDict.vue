<template>
  <lay-layer
      v-model="edit"
      :title="titleText"
      :area="['600px', '500px']"
      :shade="true"
      :shade-close="false"
      :resize="false"
      class="edit-layer"
  >
    <div class="form-container">
      <lay-json-schema-form
          :model="updateDict"
          :schema="schema"
          class="form"
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
import { layer } from "@layui/layui-vue";
import { DictService } from "@/api/system/dict";
import { reactive, ref, computed } from "vue";

const emits = defineEmits(['fetchData']);

// 表单状态
const edit = ref(false);
const title = ref(''); // 'add' or 'edit'
const updateDict = ref({
  id: '',
  name: '',
  type: '',
});

// 计算标题文本
const titleText = computed(() => title.value === 'add' ? '新增字典' : '编辑字典');

// 显示编辑表单
const showEdit = (row: any) => {
  edit.value = true;
  title.value = row ? 'edit' : 'add';
  updateDict.value = row ? JSON.parse(JSON.stringify(row)) : {
    id: '',
    name: '',
    type: '',
  };
};

// 取消编辑
const cancel = () => {
  edit.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  updateDict.value = {
    id: '',
    name: '',
    type: '',
  };
};

// 保存表单
const save = async () => {
  if (!updateDict.value.name) {
    layer.msg("请填写字典名称", { icon: 2, time: 2000 });
    return;
  }

  try {
    const serviceCall = updateDict.value.id
        ? DictService.update(updateDict.value)
        : DictService.create(updateDict.value);

    const res = await serviceCall;

    if (res.code === 200) {
      layer.msg(res.msg, { icon: 1, time: 1000 });
      edit.value = false;
      emits('fetchData');
      resetForm();
    }
  } catch (error) {
    layer.msg("操作失败，请重试", { icon: 2, time: 2000 });
  }
};

defineExpose({ showEdit });

// 表单配置
const schema = reactive({
  name: {
    label: '字典名称',
    type: 'input',
    required: true,
    props: {
      type: 'text',
      placeholder: '请输入字典名称',
      maxlength: 50,
      showWordLimit: true
    },
    rules: [
      { required: true, message: '角色名称不能为空' },
      { min: 2, max: 50, message: '长度在1到100个字符之间' }
    ],
    colProps: {
      span: 24
    }
  },
  type: {
    label: '字典类型',
    type: 'input',
    required: true,
    props: {
      type: 'text',
      placeholder: '请输入字典类型',
      maxlength: 50,
      showWordLimit: true
    },
    rules: [
      { required: true, message: '角色名称不能为空' },
      { min: 2, max: 50, message: '长度在1到100个字符之间' }
    ],
    colProps: {
      span: 24
    }
  },
});
</script>

<style scoped>
.edit-layer {
  display: flex;
  flex-direction: column;
}

.form-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.form::-webkit-scrollbar {
  width: 6px;
}

.form::-webkit-scrollbar-thumb {
  background-color: #e6e6e6;
  border-radius: 3px;
}

.form-actions {
  padding-top: 20px;
  border-top: 1px solid #f2f2f2;
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .form-container {
    padding: 15px;
  }

  .form-actions {
    padding-top: 15px;
  }
}
</style>