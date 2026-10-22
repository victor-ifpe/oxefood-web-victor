
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import CrudActions from "../../../shared/components/CrudActions";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import NewButton from "../../../shared/components/NewButton";

import {
    buscarPorId,
    listar,
    remover,
} from "../../../shared/services/crudService";

import {
    MAPPING_CONTROLLER_CATEGORIA_PRODUTO,
} from "../service/categoriaProdutoService";

export default function CategoriaProdutoPage() {
    const [lista, setLista] = useState([]);

    const [categoriaProduto, setCategoriaProduto] = useState({
        id: null,
        descricao: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {
        try {
            const data = await listar(
                MAPPING_CONTROLLER_CATEGORIA_PRODUTO
            );

            setLista(data);
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao carregar categorias de produto.");
        }
    }

    function editar(id) {
        navigate(`/categoria-produto-form/${id}`);
    }

    async function confirmarRemover(id) {
        if (!window.confirm("Deseja realmente excluir esta categoria?")) {
            return;
        }

        try {
            await remover(
                MAPPING_CONTROLLER_CATEGORIA_PRODUTO,
                id
            );

            await carregar();

            toast.success("Categoria removida com sucesso!");
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao tentar remover a categoria.");
        }
    }

    async function detalhar(id) {
        try {
            const data = await buscarPorId(
                MAPPING_CONTROLLER_CATEGORIA_PRODUTO,
                id
            );

            setCategoriaProduto({
                id: data.id,
                descricao: data.descricao ?? "",
            });

            document
                .getElementById("modal-detalhar-categoria")
                .showModal();
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao carregar categoria de produto.");
        }
    }

    return (
        <div>
            <Menu />

            <Breadcrumbs
                items={[
                    { label: "Categoria de Produto" },
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
                            Categorias de Produto
                        </h1>

                        <NewButton destino="/categoria-produto-form" />
                    </div>

                    <div className="divider divider-info" />

                    <div
                        className="overflow-x-auto"
                        style={{ marginTop: "30px" }}
                    >
                        <table className="table table-zebra">
                            <thead>
                                <tr style={{ textAlign: "center" }}>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {lista.map((categoria) => (
                                    <tr key={categoria.id}>
                                        <td style={{ textAlign: "center" }}>
                                            {categoria.descricao}
                                        </td>

                                        <td style={{ textAlign: "center" }}>
                                            <CrudActions
                                                onDetail={() => detalhar(categoria.id)}
                                                onEdit={() => editar(categoria.id)}
                                                onDelete={() =>
                                                    confirmarRemover(categoria.id)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}

                                {lista.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="text-center">
                                            Nenhuma categoria cadastrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <dialog
                id="modal-detalhar-categoria"
                className="modal"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">
                        Dados da Categoria
                    </h3>

                    <div className="divider" />

                    <p className="py-4">
                        <strong>Descrição:</strong>{" "}
                        {categoriaProduto.descricao}
                    </p>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Fechar</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <Footer />
        </div>
    );
}