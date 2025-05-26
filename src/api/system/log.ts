import Http from "@/api/http";

export class LogService {
    // 查询
    static list(queryFrom: any) {
        return Http.get('/system/log/list', queryFrom)
    }
}

