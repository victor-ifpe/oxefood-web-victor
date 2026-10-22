import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BackButton from "../../../shared/components/BackButton";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import SaveButton from "../../../shared/components/SaveButton";

import {
    listar,
    cadastrar,
    atualizar,
} from "../../../shared/services/crudService";

import { MAPPING_CONTROLLER_CLIENTE } from "../../cliente/service/clienteService";
import { MAPPING_CONTROLLER_ENDERECO_CLIENTE } from "../service/enderecoClienteService";

export default function EnderecoClienteForm() {
    const { clienteId, enderecoId } = useParams();
    const navigate = useNavigate();

    const [listaCliente, setListaCliente] = useState([]);

    const [idClienteSelecionado, setIdClienteSelecionado] = useState(
        clienteId ?? ""
    );

    const [endereco, setEndereco] = useState({
        rua: "",
        numero: "",
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
        complemento: "",
    });

    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarClientes();
    }, []);

    async function carregarClientes() {
        try {
            const data = await listar(MAPPING_CONTROLLER_CLIENTE);
            const clientes = data ?? [];

            setListaCliente(clientes);

            if (enderecoId) {
                let enderecoEncontrado = null;
                let clienteEncontrado = null;

                for (const cliente of clientes) {
                    const encontrado = (cliente.enderecos ?? []).find(
                        (item) => String(item.id) === String(enderecoId)
                    );

                    if (encontrado) {
                        enderecoEncontrado = encontrado;
                        clienteEncontrado = cliente;
                        break;
                    }
                }

                if (!enderecoEncontrado) {
                    toast.error("Endereço não encontrado.");
                    navigate("/endereco-cliente");
                    return;
                }

                setIdClienteSelecionado(String(clienteEncontrado.id));

                setEndereco({
                    rua: enderecoEncontrado.rua ?? "",
                    numero: enderecoEncontrado.numero ?? "",
                    bairro: enderecoEncontrado.bairro ?? "",
                    cep: enderecoEncontrado.cep ?? "",
                    cidade: enderecoEncontrado.cidade ?? "",
                    estado: enderecoEncontrado.estado ?? "",
                    complemento: enderecoEncontrado.complemento ?? "",
                });
            }
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao carregar os clientes e endereços.");
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setEndereco((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    async function salvar(e) {
        e?.preventDefault();

        if (!idClienteSelecionado) {
            toast.error("Selecione um cliente.");
            return;
        }

        if (
            !endereco.rua.trim() ||
            !endereco.numero.trim() ||
            !endereco.bairro.trim() ||
            !endereco.cep.trim() ||
            !endereco.cidade.trim() ||
            !endereco.estado.trim()
        ) {
            toast.error("Preencha todos os campos obrigatórios.");
            return;
        }

        const dadosEndereco = {
            rua: endereco.rua.trim(),
            numero: endereco.numero.trim(),
            bairro: endereco.bairro.trim(),
            cep: endereco.cep.trim(),
            cidade: endereco.cidade.trim(),
            estado: endereco.estado.trim().toUpperCase(),
            complemento: endereco.complemento.trim(),
        };

        try {
            setCarregando(true);

            if (enderecoId) {
                await atualizar(
                    `${MAPPING_CONTROLLER_ENDERECO_CLIENTE}/${enderecoId}`,
                    { ...dadosEndereco, id: Number(enderecoId) }
                );

                toast.success("Endereço alterado com sucesso!");
            } else {
                await cadastrar(
                    `${MAPPING_CONTROLLER_ENDERECO_CLIENTE}/${idClienteSelecionado}`,
                    dadosEndereco
                );

                toast.success("Endereço cadastrado com sucesso!");
            }

            navigate("/endereco-cliente");
        } catch (erro) {
            console.error(
                "Erro ao salvar endereço:",
                erro.response?.data ?? erro
            );

            toast.error(
                erro.response?.data?.message || "Erro ao salvar o endereço."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div>
            <Menu />

            <Breadcrumbs
                items={[
                    { label: "Endereço do Cliente" },
                    { label: enderecoId ? "Alterar" : "Cadastrar" },
                ]}
            />

            <div
                style={{
                    marginTop: "40px",
                    marginLeft: "10%",
                    marginRight: "10%",
                }}
            >
                <div className="overflow-x-auto shadow-sm">
                    <div
                        className="flex items-center justify-between mb-6"
                        style={{
                            marginTop: "20px",
                            marginLeft: "10px",
                            marginRight: "10px",
                        }}
                    >
                        <h1 className="text-3xl font-bold text-gray-800">
                            {enderecoId ? "Alterar Endereço" : "Novo Endereço"}
                        </h1>
                    </div>

                    <div className="divider divider-info" />

                    <div className="overflow-x-auto" style={{ padding: "30px" }}>
                        <form onSubmit={salvar}>
                            {/* Cliente */}
                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <legend className="fieldset-legend">
                                            Cliente
                                        </legend>

                                        <select
                                            className="select w-full"
                                            value={idClienteSelecionado}
                                            onChange={(e) =>
                                                setIdClienteSelecionado(e.target.value)
                                            }
                                            disabled={Boolean(enderecoId)}
                                            required
                                        >
                                            <option value="">Selecione um cliente...</option>

                                            {listaCliente.map((cliente) => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </fieldset>
                                </div>
                            </div>

                            {/* Rua e número */}
                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label className="fieldset-legend" htmlFor="rua">
                                            Rua
                                        </label>

                                        <input
                                            id="rua"
                                            name="rua"
                                            type="text"
                                            placeholder="Ex.: Rua das Flores"
                                            className="input input-bordered w-full"
                                            value={endereco.rua}
                                            onChange={handleChange}
                                            required
                                        />
                                    </fieldset>
                                </div>

                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label className="fieldset-legend" htmlFor="numero">
                                            Número
                                        </label>

                                        <input
                                            id="numero"
                                            name="numero"
                                            type="text"
                                            placeholder="Ex.: 123"
                                            className="input input-bordered w-full"
                                            value={endereco.numero}
                                            onChange={handleChange}
                                            required
                                        />
                                    </fieldset>
                                </div>
                            </div>

                            {/* Bairro e CEP */}
                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label className="fieldset-legend" htmlFor="bairro">
                                            Bairro
                                        </label>

                                        <input
                                            id="bairro"
                                            name="bairro"
                                            type="text"
                                            placeholder="Ex.: Boa Viagem"
                                            className="input input-bordered w-full"
                                            value={endereco.bairro}
                                            onChange={handleChange}
                                            required
                                        />
                                    </fieldset>
                                </div>

                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label className="fieldset-legend" htmlFor="cep">
                                            CEP
                                        </label>

                                        <input
                                            id="cep"
                                            name="cep"
                                            type="text"
                                            placeholder="00000-000"
                                            className="input input-bordered w-full"
                                            value={endereco.cep}
                                            onChange={handleChange}
                                            required
                                        />
                                    </fieldset>
                                </div>
                            </div>

                            {/* Cidade e estado */}
                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label className="fieldset-legend" htmlFor="cidade">
                                            Cidade
                                        </label>

                                        <input
                                            id="cidade"
                                            name="cidade"
                                            type="text"
                                            placeholder="Ex.: Recife"
                                            className="input input-bordered w-full"
                                            value={endereco.cidade}
                                            onChange={handleChange}
                                            required
                                        />
                                    </fieldset>
                                </div>

                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label className="fieldset-legend" htmlFor="estado">
                                            Estado (UF)
                                        </label>

                                        <input
                                            id="estado"
                                            name="estado"
                                            type="text"
                                            maxLength={2}
                                            placeholder="PE"
                                            className="input input-bordered w-full"
                                            value={endereco.estado}
                                            onChange={handleChange}
                                            required
                                        />
                                    </fieldset>
                                </div>
                            </div>

                            {/* Complemento */}
                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label
                                            className="fieldset-legend"
                                            htmlFor="complemento"
                                        >
                                            Complemento
                                        </label>

                                        <input
                                            id="complemento"
                                            name="complemento"
                                            type="text"
                                            placeholder="Ex.: Apartamento 202, bloco A"
                                            className="input input-bordered w-full"
                                            value={endereco.complemento}
                                            onChange={handleChange}
                                        />
                                    </fieldset>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <div style={{ marginTop: "50px", textAlign: "left" }}>
                                        <BackButton destino="/endereco-cliente" />
                                    </div>
                                </div>

                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <div style={{ marginTop: "50px", textAlign: "right" }}>
                                        <SaveButton save={salvar} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}