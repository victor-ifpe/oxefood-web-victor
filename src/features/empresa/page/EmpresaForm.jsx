import { useEffect, useRef, useState } from "react";
import { IMaskInput } from "react-imask";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../../../shared/components/BackButton";
import Breadcrumbs from "../../../shared/components/Breadcrumbs";
import Footer from "../../../shared/components/Footer";
import Menu from "../../../shared/components/Menu";
import SaveButton from "../../../shared/components/SaveButton";
import { atualizar, buscarPorId, cadastrar } from "../../../shared/services/crudService";
import { MAPPING_CONTROLLER_EMPRESA, saveLogo } from "../service/empresaService";

const TAMANHO_MAXIMO_LOGO = 2 * 1024 * 1024;
const TIPOS_LOGO_PERMITIDOS = ["image/png", "image/jpeg", "image/webp"];
const EXTENSOES_LOGO_PERMITIDAS = /\.(png|jpe?g|webp)$/i;

export default function EmpresaForm() {

    const { idEmpresa } = useParams();
    const [empresa, setEmpresa] = useState({
        id: null,
        site: "",
        cnpj: "",
        inscricaoEstadual: "",
        nomeEmpresarial: "",
        nomeFantasia: "",
        fone: "",
        foneAlternativo: "",
    });

    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [logoCadastrada, setLogoCadastrada] = useState("");
    const inputLogo = useRef(null);

    useEffect(() => {
        if (idEmpresa) {
            carregarEmpresa();
        }
    }, [idEmpresa]);

    async function carregarEmpresa() {
        try {
            const data = await buscarPorId(
                MAPPING_CONTROLLER_EMPRESA,
                idEmpresa
            );
            setEmpresa({
                id: data.id,
                site: data.site ?? "",
                cnpj: data.cnpj ?? "",
                inscricaoEstadual: data.inscricaoEstadual ?? "",
                nomeEmpresarial: data.nomeEmpresarial ?? "",
                nomeFantasia: data.nomeFantasia ?? "",
                fone: data.fone ?? "",
                foneAlternativo: data.foneAlternativo ?? "",
            });
            setLogoCadastrada(data.logo ?? "");
        } catch (erro) {
            toast.error("Erro ao carregar Empresa.");
        }
    }

    function limparLogoSelecionada() {
        setLogo(null);
        setPreview(null);

        if (inputLogo.current) {
            inputLogo.current.value = "";
        }
    }

    async function atualizaLogo(idEmpresaLogo) {

        try {

            let formData = new FormData();
            formData.append('logo', logo);

            const data = await saveLogo(idEmpresaLogo, formData);
            setLogoCadastrada(data.logo ?? "");
            limparLogoSelecionada();
            toast.success("Logo salva com sucesso!");

        } catch (erro) {

            console.error(erro);
            toast.error(
                typeof erro.response?.data === "string" && erro.response.data
                    ? erro.response.data
                    : "Erro ao tentar salvar a logo da empresa."
            );
        }
    }

    const handleLogoChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            limparLogoSelecionada();
            return;
        }

        if (!TIPOS_LOGO_PERMITIDOS.includes(file.type) || !EXTENSOES_LOGO_PERMITIDAS.test(file.name)) {
            toast.error("A logo deve ser uma imagem nos formatos PNG, JPG, JPEG ou WEBP.");
            limparLogoSelecionada();
            return;
        }

        if (file.size > TAMANHO_MAXIMO_LOGO) {
            toast.error("A logo não pode exceder 2 MB.");
            limparLogoSelecionada();
            return;
        }

        setLogo(file);

        // Gera uma URL para visualização da logo
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    async function salvar() {
        try {
            if (idEmpresa) {
                await atualizar(MAPPING_CONTROLLER_EMPRESA, empresa);
                toast.success("Empresa alterada com sucesso!");

                if (logo) {
                    await atualizaLogo(idEmpresa);
                }
            } else {
                const empresaCadastrada = await cadastrar(MAPPING_CONTROLLER_EMPRESA, empresa);
                toast.success("Empresa cadastrada com sucesso!");

                if (logo) {
                    await atualizaLogo(empresaCadastrada.id);
                }
            }
        } catch (erro) {
            toast.error("Erro ao salvar empresa.");
        }
    }

    return (
        <div>
            <Menu />

            {idEmpresa ?
                <Breadcrumbs items={[
                    { label: "Empresa" },
                    { label: "Alterar" }
                ]} />
                :
                <Breadcrumbs items={[
                    { label: "Empresa" },
                    { label: "Cadastrar" }
                ]} />
            }

            <div style={{ marginTop: "40px", marginLeft: "10%", marginRight: "10%", }} >
                <div className="overflow-x-auto shadow-sm">

                    <div className="flex items-center justify-between mb-6" style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px", }}>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {idEmpresa ? "Alterar Empresa" : "Nova Empresa"}
                        </h1>
                    </div>

                    <div className="divider divider-info" />

                    <div className="overflow-x-auto" style={{ padding: "30px" }}>
                        <form onSubmit={salvar}>

                            {/* Nome Empresarial */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Nome Empresarial
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite o nome empresarial"
                                    className="input input-bordered w-full"
                                    value={empresa.nomeEmpresarial}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, nomeEmpresarial: e.target.value, })
                                    }
                                />
                            </div>

                            {/* Nome Fantasia */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Nome Fantasia
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite o nome fantasia"
                                    className="input input-bordered w-full"
                                    value={empresa.nomeFantasia}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, nomeFantasia: e.target.value, })
                                    }
                                />
                            </div>

                            {/* CNPJ */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    CNPJ
                                </label>
                                <IMaskInput
                                    mask="00.000.000/0000-00"
                                    unmask={true}
                                    placeholder="00.000.000/0000-00"
                                    className="input input-bordered w-full"
                                    value={empresa.cnpj}
                                    onAccept={(value) =>
                                        setEmpresa({ ...empresa, cnpj: value })
                                    }
                                />
                            </div>

                            {/* Inscrição Estadual */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Inscrição Estadual
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite a inscrição estadual"
                                    className="input input-bordered w-full"
                                    value={empresa.inscricaoEstadual}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, inscricaoEstadual: e.target.value, })
                                    }
                                />
                            </div>

                            {/* Telefone */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Telefone
                                </label>
                                <IMaskInput
                                    mask="(00) 0 0000-0000"
                                    unmask={true}
                                    placeholder="(00) 0 0000-0000"
                                    className="input input-bordered w-full"
                                    value={empresa.fone}
                                    onAccept={(value) =>
                                        setEmpresa({ ...empresa, fone: value })
                                    }
                                />
                            </div>

                            {/* Telefone Alternativo */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Telefone Alternativo
                                </label>
                                <IMaskInput
                                    mask="(00) 0000-0000"
                                    unmask={true}
                                    placeholder="(00) 0000-0000"
                                    className="input input-bordered w-full"
                                    value={empresa.foneAlternativo}
                                    onAccept={(value) =>
                                        setEmpresa({ ...empresa, foneAlternativo: value })
                                    }
                                />
                            </div>

                            {/* Site */}
                            <div className="mb-4">
                                <label className="fieldset-legend">
                                    Site
                                </label>
                                <input
                                    type="text"
                                    placeholder="Digite o site da empresa"
                                    className="input input-bordered w-full"
                                    value={empresa.site}
                                    onChange={(e) =>
                                        setEmpresa({ ...empresa, site: e.target.value, })
                                    }
                                />
                            </div>

                            {/* Logo */}
                            <div className="mb-4">
                                <label className="fieldset-legend" htmlFor="logo">
                                    Logo da Empresa
                                </label>
                                <input
                                    type="file"
                                    id="logo"
                                    ref={inputLogo}
                                    accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                                    onChange={handleLogoChange}
                                    className="file-input file-input-bordered w-full"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Formatos aceitos: PNG, JPG, JPEG e WEBP, com até 2 MB.
                                </p>

                                {/* Visualização da logo selecionada */}
                                {preview && (

                                    <div className="mt-4">

                                        <p className="text-sm font-semibold text-gray-600 mb-2">
                                            Pré-visualização da logo:
                                        </p>

                                        <img
                                            src={preview}
                                            alt="Pré-visualização da logo da empresa"
                                            className="w-40 h-40 object-contain border border-gray-300 rounded-lg p-2"
                                        />

                                    </div>

                                )}

                                {/* Visualização da logo já cadastrada */}
                                {!preview && logoCadastrada && (

                                    <div className="mt-4">

                                        <p className="text-sm font-semibold text-gray-600 mb-2">
                                            Logo cadastrada:
                                        </p>

                                        <img
                                            src={`/imagens_cadastradas/${encodeURIComponent(logoCadastrada)}`}
                                            alt="Logo da empresa"
                                            className="w-40 h-40 object-contain border border-gray-300 rounded-lg p-2"
                                        />

                                    </div>

                                )}
                            </div>

                            {/* Botões */}
                            <div className="flex justify-between mt-10">
                                <BackButton destino="/empresa" />
                                <SaveButton save={salvar} />
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}