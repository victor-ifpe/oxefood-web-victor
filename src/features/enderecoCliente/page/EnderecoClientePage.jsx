import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import CrudActions from "../../../shared/components/CrudActions";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import NewButton from "../../../shared/components/NewButton";

import {
    listar,
    remover,
} from "../../../shared/services/crudService";

import { MAPPING_CONTROLLER_CLIENTE } from "../../cliente/service/clienteService";
import { MAPPING_CONTROLLER_ENDERECO_CLIENTE } from "../service/enderecoClienteService";

export default function EnderecoClientePage() {
    const [lista, setLista] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [enderecoDetalhe, setEnderecoDetalhe] = useState({
        clienteNome: "",
        rua: "",
        numero: "",
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
        complemento: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        try {
            setCarregando(true);

            const clientes = await listar(MAPPING_CONTROLLER_CLIENTE);

            const enderecos = (clientes ?? []).flatMap((cliente) =>
                (cliente.enderecos ?? []).map((endereco) => ({
                    ...endereco,
                    clienteId: cliente.id,
                    clienteNome: cliente.nome,
                }))
            );

            setLista(enderecos);
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao carregar os endereços.");
        } finally {
            setCarregando(false);
        }
    }

    function detalhar(endereco) {
        setEnderecoDetalhe(endereco);

        document
            .getElementById("modal-detalhar-endereco")
            ?.showModal();
    }

    function editar(endereco) {
        navigate(
            `/endereco-cliente-form/${endereco.clienteId}/${endereco.id}`
        );
    }

    async function confirmarRemover(id) {
        if (!window.confirm("Deseja realmente excluir este endereço?")) {
            return;
        }

        try {
            await remover(MAPPING_CONTROLLER_ENDERECO_CLIENTE, id);
            await carregar();

            toast.success("Endereço removido com sucesso!");
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao tentar remover o endereço.");
        }
    }

    return (
        <div>
            <Menu />

            <Breadcrumbs
                items={[
                    { label: "Endereço do Cliente" },
                    { label: "Listar" },
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
                            Endereços dos Clientes
                        </h1>

                        <NewButton destino="/endereco-cliente-form" />
                    </div>

                    <div className="divider divider-info" />

                    <div className="overflow-x-auto" style={{ marginTop: "30px" }}>
                        {carregando ? (
                            <p className="p-6">Carregando endereços...</p>
                        ) : (
                            <table className="table table-zebra">
                                <thead>
                                    <tr style={{ textAlign: "center" }}>
                                        <th>Cliente</th>
                                        <th>Rua</th>
                                        <th>Número</th>
                                        <th>Bairro</th>
                                        <th>CEP</th>
                                        <th>Cidade</th>
                                        <th>Estado</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lista.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center">
                                                Nenhum endereço cadastrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        lista.map((endereco) => (
                                            <tr key={endereco.id}>
                                                <td className="text-center">
                                                    {endereco.clienteNome}
                                                </td>

                                                <td className="text-center">
                                                    {endereco.rua}
                                                </td>

                                                <td className="text-center">
                                                    {endereco.numero}
                                                </td>

                                                <td className="text-center">
                                                    {endereco.bairro}
                                                </td>

                                                <td className="text-center">
                                                    {endereco.cep}
                                                </td>

                                                <td className="text-center">
                                                    {endereco.cidade}
                                                </td>

                                                <td className="text-center">
                                                    {endereco.estado}
                                                </td>

                                                <td className="text-center">
                                                    <CrudActions
                                                        onDetail={() => detalhar(endereco)}
                                                        onEdit={() => editar(endereco)}
                                                        onDelete={() =>
                                                            confirmarRemover(endereco.id)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Modal de detalhes */}
                    <dialog id="modal-detalhar-endereco" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                Dados do Endereço
                            </h3>

                            <div className="divider" />

                            <p className="py-2">
                                <strong>Cliente:</strong>{" "}
                                {enderecoDetalhe.clienteNome || "-"}
                            </p>

                            <p className="py-2">
                                <strong>Rua:</strong>{" "}
                                {enderecoDetalhe.rua || "-"}
                            </p>

                            <p className="py-2">
                                <strong>Número:</strong>{" "}
                                {enderecoDetalhe.numero || "-"}
                            </p>

                            <p className="py-2">
                                <strong>Bairro:</strong>{" "}
                                {enderecoDetalhe.bairro || "-"}
                            </p>

                            <p className="py-2">
                                <strong>CEP:</strong>{" "}
                                {enderecoDetalhe.cep || "-"}
                            </p>

                            <p className="py-2">
                                <strong>Cidade:</strong>{" "}
                                {enderecoDetalhe.cidade || "-"}
                            </p>

                            <p className="py-2">
                                <strong>Estado:</strong>{" "}
                                {enderecoDetalhe.estado || "-"}
                            </p>

                            <p className="py-2">
                                <strong>Complemento:</strong>{" "}
                                {enderecoDetalhe.complemento || "-"}
                            </p>

                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Fechar</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>

            <Footer />
        </div>
    );
}