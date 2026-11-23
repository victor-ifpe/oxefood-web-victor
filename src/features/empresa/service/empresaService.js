import { api } from "../../../shared/services/api";

export const MAPPING_CONTROLLER_EMPRESA = '/api/empresa'

export async function saveLogo(idEmpresa, formData) {

    const response = await api.post(MAPPING_CONTROLLER_EMPRESA + "/" + idEmpresa, formData);
    return response.data;
}
