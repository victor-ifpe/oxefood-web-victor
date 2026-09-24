import { BrowserRouter, Route, Routes } from "react-router-dom";

import ClienteForm from "../features/cliente/page/ClienteForm";
import ClientePage from "../features/cliente/page/ClientePage";

import EmpresaForm from "../features/empresa/page/EmpresaForm";
import EmpresaPage from "../features/empresa/page/EmpresaPage";

import ProdutoForm from "../features/produto/page/ProdutoForm";
import ProdutoPage from "../features/produto/page/ProdutoPage";

import Home from "../features/home/page/Home";

export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/cliente" element={<ClientePage />} />
                <Route path="/cliente-form/:idCliente?" element={<ClienteForm />} />

                <Route path="/empresa" element={<EmpresaPage />} />
                <Route path="/empresa-form/:idEmpresa?" element={<EmpresaForm />} />

                <Route path="/produto" element={<ProdutoPage />} />
                <Route path="/produto-form/:idProduto?" element={<ProdutoForm />} />

            </Routes>

        </BrowserRouter>

    );
}