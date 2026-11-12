import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../../shared/services/api";
import { registerSuccessfulLoginForJwt } from "../service/authenticationService";

export default function AuthenticationForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function entrar(e) {
    e.preventDefault();

    try {
      if (email !== "" && senha !== "") {
        let authenticationDTO = {
          username: email,
          password: senha,
        };

        const response = await api.post("/api/auth", authenticationDTO);
        registerSuccessfulLoginForJwt(
          response.data.token,
          response.data.tokenExpiresIn,
        );
        navigate("/home");
      }
    } catch (erro) {
      console.log(erro);
      toast.error("Usuário e senha não encontrados.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <img alt="" src="logo-IFPE.png" width={200} />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">OxeFood</h1>

            <p className="text-gray-500 mt-2">
              Sistema de Gestão de Restaurantes
            </p>
          </div>

          <div className="divider divider-info" />

          <form onSubmit={entrar}>
            <fieldset className="fieldset w-full mb-4">
              <label className="fieldset-legend" htmlFor="email">
                Email
              </label>

              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset w-full mb-2">
              <label className="fieldset-legend" htmlFor="senha">
                Senha
              </label>

              <input
                type="password"
                id="senha"
                placeholder="Digite sua senha"
                className="input input-bordered w-full"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </fieldset>
            {/* Esqueci minha senha */}
            <div className="flex justify-end mb-6">
              <Link
                to="#"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button type="submit" className="btn btn-info w-full text-white">
              Entrar
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>OxeFood</p>
          <p className="mt-1">IFPE - Campus Jaboatão dos Guararapes</p>
        </div>
      </div>
    </div>
  );
}