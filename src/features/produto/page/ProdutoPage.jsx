import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import CrudActions from "../../../shared/components/CrudActions";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import NewButton from "../../../shared/components/NewButton";
import { buscarPorId, listar, remover } from "../../../shared/services/crudService";
import FilterButton from "../../../shared/components/FilterButton";
import { MAPPING_CONTROLLER_CATEGORIA_PRODUTO } from "../../categoriaproduto/service/categoriaProdutoService";
import { filtrar, MAPPING_CONTROLLER_PRODUTO } from "../service/produtoService";

export default function ProdutoPage() {

  const [lista, setLista] = useState([]);
  const navigate = useNavigate();

  const [menuFiltro, setMenuFiltro] = useState();
  const [codigo, setCodigo] = useState();
  const [titulo, setTitulo] = useState();
  const [idCategoria, setIdCategoria] = useState();
  const [listaCategoriaProduto, setListaCategoriaProduto] = useState([]);
  const [produto, setProduto] = useState({
    id: null,
    codigo: "",
    titulo: "",
    descricao: "",
    valorUnitario: "",
    tempoEntregaMinimo: "",
    tempoEntregaMaximo: "",
    empresa: null,
    categoria: null
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listar(MAPPING_CONTROLLER_PRODUTO);
    setLista(data);

    const listaCategoriaProduto = await listar(MAPPING_CONTROLLER_CATEGORIA_PRODUTO);
    setListaCategoriaProduto(listaCategoriaProduto);
  }

  function editar(id) {
    navigate(`/produto-form/${id}`);
  }

  async function confirmarRemover(id) {

    if (!confirm("Deseja realmente excluir este Produto?")) {
      return;
    }

    try {

      await remover(MAPPING_CONTROLLER_PRODUTO, id);
      await carregar();
      toast.success("Produto removido com sucesso!");

    } catch (erro) {

      console.error(erro);
      toast.error("Erro ao tentar remover o produto.");
    }
  }

  function handleMenuFiltro() {

    if (menuFiltro === true) {
      setMenuFiltro(false);
    } else {
      setMenuFiltro(true);
    }
  }

  function handleChangeCodigo(value) {

    filtrarProdutos(value, titulo, idCategoria);
  }

  function handleChangeTitulo(value) {

    filtrarProdutos(codigo, value, idCategoria);
  }

  function handleChangeCategoriaProduto(value) {

    filtrarProdutos(codigo, titulo, value);
  }

  async function filtrarProdutos(codigoParam, tituloParam, idCategoriaParam) {

    let formData = new FormData();

    if (codigoParam !== undefined) {
      setCodigo(codigoParam)
      formData.append('codigo', codigoParam);
    }

    if (tituloParam !== undefined) {
      setTitulo(tituloParam)
      formData.append('titulo', tituloParam);
    }

    if (idCategoriaParam !== undefined) {
      setIdCategoria(idCategoriaParam)
      formData.append('idCategoria', idCategoriaParam);
    }

    const data = await filtrar(formData);
    setLista(data);
  }

  async function detalhar(id) {

    try {

      const data = await buscarPorId(
        MAPPING_CONTROLLER_PRODUTO,
        id
      );

      setProduto({
        id: data.id,
        codigo: data.codigo ?? "",
        titulo: data.titulo ?? "",
        descricao: data.descricao ?? "",
        valorUnitario: data.valorUnitario ?? "",
        tempoEntregaMinimo: data.tempoEntregaMinimo ?? "",
        tempoEntregaMaximo: data.tempoEntregaMaximo ?? "",
        empresa: data.empresa ?? null,
        categoria: data.categoria ?? null
      });


      document.getElementById('modal-detalhar').showModal()

    } catch (erro) {
      toast.error("Erro ao carregar produto.");
    }
  }

  return (
    <div>
      <Menu />

      <Breadcrumbs items={[
        { label: "Produto" },
        { label: "Listar" }
      ]} />

      <div style={{ marginTop: '40px', marginLeft: '10%', marginRight: '10%' }}>
        <div className="overflow-x-auto shadow-sm">

          <div className="flex items-center justify-between mb-6" style={{ marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
            <h1 className="text-3xl font-bold text-gray-800">
              Produtos
            </h1>

            <div className="flex items-center gap-2">
              <FilterButton onClick={() => handleMenuFiltro()} />
              <NewButton destino="/produto-form" />
            </div>
          </div>


          {menuFiltro ?

            <div className="overflow-x-auto" style={{ padding: '30px' }}>

              <div className="flex w-full" >
                <div className="card rounded-box grid grow p-8" style={{ padding: '10px' }}>

                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="titulo">Título</label>
                    <input
                      type="text"
                      id="titulo"
                      className="input input-bordered w-full"
                      value={titulo}
                      onChange={e => handleChangeTitulo(e.target.value)}
                    />
                  </fieldset>
                </div>
                <div className="card rounded-box grid grow p-8" style={{ padding: '10px' }}>

                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="codigo">Código do Produto</label>
                    <input
                      type="text"
                      id="codigo"
                      className="input input-bordered w-full"
                      value={codigo}
                      onChange={e => handleChangeCodigo(e.target.value)}
                    />
                  </fieldset>
                </div>
              </div>
              <div className="card rounded-box grid grow p-8" style={{ padding: '10px' }}>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Categoria</legend>
                  <select
                    className="select  w-full"
                    value={idCategoria}
                    onChange={(e) =>
                      handleChangeCategoriaProduto(e.target.value)
                    }
                  >
                    <option value="">Selecione ...</option>
                    {listaCategoriaProduto.map((categoria, index) => (
                      <option key={index} value={categoria.id}>
                        {categoria.descricao}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>
            </div>

            : ""}

          <div className="divider divider-info" />

          <div className="overflow-x-auto" style={{ marginTop: '30px' }}>
            <table className="table table-zebra">

              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <th>Titulo</th>
                  <th>Codigo</th>
                  <th>Categoria</th>
                  <th>Nome da Empresa</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {lista.map(produto => (
                  <tr key={produto.id}>
                    <td style={{ textAlign: 'center' }}>
                      {produto.titulo}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {produto.codigo}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {produto.categoria?.descricao}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      {produto.empresa?.nomeEmpresarial}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <CrudActions
                        onDetail={() => detalhar(produto.id)}
                        onEdit={() => editar(produto.id)}
                        onDelete={() => confirmarRemover(produto.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>

              <dialog id="modal-detalhar" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Dados do Produto</h3>
                  <div className="divider" />
                  <p className="py-4">
                    <strong>Código:</strong> {produto.codigo}
                  </p>
                  <p className="py-4">
                    <strong>Título:</strong> {produto.titulo}
                  </p>
                  <p className="py-4">
                    <strong>Descrição:</strong> {produto.descricao}
                  </p>
                  <p className="py-4">
                    <strong>Valor Unitário:</strong> {produto.valorUnitario}
                  </p>
                  <p className="py-4">
                    <strong>Tempo de Entrega Mínimo:</strong> {produto.tempoEntregaMinimo}
                  </p>
                  <p className="py-4">
                    <strong>Tempo de Entrega Máximo:</strong> {produto.tempoEntregaMaximo}
                  </p>
                  <p className="py-4">
                    <strong>Empresa:</strong> {produto.empresa?.nomeFantasia}
                  </p>
                  <p className="py-4">
                    <strong>Categoria:</strong> {produto.categoria?.descricao}
                  </p>

                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Fechar</button>
                    </form>
                  </div>
                </div>
              </dialog>


            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}