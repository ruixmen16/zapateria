import { Button, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap'
import Cargando from "../complementos/Cargando"
import { useState } from 'react'
import Post from '../peticiones/Post'
import Mensaje from "../complementos/Mensaje"
import md5 from 'md5'
const ModalHistorialPagos = ({ info, show, setShow, boton }) => {

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [cargando, setCargando] = useState(false)

    const valoresInicialesFormData = {
        usuario: '',
        clave: ''
    };
    const [formData, setFormData] = useState(valoresInicialesFormData);

    const EliminarPago = async (info) => {




        if (formData.usuario === '') {
            setMensaje('Debe escribir un usuario')
            setMostrarMensaje(true)
            return
        }
        if (formData.clave === '') {
            setMensaje('Debe escribir una clave')
            setMostrarMensaje(true)
            return
        }

        const clave = md5(formData.clave);//md5 de contrasena

        let formulario = new FormData()
        formulario.append('id', info.id)
        formulario.append('usuario', formData.usuario)
        formulario.append('clave', clave)

        setCargando(true)
        const resp = await Post('API/actualizar_pago.php', formulario)
        setCargando(false)


        setMensaje(resp)
        setMostrarMensaje(true)
        if (resp === 'Se actualizó correctamente') {
            setShow(false)
            boton.current.click(); // Simular un clic en el botón

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
                    <Modal.Title>Historial de pagos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Usuario</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    autoComplete="off"
                                    name="usuario"
                                    placeholder="Escriba usuario (sólo administrador)"
                                    value={formData.usuario}
                                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}

                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Clave</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="password"
                                    autoComplete="new-password"
                                    name="clave"
                                    placeholder="Escriba contraseña"
                                    value={formData.clave}
                                    onChange={(e) => setFormData({ ...formData, clave: e.target.value })}

                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cantidad</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                info.length > 0 && info.map((valor, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{valor.fecha}</td>
                                            <td style={{ textAlign: 'right' }}>{parseFloat(valor.cantidad).toFixed(2)}</td>

                                            <td><Button className='btn btn-info form-control' onClick={() => EliminarPago(valor)} >Eliminar</Button></td>

                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </Table>
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
export default ModalHistorialPagos
