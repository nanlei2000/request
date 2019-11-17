import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

export interface SuccessRes<T extends any> {
    msg: string;
    code: number;
    data: T;
}
export interface ErrorRes {
    msg: string;
    code: number;
}
// https://api.github.com/repos/vuejs/vue
// 创建axios实例
const BaseURL = 'https://api-wapbi.oneniceapp.com';
const instance = axios.create({
    baseURL: BaseURL
    // timeout: 5000 // 请求超时时间
});
// request拦截器
instance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        // 请求错误
        return Promise.reject({
            msg: (
                typeof error === 'object' ?
                    (error.message) :
                    String(error)
            )
                || '请求错误',
            code: -1,
        });
    }
);

// response 拦截器
instance.interceptors.response.use(
    response => {
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */

        const res: SuccessRes<any> = response.data;
        if (res.code !== 200) {
            return Promise.reject(res);
        } else {
            return response.data;
        }
    },
    // 响应错误
    (error: Error) => {
        return Promise.reject({
            msg: (
                typeof error === 'object' ?
                    (error.message) :
                    String(error)
            )
                || '响应错误',
            code: -2,
        });
    }
);

export function request(options: AxiosRequestConfig): Promise<any> {
    const defaultConfig: AxiosRequestConfig = {
        // url: options.url,
        method: 'post',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    return instance(
        {
            ...defaultConfig,
            ...options,
            ...{
                // 原始的axios post的data形式为requestPayload 经过qs转换后才能被后端接收
                data: qs.stringify(options.data, { indices: false })
            }
        }
    );
}