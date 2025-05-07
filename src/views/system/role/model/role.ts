import { ref} from "vue";

export const columns =  [
    {title: '编号', width: '80px', key: 'id', fixed: 'left'},
    {title: '角色名称', width: '80px', key: 'name'},
    {title: '备注', width: '260px', key: 'remark'},
    {title: '创建时间', width: '120px', key: 'createTime'},
    {
        title: '操作',
        width: '150px',
        customSlot: 'operator',
        key: 'operator',
        fixed: 'right'
    }
]

export const loading = ref(true);

export const permissionMenu = ref(false);
export const list = ref([])
export const menus = ref([])

export const queryRole = ref({
    pageNo: 1,
    pageSize: 10,
    total: '',
    roleName: '',
    remark: '',
})