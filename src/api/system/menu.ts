import Http from "@/api/http";

export class MenuService {
    // 删除
    static del(id: string) {
        return Http.delete('/system/menu/del?id=' + id, )
    }
    // 更新
    static update(saveFrom: any) {
        return Http.post('/system/menu/update', saveFrom)
    }
    // 新增
    static create(saveFrom: any) {
        return Http.post('/system/menu/create', saveFrom)
    }
    // 菜单字典
    static list() {
        return Http.get('/system/menu/list')
    }
    // 菜单字典
    static simpleList() {
        return Http.get('/system/menu/simple-list')
    }
}