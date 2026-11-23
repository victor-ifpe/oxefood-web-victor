import { api } from "../../../shared/services/api";

export const MAPPING_CONTROLLER_CLIENTE = '/api/cliente'

export async function filtrar(param) {

    const response = await api.post(MAPPING_CONTROLLER_CLIENTE + "/filtrar", param);
    return response.data;
}
