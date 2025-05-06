import {reactive, ref} from "vue";

// 查询
export const isExpand = ref(false)
export const queryForm = ref({
    pageNo: 1,
    pageSize: 10,
    account: '',
    nickName: '',
    mobile: '',
})

export const statusUser = ref({
    id: '',
    status: '',
})

// 列表
export const loading = ref(false);
export const list = ref([])
export const page = ref({
    page: 1,
    pageSize: 10,
    total: '',
    layout: ['count', 'prev', 'page', 'next', 'limits', 'refresh', 'skip'],
})

export const columns =  ref([
    {title: '编号', width: '80px', key: 'id', fixed: 'left', align: 'center'},
    {title: '姓名', width: '80px', key: 'nickName', align: 'center'},
    // {title: '头像', width: '50px', key: 'avatar', align: 'center', customSlot: 'avatar'},
    {title: '手机号', width: '90px', key: 'mobile', align: 'center'},
    {title: '邮箱', width: '120px', key: 'email', align: 'center'},
    {title: '状态', width: '80px', key: 'status', align: 'center', customSlot: 'status'},
    {title: '签名', width: '260px', key: 'remark'},
    {title: '时间', width: '120px', key: 'createTime', align: 'center'},
    {
        title: '操作',
        width: '120px',
        customSlot: 'operator',
        key: 'operator',
        fixed: 'right'
    }
])

