
// 新增或更新
import {ref, reactive} from "vue";

export const update = ref(false);
export const title = ref("");
export const updateParams = ref({
    id: '',
    account: '',
    nickName: '',
    email: '',
    mobile: '',
    roleIds: [],
})
export const options = ref({
    label: '',
    value: '',
})
export const updateSchema = reactive({
    account: {
        label: '账号',
        type: 'input',
        props: {
            type: 'text',
            placeholder: '请输入账号',
        },
        colProps: {
            md: 15,
            align: 'center',
        }
    },
    nickName: {
        label: '昵称',
        type: 'input',
        props: {
            type: 'text',
            placeholder: '请输入昵称',
            required: true,
        },
        colProps: {
            md: 15
        }
    },
    mobile: {
        label: '手机号',
        type: 'input',
        props: {
            type: 'text',
            placeholder: '请输入手机号',
        },
        colProps: {
            md: 15
        }
    },
    email: {
        label: '邮箱',
        type: 'input',
        props: {
            type: 'text',
            placeholder: '请输入邮箱',
        },
        colProps: {
            md: 15,
            textAlign: 'center'
        }
    },
    remark: {
        label: '备注',
        type: 'textarea',
        props: {
            placeholder: '请输入备注',
        },
        colProps: {
            md: 15,
        }
    },
    roleIds: {
        label: '角色',
        type: 'select',
        props: {
            multiple: true,
            options: options,
        }
    },
})