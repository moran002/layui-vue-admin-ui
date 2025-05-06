
// 新增或更新
import {ref, reactive} from "vue";

export const password = ref(false);
export const passwordParams = ref({
    id: '',
    password: '',
    password2: '',
})

export const passwordSchema = reactive({
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