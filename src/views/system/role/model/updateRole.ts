import {reactive, ref} from "vue";


export const edit = ref(false);
export const title = ref("")

export const updateRole= ref({
    id: '',
    name: '',
    remark: '',
})

export const schema = reactive({
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