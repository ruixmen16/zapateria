import { useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
import md5 from 'md5'
import { TipoIdentificacion } from "../../constantes"
function CrearCliente() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const GuardarCliente = async (event) => {
        event.preventDefault(); // Prevent default form submission



        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)

        const formulario = new FormData(event.target);
        formulario.append('id_creador', datos.id);


        setCargando(true)
        const resp = await Post('API/crear_cliente.php', formulario)
        setCargando(false)

        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se agregó correctamente la información') {
            const form = event.target;
            form.reset();
        }

    }
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Creación de usuario</strong></h5>
        <Form onSubmit={GuardarCliente}>
            <Row >
                <Col sm={12} md={4} className="my-1">
                    <Form.Label  >
                        <strong>Tipo de identificación</strong>
                    </Form.Label>
                    <InputGroup>

                        <Select
                            placeholder='Seleccione una opción'
                            className="form-control"
                            required
                            name='TipoIdentificacion'
                            options={TipoIdentificacion}
                        />
                    </InputGroup>
                </Col>
                <Col sm={12} md={4} className="my-1">
                    <Form.Label  >
                        <strong># de identificación</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            type="number"
                            required
                            name="cedula"
                            placeholder="Cédula del cliente"
                        />
                    </InputGroup>
                </Col>

                <Col sm={12} md={4} className="my-1">
                    <Form.Label  >
                        <strong>Nombres</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            type="text"
                            required
                            name="nombres"
                            placeholder="Nombre del cliente"
                        />
                    </InputGroup>
                </Col>
                <Col sm={12} md={4} className="my-1">
                    <Form.Label  >
                        <strong>Apellidos</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            type="text"
                            required
                            name="apellidos"
                            placeholder="Apellidos del cliente"
                        />
                    </InputGroup>
                </Col>

                <Col sm={12} md={4} className="my-1">
                    <Form.Label  >
                        <strong>Número</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            type="number"
                            required
                            name="numero"
                            placeholder="Número del cliente"
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
                        type="submit">Guardar cliente</Button>
                </Col>
            </Row>
        </Form>

    </>)
}
export default CrearCliente