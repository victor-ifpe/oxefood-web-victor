
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BackButton from "../../../shared/components/BackButton";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import SaveButton from "../../../shared/components/SaveButton";

import {
    atualizar,
    buscarPorId,
    cadastrar,
} from "../../../shared/services/crudService";

import {
    MAPPING_CONTROLLER_CATEGORIA_PRODUTO,
} from "../service/categoriaProdutoService";

export default function CategoriaProdutoForm() {
    const { idCategoriaProduto } = useParams();

    const [categoriaProduto, setCategoriaProduto] = useState({
        id: null,
        descricao: "",
    });

    useEffect(() => {
        if (idCategoriaProduto) {
            carregarCategoriaProduto();
        }
    }, [idCategoriaProduto]);

    async function carregarCategoriaProduto() {
        try {
            const data = await buscarPorId(
                MAPPING_CONTROLLER_CATEGORIA_PRODUTO,
                idCategoriaProduto
            );

            setCategoriaProduto({
                id: data.id,
                descricao: data.descricao ?? "",
            });
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao carregar categoria de produto.");
        }
    }

    async function salvar(e) {
        e?.preventDefault();

        if (!categoriaProduto.descricao.trim()) {
            toast.error("Informe a descrição da categoria.");
            return;
        }

        const dados = {
            ...categoriaProduto,
            descricao: categoriaProduto.descricao.trim(),
        };

        try {
            if (idCategoriaProduto) {
                await atualizar(
                    MAPPING_CONTROLLER_CATEGORIA_PRODUTO,
                    dados
                );

                toast.success("Categoria alterada com sucesso!");
            } else {
                await cadastrar(
                    MAPPING_CONTROLLER_CATEGORIA_PRODUTO,
                    dados
                );

                toast.success("Categoria cadastrada com sucesso!");
            }
        } catch (erro) {
            console.error(erro);
            toast.error("Erro ao salvar categoria de produto.");
        }
    }

    return (
        <div>
            <Menu />

            <Breadcrumbs
                items={[
                    { label: "Categoria de Produto" },
                    { label: idCategoriaProduto ? "Alterar" : "Cadastrar" },
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
                            {idCategoriaProduto
                                ? "Alterar Categoria de Produto"
                                : "Nova Categoria de Produto"}
                        </h1>
                    </div>

                    <div className="divider divider-info" />

                    <div className="overflow-x-auto" style={{ padding: "30px" }}>
                        <form
                            onSubmit={salvar}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <fieldset className="fieldset w-full">
                                        <label
                                            className="fieldset-legend"
                                            htmlFor="descricao"
                                        >
                                            Descrição
                                        </label>

                                        <input
                                            type="text"
                                            id="descricao"
                                            placeholder="Descrição da categoria"
                                            className="input input-bordered w-full"
                                            value={categoriaProduto.descricao}
                                            onChange={(e) =>
                                                setCategoriaProduto({
                                                    ...categoriaProduto,
                                                    descricao: e.target.value,
                                                })
                                            }
                                        />
                                    </fieldset>
                                </div>
                            </div>

                            <div className="flex w-full">
                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <div
                                        style={{
                                            marginTop: "30px",
                                            textAlign: "left",
                                        }}
                                    >
                                        <BackButton destino="/categoria-produto" />
                                    </div>
                                </div>

                                <div
                                    className="card rounded-box grid grow p-8"
                                    style={{ padding: "30px" }}
                                >
                                    <div
                                        style={{
                                            marginTop: "30px",
                                            textAlign: "right",
                                        }}
                                    >
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