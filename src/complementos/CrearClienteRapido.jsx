import { Button, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap'
import Cargando from "../complementos/Cargando"
import { useState } from 'react'
import Post from '../peticiones/Post'
import Mensaje from "../complementos/Mensaje"
import md5 from 'md5'
import { TipoIdentificacion } from '../../constantes'
import Select from 'react-select'
const CrearClienteRapido = ({ show, setShow, cargarCliente }) => {

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [cargando, setCargando] = useState(false)

    const valoresInicialesFormData = {
        tipo_cliente: '',
        cedula: '',
        nombres: '',
        apellidos: ''

    };
    const [formData, setFormData] = useState(valoresInicialesFormData);

    const GuardarClienteRapido = async (event) => {

        event.preventDefault();
        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)



        let formulario = new FormData(event.target)
        formulario.append('id_creador', datos.id);

        setCargando(true)
        const resp = await Post('API/crear_usuario_rapido.php', formulario)
        setCargando(false)


        setMensaje(resp)
        setMostrarMensaje(true)
        if (resp === 'Se agregó correctamente') {
            setFormData(valoresInicialesFormData)
            setShow(false)
            await cargarCliente()

        }





    }
    return (
        <>
            <Cargando show={cargando} />
            <Mensaje mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

            <Modal
                centered
                size="lg"
                show={show}
                onHide={() => { setShow(false) }}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crear cliente rápido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={GuardarClienteRapido}>
                        <Row>


                            <Col sm md={12} className="my-1">
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
                            <Col sm md={12} className="my-1">
                                <Form.Label  >
                                    <strong># de identificación</strong>
                                </Form.Label>
                                <InputGroup>

                                    <Form.Control
                                        type="text"
                                        required
                                        name="cedula"
                                        placeholder="Escriba cedula"
                                        value={formData.cedula}
                                        onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}

                                    />
                                </InputGroup>
                            </Col>
                            <Col sm md={12} className="my-1">
                                <Form.Label  >
                                    <strong>Nombres</strong>
                                </Form.Label>
                                <InputGroup>

                                    <Form.Control
                                        type="text"
                                        required
                                        name="nombres"
                                        placeholder="Escriba nombres"
                                        value={formData.nombres}
                                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}

                                    />
                                </InputGroup>
                            </Col>
                            <Col sm md={12} className="my-1">
                                <Form.Label  >
                                    <strong>Apellidos</strong>
                                </Form.Label>
                                <InputGroup>

                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="Escriba apellidos"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}

                                    />
                                </InputGroup>
                            </Col>
                            <Col sm md={12} className="my-1">
                                <Button className='form-control' variant='dark' type='submit'>Guardar</Button>
                            </Col>
                        </Row>
                    </Form>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => { setShow(false) }}>
                        Entiendo
                    </Button>

                </Modal.Footer>
            </Modal>

        </>
    )
}
export default CrearClienteRapido
