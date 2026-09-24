import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../../../shared/components/BackButton";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import SaveButton from "../../../shared/components/SaveButton";
import { atualizar, buscarPorId, cadastrar } from "../../../shared/services/crudService";
import { MAPPING_CONTROLLER_EMPRESA } from "../service/empresaService";

export default function EmpresaForm() {

    const { idEmpresa } = useParams();
    const [empresa, setEmpresa] = useState({
        id: null,
        site: "",
        cnpj: "",
        inscricaoEstadual: "",
        nomeEmpresarial: "",
        nomeFantasia: "",
        fone: "",
        foneAlternativo: "",
    });

    useEffect(() => {
        if (idEmpresa) {
            carregarEmpresa();
        }
    }, [idEmpresa]);

    async function carregarEmpresa() {
        try {
            const data = await buscarPorId(
                MAPPING_CONTROLLER_EMPRESA,
                idEmpresa
            );
            setEmpresa({
                id: data.id,
                site: data.site ?? "",
                cnpj: data.cnpj ?? "",
                inscricaoEstadual: data.inscricaoEstadual ?? "",
                nomeEmpresarial: data.nomeEmpresarial ?? "",
                nomeFantasia: data.nomeFantasia ?? "",
                fone: data.fone ?? "",
                foneAlternativo: data.foneAlternativo ?? "",
            });
        } catch (erro) {
            toast.error("Erro ao carregar Empresa.");
        }
    }

    async function salvar() {
        try {
            if (idEmpresa) {
                await atualizar(MAPPING_CONTROLLER_EMPRESA, empresa);
                toast.success("Empresa alterada com sucesso!");
            } else {
                await cadastrar(MAPPING_CONTROLLER_EMPRESA, empresa);
                toast.success("Empresa cadastrada com sucesso!");
            }
        } catch (erro) {
            toast.error("Erro ao salvar empresa.");
        }
    }

    return (
        <div>
            <Menu />

            {idEmpresa ?
                <Breadcrumbs items={[
                    { label: "Empresa" },
                    { label: "Alterar" }
                ]} />
                :
                <Breadcrumbs items={[
                    { label: "Empresa" },
                    { label: "Cadastrar" }
                ]} />
            }

            <div style={{ marginTop: "40px", marginLeft: "10%", marginRight: "10%", }} >
                <div className="overflow-x-auto shadow-sm">

                    <div className="flex items-center justify-between mb-6" style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px", }}>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {idEmpresa ? "Alterar Empresa" : "Nova Empresa"}
                        </h1>
                    </div>

                    <div className="divider divider-info" />

                    <div className="overflow-x-auto" style={{ padding: "30px" }}>
                        <form onSubmit={salvar}>

                            {/* Nome Empresarial */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Nome Empresarial
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite o nome empresarial"
                                    className="input input-bordered w-full"
                                    value={empresa.nomeEmpresarial}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, nomeEmpresarial: e.target.value, })
                                    }
                                />
                            </div>

                            {/* Nome Fantasia */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Nome Fantasia
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite o nome fantasia"
                                    className="input input-bordered w-full"
                                    value={empresa.nomeFantasia}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, nomeFantasia: e.target.value, })
                                    }
                                />
                            </div>

                            {/* CNPJ */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    CNPJ
                                </label>
                                <IMaskInput
                                    mask="00.000.000/0000-00"
                                    placeholder="00.000.000/0000-00"
                                    className="input input-bordered w-full"
                                    value={empresa.cnpj}
                                    onAccept={(value) =>
                                        setEmpresa({ ...empresa, cnpj: value, })
                                    }
                                />
                            </div>

                            {/* Inscrição Estadual */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Inscrição Estadual
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite a inscrição estadual"
                                    className="input input-bordered w-full"
                                    value={empresa.inscricaoEstadual}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, inscricaoEstadual: e.target.value, })
                                    }
                                />
                            </div>

                            {/* Telefone */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Telefone
                                </label>
                                <IMaskInput
                                    mask="(00) 0 0000-0000"
                                    placeholder="(00) 0 0000-0000"
                                    className="input input-bordered w-full"
                                    value={empresa.fone}
                                    onAccept={(value) =>
                                        setEmpresa({ ...empresa, fone: value, })
                                    }
                                />
                            </div>

                            {/* Telefone Alternativo */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Telefone Alternativo
                                </label>
                                <IMaskInput
                                    mask="(00) 0 0000-0000"
                                    placeholder="(00) 0 0000-0000"
                                    className="input input-bordered w-full"
                                    value={empresa.foneAlternativo}
                                    onAccept={(value) =>
                                        setEmpresa({ ...empresa, foneAlternativo: value, })
                                    }
                                />
                            </div>

                            {/* Site */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Site
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite o site da empresa"
                                    className="input input-bordered w-full"
                                    value={empresa.site}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, site: e.target.value, })
                                    }
                                />
                            </div>

                            {/* Botões */}
                            <div className="flex justify-between mt-10">
                                <BackButton destino="/empresa" />
                                <SaveButton save={salvar} />
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}