import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import CrudActions from "../../../shared/components/CrudActions";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import NewButton from "../../../shared/components/NewButton";
import { buscarPorId, listar, remover } from "../../../shared/services/crudService";
import { MAPPING_CONTROLLER_PRODUTO } from "../service/produtoService";

export default function ProdutoPage() {

  const [lista, setLista] = useState([]);
  const navigate = useNavigate();

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
  }

  function editar(id) {
    navigate(`/produto-form/${id}`);
  }

  async function confirmarRemover(id) {

    if (!confirm("Deseja realmente excluir esta Empresa?")) {
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
            <NewButton destino="/produto-form" />
          </div>

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