import {reactive, ref} from "vue";

export const edit = ref(false);
export const title = ref('');
export const updateMenu = ref({
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
})

export const schema = reactive({
    parentId: {
        label: 'parentId',
        type: 'input',
        props: {
            type: 'text',
        }
    },
    title: {
        label: '菜单名称',
        type: 'input',
        props: {
            type: 'text',
        }
    },
    path: {
        label: '路由路径',
        type: 'input',
        props: {
            type: 'text',
        }
    },
    component: {
        label: '组件路径',
        type: 'input',
        props: {
            type: 'text',
        }
    },
    api: {
        label: 'api',
        type: 'input',
        props: {
            type: 'text',
        }
    },
    icon: {
        label: '图标',
        type: 'input',
        props: {
            type: 'text',
        }
    },
    sort: {
        label: '排序',
        type: 'input',
        props: {
            type: 'text',
        }
    },
    isShow: {
        label: '是否显示',
        type: 'switch',
        props: {
        }
    },
    type: {
        label: '类型',
        type: 'radio',
        props: {
            options: [
                {
                    label: "菜单",
                    value: 1,
                },
                {
                    label: "按钮",
                    value: 2,
                },
            ]
        }
    },


})