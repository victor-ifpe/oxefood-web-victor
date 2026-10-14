import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import BackButton from "../../../shared/components/BackButton";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import SaveButton from "../../../shared/components/SaveButton";
import { atualizar, buscarPorId, cadastrar } from "../../../shared/services/crudService";
import { MAPPING_CONTROLLER_VOTO } from "../service/votoService";

export default function VotoForm() {

  const { idVoto } = useParams();
  const [voto, setVoto] = useState({
    id: null,
    nomeEleitor: "",
    numeroRegistroEleitoral: "",
    dataVotacao: "",
    numeroCandidatoDepFederal: "",
    numeroCandidatoDepEstadual: "",
    numeroCandidatoSenador: "",
    numeroCandidatoGovernador: "",
    numeroCandidatoPresidente: "",
  });

  useEffect(() => {
    if (idVoto) {
      carregarVoto();
    }
  }, [idVoto]);

  async function carregarVoto() {
    try {
      const data = await buscarPorId(
        MAPPING_CONTROLLER_VOTO,
        idVoto
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
    } catch (erro) {
      toast.error("Erro ao carregar voto.");
    }
  }

  async function salvar() {
    try {
      if (idVoto) {
        await atualizar(MAPPING_CONTROLLER_VOTO, voto);
        toast.success("Voto alterado com sucesso!");
      } else {
        await cadastrar(MAPPING_CONTROLLER_VOTO, voto);
        toast.success("Voto cadastrado com sucesso!");
      }
    } catch (erro) {
      toast.error("Erro ao salvar voto.");
    }
  }

  return (

    <div>
      <Menu />

      {idVoto ?
        <Breadcrumbs items={[
          { label: "Voto" },
          { label: "Alterar" }
        ]} />
        :
        <Breadcrumbs items={[
          { label: "Voto" },
          { label: "Cadastrar" }
        ]} />
      }

      <div style={{ marginTop: '40px', marginLeft: '10%', marginRight: '10%' }}>

        <div className="overflow-x-auto shadow-sm">

          <div className="flex items-center justify-between mb-6" style={{ marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>

            <h1 className="text-3xl font-bold text-gray-800">
              {idVoto ? "Alterar Voto" : "Novo Voto"}
            </h1>


          </div>

          <div className="divider divider-info" />

          <div className="overflow-x-auto" style={{ padding: '30px' }}>
            <form>
              <div className="flex w-full" >
                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="nomeEleitor">Eleitor</label>
                    <input
                      type="text"
                      id="nomeEleitor"
                      className="input input-bordered w-full"
                      value={voto.nomeEleitor}
                      onChange={(e) =>
                        setVoto({ ...voto, nomeEleitor: e.target.value })
                      }
                    />
                  </fieldset>
                </div>

                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="numeroRegistroEleitoral">Registro</label>
                    <input
                      type="text"
                      id="numeroRegistroEleitoral"
                      className="input input-bordered w-full"
                      value={voto.numeroRegistroEleitoral}
                      onChange={(e) =>
                        setVoto({ ...voto, numeroRegistroEleitoral: e.target.value })
                      }
                    />
                  </fieldset>
                </div>
              </div>



              <div className="flex w-full" >
                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="numeroCandidatoDepFederal">Número Candidato Dep. Federal</label>
                    <input
                      type="number"
                      id="numeroCandidatoDepFederal"
                      className="input input-bordered w-full"
                      value={voto.numeroCandidatoDepFederal}
                      onChange={(e) =>
                        setVoto({ ...voto, numeroCandidatoDepFederal: e.target.value })
                      }
                    />
                  </fieldset>
                </div>

                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="numeroCandidatoDepEstadual">Número Candidato Dep. Estadual</label>
                    <input
                      type="number"
                      id="numeroCandidatoDepFederal"
                      className="input input-bordered w-full"
                      value={voto.numeroCandidatoDepEstadual}
                      onChange={(e) =>
                        setVoto({ ...voto, numeroCandidatoDepEstadual: e.target.value })
                      }
                    />
                  </fieldset>
                </div>
              </div>



              <div className="flex w-full" >
                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="numeroCandidatoSenador">Número Candidato Senador</label>
                    <input
                      type="number"
                      id="numeroCandidatoDepFederal"
                      className="input input-bordered w-full"
                      value={voto.numeroCandidatoSenador}
                      onChange={(e) =>
                        setVoto({ ...voto, numeroCandidatoSenador: e.target.value })
                      }
                    />
                  </fieldset>
                </div>

                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="numeroCandidatoGovernador">Número Candidato Governador</label>
                    <input
                      type="number"
                      id="numeroCandidatoGovernador"
                      className="input input-bordered w-full"
                      value={voto.numeroCandidatoGovernador}
                      onChange={(e) =>
                        setVoto({ ...voto, numeroCandidatoGovernador: e.target.value })
                      }
                    />
                  </fieldset>
                </div>
              </div>



              <div className="flex w-full" >
                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>
                  <fieldset className="fieldset w-full">
                    <label className="fieldset-legend" htmlFor="numeroCandidatoPresidente">Número Candidato Presidente</label>
                    <input
                      type="number"
                      id="numeroCandidatoPresidente"
                      className="input input-bordered w-full"
                      value={voto.numeroCandidatoPresidente}
                      onChange={(e) =>
                        setVoto({ ...voto, numeroCandidatoPresidente: e.target.value })
                      }
                    />
                  </fieldset>
                </div>
              </div>

              <div className="flex w-full" >
                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>

                  <div style={{ marginTop: '50px', textAlign: 'left' }}>
                    <BackButton destino="/voto" />
                  </div>

                </div>
                <div className="card rounded-box grid grow p-8" style={{ padding: '30px' }}>

                  <div style={{ marginTop: '50px', textAlign: 'right' }}>
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