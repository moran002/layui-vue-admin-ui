import {ref} from "vue";

export const loading = ref(true);
export const list = ref([]);

export const columns = [
    {title: '主键', key: 'id', width: 70,  align: 'center'},
    {title: '菜单名称', key: 'title', customSlot: 'title', width: 200},
    {title: '路由地址', key: 'path',  align: 'center'},
    {title: '组件路径', key: 'component',  align: 'center'},
    {title: '排序', width: '70px', key: 'sort',  align: 'center'},
    {title: '可见', key: 'isShow', customSlot: 'isShow',  align: 'center'},
    {title: '类型', key: 'type', customSlot: 'type',  align: 'center'},
    {title: 'api', key: 'api',  align: 'center'},
    {title: '创建时间', key: 'createTime',  align: 'center'},
    {title: '操作', key: 'option', customSlot: 'option',  align: 'center'}
]