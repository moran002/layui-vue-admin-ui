import Http from "@/api/http";

export class RoleService {
    // 删除
    static del(id: string) {
        return Http.delete('/system/role/del?id=' + id, )
    }
    // 状态
    static permission(saveFrom: any) {
        return Http.post('/system/role/permission', saveFrom)
    }
    // 更新
    static update(saveFrom: any) {
        return Http.post('/system/role/update', saveFrom)
    }
    // 新增
    static create(saveFrom: any) {
        return Http.post('/system/role/create', saveFrom)
    }
    // 查询
    static list(queryFrom: any) {
        return Http.get('/system/role/list', queryFrom)
    }
    // 获取角色字典
    static simpleList() {
        return Http.get('/system/role/simple-list')
    }
}