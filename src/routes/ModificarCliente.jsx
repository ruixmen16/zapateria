import { useEffect, useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Post from "../peticiones/Post"
import { minusculaAcentos } from "../funciones/funciones"
import { TipoIdentificacion } from "../../constantes"
function ModificarCliente() {
    const [cargando, setCargando] = useState(false)
    const [clientes, setClientes] = useState([])
    const [mensaje, setMensaje] = useState('')


    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const valoresInicialesFormData = {
        id: '',
        cedula: '',
        nombres: '',
        apellidos: '',
        correo: '',
        numero: 0,
        TipoIdentificacion: ''
    };
    const [formData, setFormData] = useState(valoresInicialesFormData);


    const ObtenerClientes = async () => {
        setCargando(true)
        const resp = await Post('API/obtener_clientes.php')
        setCargando(false)

        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        try {
            setClientes(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
    }
    useEffect(() => {

        ObtenerClientes()
    }, [])

    const ModificarCliente = async (event) => {
        event.preventDefault(); // Prevent default form submission




        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)

        const infomracion = new FormData(event.target);


        const id = infomracion.get('id');

        if (id === "") {
            setMensaje("Debe escoger una persona para moder actualizar los datos")
            setMostrarMensaje(true)
            return
        }







        infomracion.append('id_cambio', datos.id);




        setCargando(true)
        const resp = await Post('API/modificar_cliente.php', infomracion)
        setCargando(false)
        console.log(resp)
        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se actualizó correctamente') {


            setFormData(valoresInicialesFormData)
            await ObtenerClientes()
        }


    }

    const MostrarEjercicio = (info) => {


        for (const key in info) {
            const value = info[key];
            if (key != 'clave') {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [key]: value
                }));
            }


        }
    }
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };


    const clientesFiltrados = clientes.filter(cliente =>

        minusculaAcentos(cliente.ordenados).includes(minusculaAcentos(filtro))

    );


    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Modificar cliente</strong></h5>
        <Row>

            <Col sm={3} >
                <Form.Group className="my-1">


                    <Form.Label><strong>Filtrar cliente por nombre:</strong></Form.Label>
                    <Form.Control
                        type="text"
                        value={filtro}
                        onChange={handleFiltroChange}
                    />
                </Form.Group>
                <Col style={{ maxHeight: 430, overflowY: "auto" }}>
                    <Table striped bordered hover responsive >
                        <thead>
                            <tr>
                                <th>NOMBRE</th>
                                <th>VER</th>


                            </tr>
                        </thead>
                        <tbody>
                            {
                                clientesFiltrados.length > 0 && clientesFiltrados.map((valor, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{valor.ordenados}</td>
                                            <td><Button onClick={() => {
                                                MostrarEjercicio(valor)
                                            }}>Ver</Button>
                                            </td>

                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </Table>
                </Col>

            </Col>
            <Col >
                <Form onSubmit={ModificarCliente}>
                    <Row >
                        <Col sm={12} className="my-1">
                            <InputGroup >
                                <Form.Control
                                    type="text"

                                    name="id"
                                    hidden
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}

                                />


                            </InputGroup>
                        </Col>
                        <Col sm={4} className="my-1">
                            <Form.Label  >
                                <strong>Tipo de identificación</strong>
                            </Form.Label>
                            <Form.Select

                                placeholder='Seleccione una opción'
                                className="form-control"
                                required
                                name='TipoIdentificacion'
                                value={formData.TipoIdentificacion} // Utiliza 'value' en lugar de 'defaultValue'
                                onChange={(e) => setFormData({ ...formData, TipoIdentificacion: e.target.value })}

                            >
                                <option value={0}>Selecciona una opción</option>
                                {TipoIdentificacion.map((valor, index) => {
                                    return (
                                        <option key={index} value={valor.value}>{valor.label}</option>

                                    )
                                })}

                            </Form.Select>
                        </Col>
                        <Col sm={4} className="my-1">
                            <Form.Label  >
                                <strong># de identificacion</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="cedula"
                                    placeholder="# de identificacion"
                                    value={formData.cedula}
                                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}

                                />
                            </InputGroup>
                        </Col>


                        <Col sm={4} className="my-1">
                            <Form.Label  >
                                <strong>Nombres</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="nombres"
                                    placeholder="Nombre del cliente"
                                    value={formData.nombres}
                                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}

                                />
                            </InputGroup>
                        </Col>
                        <Col sm={4} className="my-1">
                            <Form.Label  >
                                <strong>Apellidos</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="apellidos"
                                    placeholder="Apellidos del cliente"
                                    value={formData.apellidos}
                                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}

                                />
                            </InputGroup>
                        </Col>




                        <Col sm={4} className="my-1">
                            <Form.Label  >
                                <strong>Número</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="number"
                                    required
                                    name="numero"
                                    placeholder="Número del cliente"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}

                                />
                            </InputGroup>
                        </Col>










                        <Col sm={12} className="my-1">
                            <Button
                                style={{
                                    backgroundColor: "black",
                                    borderColor: "black",
                                    color: 'white'
                                }} className="form-control"
                                type="submit">
                                Modificar cliente
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>

        </Row>


    </>)
}
export default ModificarCliente