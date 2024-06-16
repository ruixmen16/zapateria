import { useEffect, useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
import { minusculaAcentos } from "../funciones/funciones"
function Inventario() {
    const [cargando, setCargando] = useState(false)

    const [movimientos, setMovimientos] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [productos, setProductos] = useState([])
    const [inventario, setInventario] = useState([])
    const valoresInicialesFormData = {
        cantidad: '',
        id_producto: ''

    };
    const [formData, setFormData] = useState(valoresInicialesFormData);

    useEffect(() => {
        ObtenerProductos()
        ObtenerInventario()
        ObtenerProductosExistentes()
    }, [])
    const ObtenerProductosExistentes = async () => {

        setCargando(true)
        const resp = await Post('API/obtener_productos_existencia.php')
        setCargando(false)

        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        try {
            setMovimientos(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
        //console.log(resp)


    }
    const ObtenerProductos = async () => {

        setCargando(true)
        const resp = await Post('API/obtener_productos.php')
        setCargando(false)

        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        try {
            setProductos(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
        //console.log(resp)


    }
    const ObtenerInventario = async () => {

        setCargando(true)
        const resp = await Post('API/obtener_inventario.php')
        setCargando(false)

        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        try {
            setInventario(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
        //console.log(resp)


    }
    const select_productos = productos.map((item) => {
        return {
            value: item.id,
            label: item.nombre
        };
    })
    const [filtroExistente, setFiltroExistentes] = useState('');

    const handleFiltroExistenteChange = (e) => {
        setFiltroExistentes(e.target.value);
    };

    const movimientoFiltrado = movimientos.filter(valor =>

        minusculaAcentos(valor.nombre).includes(minusculaAcentos(filtroExistente))

    );
    const Guardar = async (event) => {
        event.preventDefault(); // Prevent default form submission



        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)

        const formulario = new FormData(event.target);
        formulario.append('id_creador', datos.id);
        setCargando(true)
        const resp = await Post('API/agregar_inventario.php', formulario)
        setCargando(false)
        console.log(resp)
        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se agregó correctamente') {

            setFormData(valoresInicialesFormData)
            const form = event.target;
            form.reset();
            await ObtenerInventario()
            await ObtenerProductosExistentes()

        }


    }
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };


    const inventarioFiltrado = inventario.filter(valor =>

        minusculaAcentos(valor.nombre_producto).includes(minusculaAcentos(filtro))

    );
    const EliminarInventario = async (id) => {

        const formulario = new FormData();

        formulario.append("id", id)
        setCargando(true)
        const resp = await Post('API/eliminar_inventario.php', formulario)
        setCargando(false)

        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se eliminó correctamente') {
            await ObtenerInventario()
            await ObtenerProductosExistentes()
        }


    }
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Agregar producto a inventario</strong></h5>
        <Row>

            <Col style={{ maxHeight: 430, overflowY: "auto" }}>
                <Form.Group className="my-1">
                    <Form.Label><strong>Filtrar producto por nombre:</strong></Form.Label>
                    <Form.Control
                        type="text"
                        value={filtro}
                        onChange={handleFiltroChange}
                    />
                </Form.Group>
                {
                    inventario.length > 0 && <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Creador</th>
                                <th>Fecha</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inventarioFiltrado.length > 0 && inventarioFiltrado.map((valor, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{valor.nombre_producto}</td>
                                            <td>{valor.cantidad}</td>
                                            <td>{valor.creador}</td>
                                            <td>{valor.fecha}</td>
                                            <td><Button className="btn btn-danger" onClick={() => {
                                                EliminarInventario(valor.id)
                                            }}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </Table>
                }

            </Col>
            <Col md={3} style={{ maxHeight: 430, overflowY: "auto" }}>
                <h5><strong>Productos en existencia</strong></h5>
                <Form.Group className="my-1">
                    <Form.Label><strong>Filtrar producto por nombre:</strong></Form.Label>
                    <Form.Control
                        type="text"
                        value={filtro}
                        onChange={handleFiltroChange}
                    />
                </Form.Group>
                {
                    movimientos.length > 0 && <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                movimientoFiltrado.length > 0 && movimientoFiltrado.map((valor, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{valor.nombre}</td>
                                            <td>{valor.cantidad_existente}</td>

                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </Table>
                }

            </Col>
            <Col md={2}>
                <Form onSubmit={Guardar}>

                    <Row >

                        <Col md={12} className="my-1">
                            <Form.Label  >
                                <strong>Productos</strong>
                            </Form.Label>
                            <InputGroup >
                                <Select
                                    placeholder='Seleccione una opción'
                                    className="form-control"
                                    required
                                    name='id_producto'

                                    value={formData.id_producto}
                                    onChange={(e) => setFormData({ ...formData, id_producto: e })}

                                    options={select_productos}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={12} className="my-1">
                            <Form.Label  >
                                <strong>Cantidad</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    name="cantidad"
                                    type="number"
                                    required
                                    step={0.01}
                                    value={formData.cantidad}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                cantidad: e.target.value
                                            })}

                                    placeholder="Cantidad del producto"
                                />
                            </InputGroup>
                        </Col>


                        <Col sm={12} className="my-1">
                            <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Guardar</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>

        </Row>


    </>)
}
export default Inventario