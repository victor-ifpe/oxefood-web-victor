import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";

import BackButton from "../../../shared/components/BackButton";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import SaveButton from "../../../shared/components/SaveButton";

import { cadastrar } from "../../../shared/services/crudService";
import { MAPPING_CONTROLLER_PRODUTO } from "../service/produtoService";

export default function ProdutoForm() {

  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [produto, setProduto] = useState({
    empresa: {
      id: ""
    },
    categoria: {
      id: ""
    },
    codigo: "",
    titulo: "",
    descricao: "",
    valorUnitario: "",
    tempoEntregaMinimo: "",
    tempoEntregaMaximo: ""
  });

  useEffect(() => {
    async function carregarEmpresas() {
      try {
        const resposta = await fetch(
          "http://localhost:8080/api/empresa"
        );
        if (!resposta.ok) {
          throw new Error("Erro ao buscar empresas");
        }
        const dados = await resposta.json();
        setEmpresas(dados);
      } catch (erro) {
        console.error(erro);
        toast.error("Erro ao carregar empresas.");
      }
    }

    async function carregarCategorias() {
      try {
        const resposta = await fetch(
          "http://localhost:8080/api/categoria-produto"
        );
        if (!resposta.ok) {
          throw new Error("Erro ao buscar categorias");
        }
        const dados = await resposta.json();
        setCategorias(dados);
      } catch (erro) {
        console.error(erro);
        toast.error("Erro ao carregar categorias.");
      }
    }
    carregarEmpresas();
    carregarCategorias();
  }, []);

  async function salvar(e) {
    if (e) {
      e.preventDefault();
    }
    try {
      await cadastrar(
        MAPPING_CONTROLLER_PRODUTO,
        produto
      );
      toast.success("Produto cadastrado com sucesso!");
    } catch (erro) {
      console.error(erro);
      toast.error("Erro ao cadastrar produto.");

    }
  }

  return (
    <div>

      <Menu />

      <Breadcrumbs items={[
        { label: "Produto" },
        { label: "Cadastrar" }
      ]} />

      <div style={{ marginTop: "40px", marginLeft: "10%", marginRight: "10%" }}>
        <div className="overflow-x-auto shadow-sm">

          <div className="flex items-center justify-between mb-6" style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }}>
            <h1 className="text-3xl font-bold text-gray-800">
              Novo Produto
            </h1>
          </div>

          <div className="divider divider-info" />

          <div className="overflow-x-auto" style={{ padding: "30px" }}>
            <form onSubmit={salvar}>

              {/* Empresa + Categoria */}
              <div className="flex w-full">

                {/* Empresa */}
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="empresa">
                      Empresa
                    </label>
                    <select
                      id="empresa"
                      className="select select-bordered w-full"
                      value={produto.empresa.id}
                      onChange={(e) =>
                        setProduto({ ...produto, empresa: { id: e.target.value === "" ? "" : Number(e.target.value) } })
                      }
                    >
                      <option value="">
                        Selecione uma empresa
                      </option>
                      {empresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nomeEmpresarial}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>

                {/* Categoria */}
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="categoria">
                      Categoria
                    </label>
                    <select
                      id="categoria"
                      className="select select-bordered w-full"
                      value={produto.categoria.id}
                      onChange={(e) =>
                        setProduto({ ...produto, categoria: { id: e.target.value === "" ? "" : Number(e.target.value) } })
                      }
                    >
                      <option value="">
                        Selecione uma categoria
                      </option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.descricao}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>
              </div>

              {/* Código e Título */}
              <div className="flex w-full">

                {/* Código */}
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="codigo">
                      Código
                    </label>
                    <IMaskInput
                      mask="PROD-000"
                      placeholder="PROD-000"
                      value={produto.codigo}
                      onAccept={(value) =>
                        setProduto({ ...produto, codigo: value })
                      }
                      className="input input-bordered w-full"
                      id="codigo"
                    />
                  </fieldset>
                </div>

                {/* Título */}
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="titulo">
                      Título
                    </label>
                    <input
                      type="text"
                      placeholder="Título do produto"
                      id="titulo"
                      className="input input-bordered w-full"
                      value={produto.titulo}
                      onChange={(e) =>
                        setProduto({ ...produto, titulo: e.target.value })
                      }
                    />
                  </fieldset>
                </div>
              </div>

              {/* Descrição */}
              <div className="flex w-full">
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="descricao" >
                      Descrição
                    </label>
                    <textarea
                      placeholder="Descrição do produto"
                      id="descricao"
                      className="textarea textarea-bordered w-full"
                      value={produto.descricao}
                      onChange={(e) =>
                        setProduto({ ...produto, descricao: e.target.value })
                      }
                    />
                  </fieldset>
                </div>
              </div>

              {/* Valor Unitário + Tempos de Entrega */}
              <div className="flex w-full">
                
                {/* Valor Unitário */}
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="valorUnitario">
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
                        setProduto({ ...produto, valorUnitario: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </fieldset>
                </div>

                {/* Tempo de Entrega Mínimo */}
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="tempoEntregaMinimo">
                      Tempo de Entrega Mínimo
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 30"
                      id="tempoEntregaMinimo"
                      className="input input-bordered w-full"
                      value={produto.tempoEntregaMinimo}
                      onChange={(e) =>
                        setProduto({ ...produto, tempoEntregaMinimo: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </fieldset>
                </div>

                {/* Tempo de Entrega Máximo */}
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="tempoEntregaMaximo">
                      Tempo de Entrega Máximo
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 60"
                      id="tempoEntregaMaximo"
                      className="input input-bordered w-full"
                      value={produto.tempoEntregaMaximo}
                      onChange={(e) =>
                        setProduto({ ...produto, tempoEntregaMaximo: e.target.value === "" ? "" : Number(e.target.value) })
                      }
                    />
                  </fieldset>
                </div>
              </div>

              {/* Botões */}
              <div className="flex w-full">
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <div style={{ marginTop: "50px", textAlign: "left" }}>
                    <BackButton destino="/produto" />
                  </div>
                </div>
                <div className="card rounded-box grid grow p-8" style={{ padding: "30px" }}>
                  <div style={{ marginTop: "50px", textAlign: "right" }}>
                    <SaveButton save={() => salvar()} />
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