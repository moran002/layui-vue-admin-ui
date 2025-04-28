import Http from "@/api/http";

export class RoleService {
    // 获取角色字典
    static simpleList() {
        return Http.get('/system/role/simple-list')
    }
}