import { BrowserRouter, Route, Routes } from "react-router-dom";

import ClienteForm from "../features/cliente/page/ClienteForm";
import ClientePage from "../features/cliente/page/ClientePage";

import EmpresaForm from "../features/cliente/page/EmpresaForm";
import EmpresaPage from "../features/cliente/page/EmpresaPage";

import ProdutoForm from "../features/cliente/page/ProdutoForm";
import ProdutoPage from "../features/cliente/page/ProdutoPage";

import Home from "../features/home/page/Home";

export default function Router() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/home" element={<Home />} />

                <Route path="/cliente" element={<ClientePage />} />
                <Route path="/cliente-form" element={<ClienteForm />} />

                <Route path="/empresa" element={<EmpresaPage />} />
                <Route path="/empresa-form" element={<EmpresaForm />} />

                <Route path="/produto" element={<ProdutoPage />} />
                <Route path="/produto-form" element={<ProdutoForm />} />

            </Routes>

        </BrowserRouter>

    );
}