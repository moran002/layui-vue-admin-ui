import Http from '@/api/http';

export class UserService {
    // 删除
    static del(saveFrom: any) {
        return Http.delete('/system/user/update', saveFrom)
    }
    // 更新
    static update(saveFrom: any) {
        return Http.put('/system/user/update', saveFrom)
    }
    // 新增
    static create(saveFrom: any) {
        return Http.post('/system/user/create', saveFrom)
    }
    // 查询
    static list(queryFrom: any) {
        return Http.get('/system/user/list', queryFrom)
    }
}