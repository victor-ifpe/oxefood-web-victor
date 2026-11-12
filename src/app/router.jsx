import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthenticationForm from "../features/authentication/page/AuthenticationForm";

import ClienteForm from "../features/cliente/page/ClienteForm";
import ClientePage from "../features/cliente/page/ClientePage";

import EmpresaForm from "../features/empresa/page/EmpresaForm";
import EmpresaPage from "../features/empresa/page/EmpresaPage";

import ProdutoForm from "../features/produto/page/ProdutoForm";
import ProdutoPage from "../features/produto/page/ProdutoPage";

import CategoriaProdutoForm from "../features/categoriaProduto/page/CategoriaProdutoForm";
import CategoriaProdutoPage from "../features/categoriaProduto/page/CategoriaProdutoPage";

import VotoForm from "../features/voto/page/VotoForm";
import VotoPage from "../features/voto/page/VotoPage";

import EnderecoClienteForm from "../features/enderecoCliente/page/EnderecoClienteForm";
import EnderecoClientePage from "../features/enderecoCliente/page/EnderecoClientePage";

import HomePage from "../features/home/page/Home";

import ProtectedRoute from "../shared/util/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthenticationForm />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente"
          element={
            <ProtectedRoute>
              <ClientePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente-form/:idCliente?"
          element={
            <ProtectedRoute>
              <ClienteForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/empresa"
          element={
            <ProtectedRoute>
              <EmpresaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/empresa-form/:idEmpresa?"
          element={
            <ProtectedRoute>
              <EmpresaForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/produto"
          element={
            <ProtectedRoute>
              <ProdutoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/produto-form/:idProduto?"
          element={
            <ProtectedRoute>
              <ProdutoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categoria-produto"
          element={
            <ProtectedRoute>
              <CategoriaProdutoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categoria-produto-form/:idCategoriaProduto?"
          element={
            <ProtectedRoute>
              <CategoriaProdutoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voto"
          element={
            <ProtectedRoute>
              <VotoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voto-form/:idVoto?"
          element={
            <ProtectedRoute>
              <VotoForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/endereco-cliente"
          element={
            <ProtectedRoute>
              <EnderecoClientePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/endereco-cliente-form/:clienteId?/:enderecoId?"
          element={
            <ProtectedRoute>
              <EnderecoClienteForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}