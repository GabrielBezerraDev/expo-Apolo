import axios, { AxiosResponse } from 'axios'
import { Alert } from 'react-native';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
    timeout: 10000,
})

const controller = new AbortController()


export async function getAxios<T>(path: string): Promise<AxiosResponse<T, any>> {
    return await api.get<T>(path);
}

export async function postAxios<T,U extends object>(path: string, body: U): Promise<AxiosResponse<T, any>> {
    return await api.post<T>(path, body);
}

export async function patchAxios<T,U extends object>(path: string, body: U): Promise<AxiosResponse<T, any>>{
    return await api.patch<T>(path);
}

export async function deleteAxios<T>(path: string): Promise<AxiosResponse<T, any>> {
    return await api.patch<T>(path);
}




