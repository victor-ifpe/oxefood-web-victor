import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import CrudActions from "../../../shared/components/CrudActions";
import FilterButton from "../../../shared/components/FilterButton";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import NewButton from "../../../shared/components/NewButton";
import { buscarPorId, listar, remover } from "../../../shared/services/crudService";
import { formatarData } from "../../../shared/util/dateUtils";
import { filtrar, MAPPING_CONTROLLER_CLIENTE } from "../service/clienteService";

export default function ClientePage() {

    const [lista, setLista] = useState([]);
    const navigate = useNavigate();

    const [menuFiltro, setMenuFiltro] = useState(true);
    const [pesquisa, setPesquisa] = useState("");
    const [pesquisaAplicada, setPesquisaAplicada] = useState(null);
    const ultimaRequisicao = useRef(0);

    const [cliente, setCliente] = useState({
        id: null,
        nome: "",
        cpf: "",
        foneCelular: "",
        foneFixo: "",
        dataNascimento: ""
    });


    useEffect(() => {
        // Aguarda o usuário terminar de digitar antes de consultar; sem termo, carrega a listagem completa
        const temporizador = setTimeout(() => {
            carregar();
        }, pesquisa === "" ? 0 : 300);

        return () => clearTimeout(temporizador);
    }, [pesquisa]);

    async function carregar() {

        const termo = pesquisa.trim();
        const requisicao = ++ultimaRequisicao.current;

        try {

            let data;

            if (termo === "") {
                data = await listar(MAPPING_CONTROLLER_CLIENTE);
            } else {
                let formData = new FormData();
                formData.append('pesquisa', termo);
                data = await filtrar(formData);
            }

            // Ignora respostas de consultas antigas
            if (requisicao === ultimaRequisicao.current) {
                setLista(data);
                setPesquisaAplicada(termo);
            }

        } catch (erro) {

            console.error(erro);
            toast.error("Erro ao carregar os clientes.");
        }
    }

    function handleMenuFiltro() {

        if (menuFiltro) {
            setPesquisa("");
        }

        setMenuFiltro(!menuFiltro);
    }

    function editar(id) {
        navigate(`/cliente-form/${id}`);
    }


    async function confirmarRemover(id) {

        if (!confirm("Deseja realmente excluir este cliente?")) {
            return;
        }

        try {

            await remover(MAPPING_CONTROLLER_CLIENTE, id);
            await carregar();
            toast.success("Cliente removido com sucesso!");

        } catch (erro) {

            console.error(erro);
            toast.error("Erro ao tentar remover o cliente.");
        }
    }

    async function detalhar(id) {

        try {

            const data = await buscarPorId(
                MAPPING_CONTROLLER_CLIENTE,
                id
            );

            setCliente({
                id: data.id,
                nome: data.nome ?? "",
                cpf: data.cpf ?? "",
                foneCelular: data.foneCelular ?? "",
                foneFixo: data.foneFixo ?? "",
                dataNascimento: data.dataNascimento ?? ""
            });

            document.getElementById('modal-detalhar').showModal()

        } catch (erro) {
            toast.error("Erro ao carregar cliente.");
        }
    }


    return (
        <div>
            <Menu />
            <Breadcrumbs items={[
                { label: "Cliente" },
                { label: "Listar" }
            ]} />

            <div style={{ marginTop: '40px', marginLeft: '10%', marginRight: '10%' }}>
                <div className="overflow-x-auto shadow-sm">

                    <div className="flex items-center justify-between mb-6" style={{ marginTop: '20px', marginLeft: '10px', marginRight: '10px' }}>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Clientes
                        </h1>
                        <div className="flex items-center gap-2">
                            <FilterButton onClick={() => handleMenuFiltro()} />
                            <NewButton destino="/cliente-form" />
                        </div>
                    </div>

                    {menuFiltro ?

                        <div className="overflow-x-auto" style={{ padding: '30px' }}>

                            <div className="flex w-full items-end gap-2">
                                <div className="card rounded-box grid grow p-8" style={{ padding: '10px' }}>

                                    <fieldset className="fieldset w-full">
                                        <label className="fieldset-legend" htmlFor="pesquisa">Nome ou CPF</label>
                                        <input
                                            type="text"
                                            id="pesquisa"
                                            placeholder="Digite o nome ou o CPF (com ou sem pontuação)"
                                            className="input input-bordered w-full"
                                            value={pesquisa}
                                            onChange={e => setPesquisa(e.target.value)}
                                        />
                                    </fieldset>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPesquisa("")}
                                    disabled={pesquisa === ""}
                                    className="btn bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                                    style={{ marginBottom: '10px' }}
                                >
                                    Limpar
                                </button>
                            </div>
                        </div>

                        : ""}

                    <div className="divider divider-info" />

                    <div className="overflow-x-auto" style={{ marginTop: '30px' }}>
                        <table className="table table-zebra">

                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Data de Nascimento</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pesquisaAplicada !== null && lista.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center' }}>
                                            {pesquisaAplicada !== ""
                                                ? "Nenhum cliente encontrado para a pesquisa informada."
                                                : "Nenhum cliente cadastrado."}
                                        </td>
                                    </tr>
                                )}

                                {lista.map(cliente => (

                                    <tr key={cliente.id}>
                                        <td style={{ textAlign: 'center' }}>{cliente.nome}</td>
                                        <td style={{ textAlign: 'center' }}>{cliente.cpf}</td>
                                        <td style={{ textAlign: 'center' }}>{formatarData(cliente.dataNascimento)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <CrudActions
                                                onDetail={() => detalhar(cliente.id)}
                                                onEdit={() => editar(cliente.id)}
                                                onDelete={() => confirmarRemover(cliente.id)}
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
                    <h3 className="font-bold text-lg">Dados do Cliente</h3>
                    <div className="divider" />
                    <p className="py-4">
                        <strong>Nome:</strong> {cliente.nome}
                    </p>
                    <p className="py-4">
                        <strong>CPF:</strong> {cliente.cpf}
                    </p>
                    <p className="py-4">
                        <strong>Data de Nascimento:</strong> {cliente.dataNascimento}
                    </p>
                    <p className="py-4">
                        <strong>Fone Fixo:</strong> {cliente.foneFixo}
                    </p>
                    <p className="py-4">
                        <strong>Fone Celular:</strong> {cliente.foneCelular}
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