import { AxiosRequestConfig } from 'axios'

export interface EndpointOptions {
    endpoint: string;
    accountid?: string;
    host?: string;
    alidomain?: boolean;
};

export class HttpBase {
    constructor(endpointOpts: string | EndpointOptions);
    get version(): string;
    get accessKey(): string;
    get requireSignature(): boolean;
    buildHeaders(headers: any): any;
    request<T = any, R = AxiosResponse<T>> (method: string, path, string, axiosConfig: AxiosRequestConfig): Promise<R>;
    get(url: string, config: AxiosRequestConfig): any;
    delete(url: any, config: AxiosRequestConfig): any;
    post(url: any, data: any, config: AxiosRequestConfig): any;
    put(url: any, data: any, config: AxiosRequestConfig): any;
}
export class HttpFunc extends HttpBase {
    constructor(accessKey: string, accessKeySecret: string, endpointOpts: EndpointOptions);
}
