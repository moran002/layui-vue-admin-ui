import axios, { AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from "@/store/user";
import { layer } from '@layui/layui-vue';
import router from '../router'

type TAxiosOption = {
    timeout: number;
    baseURL: string;
}
 
const config: TAxiosOption = {
    timeout: 5000,
    baseURL: import.meta.env.VITE_API_URL
}
 
class Http {
    service;
    constructor(config: TAxiosOption) {
        this.service = axios.create(config)

        /* 请求拦截 */
        this.service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const userInfoStore = useUserStore();
            if (userInfoStore.token) {
                (config.headers as AxiosRequestHeaders).Authorization = userInfoStore.token as string
            } else {
                if(router.currentRoute.value.path!=='/login') {
                    router.push('/login');
                }
            }
            return config
        }, error => {
            return Promise.reject(error);
        })

        /* 响应拦截 */
        this.service.interceptors.response.use((response: AxiosResponse<any>) => {
            if (response.data.code <= 200) {
                return response.data;
            }else if (response.data.code >= 400 && response.data.code < 500) {
                layer.msg(
                    response.data.msg,
                    { icon : 2, time: 2000, yes: function(){
                            router.push('/login');
                            layer.closeAll()
                        }});
                router.push('/login');
                return Promise.reject(response.data.msg);
            }else {
                layer.msg(
                    response.data.msg,
                    { icon : 7, time: 1500});
                return response.data;
            }
        }, error => {
            return Promise.reject(error)
        })
    }

    /* GET 方法 */
    get<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.get(url, { params, ..._object })
    }
    /* POST 方法 */
    post<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.post(url, params, _object)
    }
    /* PUT 方法 */
    put<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.put(url, params, _object)
    }
    /* DELETE 方法 */
    delete<T>(url: string, params?: any, _object = {}): Promise<any> {
        return this.service.delete(url, { params, ..._object })
    }
}

export default new Http(config)