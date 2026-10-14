import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import CrudActions from "../../../shared/components/CrudActions";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import NewButton from "../../../shared/components/NewButton";
import { buscarPorId, listar, remover } from "../../../shared/services/crudService";
import { MAPPING_CONTROLLER_VOTO } from "../service/votoService";

export default function VotoPage() {

  const [lista, setLista] = useState([]);
  const navigate = useNavigate();

  const [voto, setVoto] = useState({
    id: null,
    nomeEleitor: "",
    numeroRegistroEleitoral: "",
    dataVotacao: "",
    numeroCandidatoDepFederal: "",
    numeroCandidatoDepEstadual: "",
    numeroCandidatoSenador: "",
    numeroCandidatoGovernador: "",
    numeroCandidatoPresidente: ""
  });


  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listar(MAPPING_CONTROLLER_VOTO);
    setLista(data);
  }

  function editar(id) {
    navigate(`/voto-form/${id}`);
  }


  async function confirmarRemover(id) {

    if (!confirm("Deseja realmente excluir este voto?")) {
      return;
    }

    try {

      await remover(MAPPING_CONTROLLER_VOTO, id);
      await carregar();
      toast.success("Voto removido com sucesso!");

    } catch (erro) {

      console.error(erro);
      toast.error("Erro ao tentar remover o voto.");
    }
  }

  async function detalhar(id) {

    try {

      const data = await buscarPorId(
        MAPPING_CONTROLLER_VOTO,
        id
      );

      setVoto({
        id: data.id,
        nomeEleitor: data.nomeEleitor ?? "",
        numeroRegistroEleitoral: data.numeroRegistroEleitoral ?? "",
        dataVotacao: data.dataVotacao ?? "",
        numeroCandidatoDepFederal: data.numeroCandidatoDepFederal ?? "",
        numeroCandidatoDepEstadual: data.numeroCandidatoDepEstadual ?? "",
        numeroCandidatoSenador: data.numeroCandidatoSenador ?? "",
        numeroCandidatoGovernador: data.numeroCandidatoGovernador ?? "",
        numeroCandidatoPresidente: data.numeroCandidatoPresidente ?? ""
      });

      document.getElementById('modal-detalhar').showModal()

    } catch (erro) {
      toast.error("Erro ao carregar voto.");
    }
  }


  return (
    <div>
      <Menu />
      <Breadcrumbs items={[
        { label: "Voto" },
        { label: "Listar" }
      ]} />

      <div style={{ marginTop: '40px', marginLeft: '10%', marginRight: '10%' }}>
        <div className="overflow-x-auto shadow-sm">

          <div className="flex items-center justify-between mb-6" style={{ marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
            <h1 className="text-3xl font-bold text-gray-800">
              Votos
            </h1>
            <NewButton destino="/voto-form" />
          </div>

          <div className="divider divider-info" />

          <div className="overflow-x-auto" style={{ marginTop: '30px' }}>
            <table className="table table-zebra">

              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <th>Eleitor</th>
                  <th>Registro</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {lista.map(voto => (

                  <tr key={voto.id}>
                    <td style={{ textAlign: 'center' }}>{voto.nomeEleitor}</td>
                    <td style={{ textAlign: 'center' }}>{voto.numeroRegistroEleitoral}</td>
                    <td style={{ textAlign: 'center' }}>
                      <CrudActions
                        onDetail={() => detalhar(voto.id)}
                        onEdit={() => editar(voto.id)}
                        onDelete={() => confirmarRemover(voto.id)}
                      />
                    </td>
                  </tr>

                ))}

              </tbody>

            </table>
          </div>
        </div>
      </div>

      <dialog id="modal-detalhar" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Detalhamento do Voto</h3>
          <div className="divider" />
          <p className="py-4">
            <strong>Eleitor:</strong> {voto.nomeEleitor}
          </p>
          <p className="py-4">
            <strong>Registro:</strong> {voto.numeroRegistroEleitoral}
          </p>
          <p className="py-4">
            <strong>Data de Votação:</strong> {voto.dataVotacao}
          </p>
          <p className="py-4">
            <strong>Número Candidato Dep. Federal:</strong> {voto.numeroCandidatoDepFederal}
          </p>
          <p className="py-4">
            <strong>Número Candidato Dep. Estadual:</strong> {voto.numeroCandidatoDepEstadual}
          </p>
          <p className="py-4">
            <strong>Número Candidato Senador:</strong> {voto.numeroCandidatoSenador}
          </p>
          <p className="py-4">
            <strong>Número Candidato Governador:</strong> {voto.numeroCandidatoGovernador}
          </p>
          <p className="py-4">
            <strong>Número Candidato Presidente:</strong> {voto.numeroCandidatoPresidente}
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Fechar</button>
            </form>
          </div>
        </div>
      </dialog>

      <Footer />
    </div>
  );
}

