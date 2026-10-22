
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
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
  listar,
} from "../../../shared/services/crudService";

import { MAPPING_CONTROLLER_PRODUTO } from "../service/produtoService";
import { MAPPING_CONTROLLER_CATEGORIA_PRODUTO } from "../../produto/service/categoriaProdutoService";
import { MAPPING_CONTROLLER_EMPRESA } from "../../produto/service/empresaService";

export default function ProdutoForm() {
  const { idProduto } = useParams();

  const [listaCategoria, setListaCategoria] = useState([]);
  const [listaEmpresa, setListaEmpresa] = useState([]);

  const [produto, setProduto] = useState({
    id: null,
    empresa: {
      id: "",
    },
    categoria: {
      id: "",
    },
    codigo: "",
    titulo: "",
    descricao: "",
    valorUnitario: "",
    tempoEntregaMinimo: "",
    tempoEntregaMaximo: "",
  });

  useEffect(() => {
    carregarCategoriasProduto();
    carregarEmpresas();

    if (idProduto) {
      carregarProduto();
    }
  }, [idProduto]);

  async function carregarProduto() {
    try {
      const data = await buscarPorId(
        MAPPING_CONTROLLER_PRODUTO,
        idProduto
      );

      setProduto({
        id: data.id,
        empresa: {
          id: data.empresa?.id ?? "",
        },
        categoria: {
          id: data.categoria?.id ?? "",
        },
        codigo: data.codigo ?? "",
        titulo: data.titulo ?? "",
        descricao: data.descricao ?? "",
        valorUnitario: data.valorUnitario ?? "",
        tempoEntregaMinimo: data.tempoEntregaMinimo ?? "",
        tempoEntregaMaximo: data.tempoEntregaMaximo ?? "",
      });
    } catch (erro) {
      console.error(erro);
      toast.error("Erro ao carregar Produto.");
    }
  }

  async function carregarEmpresas() {
    try {
      const data = await listar(MAPPING_CONTROLLER_EMPRESA);
      setListaEmpresa(data);
    } catch (erro) {
      console.error(erro);
      toast.error("Erro ao carregar as empresas.");
    }
  }

  async function carregarCategoriasProduto() {
    try {
      const data = await listar(
        MAPPING_CONTROLLER_CATEGORIA_PRODUTO
      );
      setListaCategoria(data);
    } catch (erro) {
      console.error(erro);
      toast.error("Erro ao carregar as categorias de produto.");
    }
  }

  async function salvar(e) {
    e?.preventDefault();

    try {
      const produtoParaSalvar = {
        ...produto,
        empresa: {
          id: Number(produto.empresa.id),
        },
        categoria: {
          id: Number(produto.categoria.id),
        },
        valorUnitario:
          produto.valorUnitario === ""
            ? null
            : Number(produto.valorUnitario),
        tempoEntregaMinimo: Number(produto.tempoEntregaMinimo),
        tempoEntregaMaximo: Number(produto.tempoEntregaMaximo),
      };

      if (idProduto) {
        await atualizar(MAPPING_CONTROLLER_PRODUTO, produtoParaSalvar);
        toast.success("Produto alterado com sucesso!");
      } else {
        await cadastrar(MAPPING_CONTROLLER_PRODUTO, produtoParaSalvar);
        toast.success("Produto cadastrado com sucesso!");
      }
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro.response?.data ?? erro);
      toast.error(
        erro.response?.data?.message || "Erro ao salvar Produto."
      );
    }
  }

  return (
    <div>
      <Menu />

      <Breadcrumbs
        items={[
          { label: "Produto" },
          { label: idProduto ? "Alterar" : "Cadastrar" },
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
              {idProduto ? "Alterar Produto" : "Novo Produto"}
            </h1>
          </div>

          <div className="divider divider-info" />

          <div className="overflow-x-auto" style={{ padding: "30px" }}>
            <form onSubmit={salvar}>
              {/* Empresa e Categoria */}
              <div className="flex w-full">
                {/* Empresa */}
                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Empresa
                    </legend>

                    <select
                      className="select w-full"
                      value={produto.empresa.id}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          empresa: {
                            id: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Selecione ...</option>

                      {listaEmpresa.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nomeFantasia}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>

                {/* Categoria */}
                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Categoria
                    </legend>

                    <select
                      className="select w-full"
                      value={produto.categoria.id}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          categoria: {
                            id: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Selecione ...</option>

                      {listaCategoria.map((categoria) => (
                        <option
                          key={categoria.id}
                          value={categoria.id}
                        >
                          {categoria.descricao}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>
              </div>

              {/* Código e Título */}
              <div className="flex w-full">
                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <fieldset className="fieldset w-full">
                    <label
                      className="fieldset-legend"
                      htmlFor="codigo"
                    >
                      Código
                    </label>

                    <IMaskInput
                      mask="PROD-000"
                      placeholder="PROD-000"
                      value={produto.codigo}
                      onAccept={(value) =>
                        setProduto({
                          ...produto,
                          codigo: value,
                        })
                      }
                      className="input input-bordered w-full"
                      id="codigo"
                    />
                  </fieldset>
                </div>

                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <fieldset className="fieldset w-full">
                    <label
                      className="fieldset-legend"
                      htmlFor="titulo"
                    >
                      Título
                    </label>

                    <input
                      type="text"
                      placeholder="Título do produto"
                      id="titulo"
                      className="input input-bordered w-full"
                      value={produto.titulo}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          titulo: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                </div>
              </div>

              {/* Descrição */}
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

                    <textarea
                      placeholder="Descrição do produto"
                      id="descricao"
                      className="textarea textarea-bordered w-full"
                      value={produto.descricao}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          descricao: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                </div>
              </div>

              {/* Valor e tempos de entrega */}
              <div className="flex w-full">
                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <fieldset className="fieldset w-full">
                    <label
                      className="fieldset-legend"
                      htmlFor="valorUnitario"
                    >
                      Valor Unitário
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      id="valorUnitario"
                      className="input input-bordered w-full"
                      value={produto.valorUnitario}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          valorUnitario:
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                        })
                      }
                    />
                  </fieldset>
                </div>

                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <fieldset className="fieldset w-full">
                    <label
                      className="fieldset-legend"
                      htmlFor="tempoEntregaMinimo"
                    >
                      Tempo de Entrega Mínimo
                    </label>

                    <input
                      type="number"
                      placeholder="Ex: 30"
                      id="tempoEntregaMinimo"
                      className="input input-bordered w-full"
                      value={produto.tempoEntregaMinimo}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          tempoEntregaMinimo:
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                        })
                      }
                    />
                  </fieldset>
                </div>

                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <fieldset className="fieldset w-full">
                    <label
                      className="fieldset-legend"
                      htmlFor="tempoEntregaMaximo"
                    >
                      Tempo de Entrega Máximo
                    </label>

                    <input
                      type="number"
                      placeholder="Ex: 60"
                      id="tempoEntregaMaximo"
                      className="input input-bordered w-full"
                      value={produto.tempoEntregaMaximo}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          tempoEntregaMaximo:
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                        })
                      }
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
                  <div
                    style={{
                      marginTop: "50px",
                      textAlign: "left",
                    }}
                  >
                    <BackButton destino="/produto" />
                  </div>
                </div>

                <div
                  className="card rounded-box grid grow p-8"
                  style={{ padding: "30px" }}
                >
                  <div
                    style={{
                      marginTop: "50px",
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