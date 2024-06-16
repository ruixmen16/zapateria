import { useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
function CrearProducto() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const select_tipo_producto = [
        { value: 'PROTE', label: 'Proteína' },
        { value: 'BEBID', label: 'Bebida' },
        { value: 'CREAT', label: 'Creatina' },
        { value: 'PREWO', label: 'Pre entreno' },
        { value: 'TERMO', label: 'Termogénicos' },
        { value: 'AMINOS', label: 'Aminoácidos' }
    ]
    const GuardarProducto = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);

        setCargando(true)
        const resp = await Post('API/crear_producto.php', formData)
        setCargando(false)

        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se agregó correctamente') {
            const form = event.target;
            form.reset();
        }

    }

    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Creación de producto</strong></h5>
        <Form onSubmit={GuardarProducto}>
            <Row >
                <Col sm md={6} className="my-1">
                    <Form.Label  >
                        <strong>Tipo de producto</strong>
                    </Form.Label>
                    <InputGroup >
                        <Select
                            placeholder='Seleccione una opción'
                            className="form-control"
                            required
                            name='tipo_producto'
                            options={select_tipo_producto}
                        />


                    </InputGroup>
                </Col>
                <Col sm md={6} className="my-1">
                    <Form.Label  >
                        <strong>Nombre</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            type="text"
                            required
                            name="nombre"
                            placeholder="Nombre del producto"
                        />
                    </InputGroup>
                </Col>
                <Col sm md={12} className="my-1">
                    <Form.Label  >
                        <strong>Descripcion</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            name="descripcion"
                            as="textarea"
                            rows={4}
                            style={{ resize: "none" }}
                            required
                            placeholder="Descripción del producto"
                        />
                    </InputGroup>
                </Col>
                <Col sm md={6} className="my-1">
                    <Form.Label  >
                        <strong>Precio</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            type="number"
                            required
                            step={0.01}
                            name="precio"
                            placeholder="Precio del prodcuto"
                        />
                    </InputGroup>
                </Col>

                <Col sm className="my-1">
                    <Form.Label  >
                        <strong> Selecciona una imagen del producto</strong>
                    </Form.Label>
                    <InputGroup>

                        <Form.Control
                            type="file"
                            required
                            name="imagen"
                            accept="image/*"
                        />
                    </InputGroup>
                </Col>



                <Col sm={12} className="my-1">
                    <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Guardar producto</Button>
                </Col>
            </Row>
        </Form>

    </>)
}
export default CrearProducto