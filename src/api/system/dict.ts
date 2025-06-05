import Http from "@/api/http";

export class DictService {
    // 删除
    static delData(id: string) {
        return Http.delete('/system/dict/delData?id=' + id, )
    }
    // 更新
    static updateData(saveFrom: any) {
        return Http.post('/system/dict/updateData', saveFrom)
    }
    // 新增
    static createData(saveFrom: any) {
        return Http.post('/system/dict/createData', saveFrom)
    }
    // 查询
    static dataList(queryFrom: any) {
        return Http.get('/system/dict/dataList', queryFrom)
    }
    // 删除
    static del(id: string) {
        return Http.delete('/system/dict/del?id=' + id, )
    }
    // 更新
    static update(saveFrom: any) {
        return Http.post('/system/dict/update', saveFrom)
    }
    // 新增
    static create(saveFrom: any) {
        return Http.post('/system/dict/create', saveFrom)
    }
    // 查询
    static list(queryFrom: any) {
        return Http.get('/system/dict/list', queryFrom)
    }
}