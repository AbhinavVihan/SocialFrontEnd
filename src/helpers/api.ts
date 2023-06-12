import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { call, put } from "redux-saga/effects";

// export const BASE_URL = "https://social-backend-1amu.onrender.com";
export const BASE_URL = "http://localhost:3001";

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

export function* callApi<T = any>(
  appendToUrl: string,
  method: string,
  headers: any = {},
  data?: any
): Generator<any, T, ApiResponse<T>> {
  try {
    const url = `http://localhost:3000/${appendToUrl}`;

    const response = yield call(() =>
      axios({
        url,
        method,
        data,
        headers,
      })
    );

    // Dispatch a success action with the response data
    yield put({ type: `${method}_SUCCESS`, payload: response.data });

    return response.data;
  } catch (error: any) {
    // Dispatch a failure action with the error message
    yield put({ type: `${method}_FAILURE`, payload: error.message });

    throw new Error(error.message);
  }
}
