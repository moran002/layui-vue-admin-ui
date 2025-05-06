import Http from '@/api/http';

export class UserService {
    // 删除
    static del(id: string) {
        return Http.delete('/system/user/del?id=' + id, )
    }
    // 状态
    static status(saveFrom: any) {
        return Http.post('/system/user/status', saveFrom)
    }
    // 重置密码
    static password(saveFrom: any) {
        return Http.post('/system/user/password', saveFrom)
    }
    // 更新
    static update(saveFrom: any) {
        return Http.post('/system/user/update', saveFrom)
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