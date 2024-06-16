import { useEffect, useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
import { minusculaAcentos } from "../funciones/funciones"
function Movimientos() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [movimientos, setMovimientos] = useState([])
    const [productos, setProductos] = useState([])
    const valoresInicialesFormData = {
        cantidad: '',
        id_producto: '',
        tipo_movimiento: '',
        motivo: '',
    };
    const [formData, setFormData] = useState(valoresInicialesFormData);

    useEffect(() => {
        ObtenerMovimientos()
        ObtenerProductos()
    }, [])
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
    const ObtenerMovimientos = async () => {

        setCargando(true)
        const resp = await Post('API/obtener_movimientos.php')
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
    const select_productos = productos.map((item) => {
        return {
            value: item.id,
            label: item.nombre
        };
    })
    const select_tipo_movimiento = [
        {
            value: 'ENTRADA',
            label: 'ENTRADA'
        },
        {
            value: 'DEVOLUCION',
            label: 'DEVOLUCION'
        },
        {
            value: 'CORRECCION',
            label: 'CORRECCION'
        }
    ]
    const Guardar = async (event) => {
        event.preventDefault(); // Prevent default form submission



        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)

        const formulario = new FormData(event.target);
        formulario.append('id_creador', datos.id);


        if (formData.tipo_movimiento.value !== "ENTRADA") {
            let cantidad_tmp = parseInt(formData.cantidad) * -1
            formulario.set('cantidad', cantidad_tmp)
        }
        setCargando(true)
        const resp = await Post('API/guardar_movimiento.php', formulario)
        setCargando(false)

        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se agregó correctamente') {

            setFormData(valoresInicialesFormData)
            const form = event.target;
            form.reset();

            await ObtenerMovimientos()

        }


    }

    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };


    const movimientoFiltrado = movimientos.filter(valor =>

        minusculaAcentos(valor.nombre_producto).includes(minusculaAcentos(filtro))

    );
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />


        <Row>
            <Col style={{ maxHeight: 430, overflowY: "auto" }}>
                <h5><strong>Movimientos</strong></h5>
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
                                <th>Creador</th>
                                <th>Tipo movimiento</th>
                                <th>Motivo</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                movimientoFiltrado.length > 0 && movimientoFiltrado.map((valor, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{valor.nombre_producto}</td>
                                            <td>{valor.cantidad}</td>
                                            <td>{valor.creador}</td>
                                            <td>{valor.tipo_movimiento}</td>
                                            <td>{valor.motivo}</td>
                                            <td>{valor.fecha_creada}</td>

                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </Table>
                }

            </Col>

            <Col md={3}>
                <Form onSubmit={Guardar}>

                    <Row >

                        <Col md={12} className="my-1">
                            <Form.Label  >
                                <strong>Producto</strong>
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
                        <Col md={12} className="my-1">
                            <Form.Label  >
                                <strong>Tipo movimiento</strong>
                            </Form.Label>
                            <InputGroup >
                                <Select
                                    placeholder='Seleccione una opción'
                                    className="form-control"
                                    required
                                    name='tipo_movimiento'

                                    value={formData.tipo_movimiento}
                                    onChange={(e) => setFormData({ ...formData, tipo_movimiento: e })}

                                    options={select_tipo_movimiento}
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
                        <Col sm md={12} className="my-1">
                            <Form.Label  >
                                <strong>Motivo</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    name="motivo"

                                    required
                                    as='textarea'
                                    row={3}
                                    value={formData.motivo}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                motivo: e.target.value
                                            })}

                                    placeholder="Motivo del movimiento"
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
export default Movimientos