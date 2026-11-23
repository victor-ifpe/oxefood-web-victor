import { api } from "../../../shared/services/api";

export const MAPPING_CONTROLLER_PRODUTO = '/api/produto'

export async function filtrar(param) {

    const response = await api.post(MAPPING_CONTROLLER_PRODUTO + "/filtrar", param);
    return response.data;
}