import { api } from "../../../shared/services/api";

export const MAPPING_CONTROLLER_PRODUTO = '/api/produto'

export async function filtrar(param) {

    const response = await api.post(MAPPING_CONTROLLER_PRODUTO + "/filtrar", param);
    return response.data;
}

export async function saveImage(idProduto, formData) {

    const response = await api.post(MAPPING_CONTROLLER_PRODUTO + "/" + idProduto, formData);
    return response.data;
}
