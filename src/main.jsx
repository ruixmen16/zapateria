import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import CrearCliente from './routes/CrearCliente.jsx';
import ModificarCliente from './routes/ModificarCliente.jsx';
import CrearProducto from './routes/CrearProducto.jsx';
import ModificarProducto from './routes/ModificarProducto.jsx';
import DiarioVentas from './routes/DiarioVentas.jsx';
import Configurables from './routes/Configurables.jsx';
import Inventario from './routes/Inventario.jsx';
import Movimientos from './routes/Movimientos.jsx';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from './layout.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout> <DiarioVentas /></Layout>,
    errorElement: <ErrorPage />,
  }, {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,

  }
  
  , {
    path: "/crearcliente",
    element: <Layout> <CrearCliente /></Layout>,
    errorElement: <ErrorPage />,

  }
  , {
    path: "/modificarcliente",
    element: <Layout>  <ModificarCliente /></Layout>,
    errorElement: <ErrorPage />,


  }
  , {
    path: "/crearproducto",
    element: <Layout> <CrearProducto /></Layout>,
    errorElement: <ErrorPage />,

  }
  , {
    path: "/modificarproducto",
    element: <Layout> <ModificarProducto /></Layout>,
    errorElement: <ErrorPage />,

  }
  
  , 
  {
    path: "/diarioventas",
    element: <Layout> <DiarioVentas /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/configurables",
    element: <Layout> <Configurables /></Layout>,
    errorElement: <ErrorPage />,

  }, , {
    path: "/inventario",
    element: <Layout> <Inventario /></Layout>,
    errorElement: <ErrorPage />,

  }, {
    path: "/movimientos",
    element: <Layout> <Movimientos /></Layout>,
    errorElement: <ErrorPage />,

  }
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <RouterProvider router={router} />
  </React.StrictMode>,
)
