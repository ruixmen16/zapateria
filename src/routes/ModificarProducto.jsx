import { useEffect, useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
import { minusculaAcentos } from "../funciones/funciones"
function ModificarProducto() {
    const [cargando, setCargando] = useState(false)
    const [alimentos, setAlimentos] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const valoresInicialesFormData = {
        id: '',
        tipo_producto: '',
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: ''
    };
    const [formData, setFormData] = useState(valoresInicialesFormData);

    useEffect(() => {
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
            setAlimentos(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
        //console.log(resp)


    }
    const ModificarAlimento = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);

        setCargando(true)
        const resp = await Post('API/actualizar_producto.php', formData)
        setCargando(false)
        console.log(resp)
        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se actualizó correctamente') {

            setFormData(valoresInicialesFormData)

            await ObtenerProductos()

        }


    }
    const EliminarrAlimento = async (id) => {

        const formData = new FormData();

        formData.append("id", id)
        setCargando(true)
        const resp = await Post('API/eliminar_producto.php', formData)
        setCargando(false)

        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se actualizó correctamente') {
            await ObtenerProductos()
        }


    }
    const MostrarAlimentos = (info) => {


        for (const key in info) {
            const value = info[key];
            setFormData((prevFormData) => ({
                ...prevFormData,
                [key]: value
            }));

        }
    }
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };


    const alimentosFiltrados = alimentos.filter(alimento =>

        minusculaAcentos(alimento.nombre).includes(minusculaAcentos(filtro))

    );

    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Modificar producto</strong></h5>
        <Row>
            <Form.Group className="my-1">
                <Form.Label><strong>Filtrar producto por nombre:</strong></Form.Label>
                <Form.Control
                    type="text"
                    value={filtro}
                    onChange={handleFiltroChange}
                />
            </Form.Group>
            <Col sm md={4} style={{ maxHeight: 430, overflowY: "auto" }}>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th>VER</th>
                            <th>ELIMINAR</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            alimentosFiltrados.length > 0 && alimentosFiltrados.map((valor, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{valor.nombre}</td>
                                        <td><Button onClick={() => {
                                            MostrarAlimentos(valor)
                                        }}>Ver</Button>
                                        </td>
                                        <td><Button className="btn btn-danger" onClick={() => {
                                            EliminarrAlimento(valor.id)
                                        }}>Eliminar</Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }


                    </tbody>
                </Table>
            </Col>
            <Col >
                <Form onSubmit={ModificarAlimento}>
                    <Row >
                        <Col sm md={4} className="my-1">
                            <Form.Label  >
                                <strong>Tipo de producto</strong>
                            </Form.Label>
                            <InputGroup >
                                <Form.Control
                                    type="text"
                                    required
                                    name="id"
                                    hidden
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}

                                />
                                <Form.Select

                                    placeholder='Seleccione una opción'
                                    className="form-control"
                                    required
                                    name='tipo_producto'
                                    value={formData.tipo_producto} // Utiliza 'value' en lugar de 'defaultValue'
                                    onChange={(e) => setFormData({ ...formData, tipo_producto: e.target.value })}
                                >
                                    <option value="0">Selecciona una opción</option>
                                    <option value="PROTE">Proteína</option>
                                    <option value="BEBID">Bebida</option>
                                    <option value="CREAT">Creatina</option>
                                    <option value="PREWO">Pre entreno</option>
                                    <option value="TERMO">Termogénicos</option>
                                    <option value="AMINOS">Aminoácidos</option>


                                </Form.Select>



                            </InputGroup>
                        </Col>
                        <Col sm md={4} className="my-1">
                            <Form.Label  >
                                <strong>Nombre</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="nombre"
                                    placeholder="Precio del producto"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}

                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={4} className="my-1">
                            <Form.Label  >
                                <strong>Precio</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="number"
                                    required
                                    step={0.01}
                                    name="precio"
                                    value={formData.precio}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                precio: e.target.value
                                            })}
                                    placeholder="Precio del producto"
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={12} className="my-1">
                            <Form.Label  >
                                <strong>Descripción</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    name="descripcion"
                                    as="textarea"
                                    rows={4}
                                    style={{ resize: "none" }}
                                    required

                                    value={formData.descripcion}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                descripcion: e.target.value
                                            })}

                                    placeholder="Descripción del producto"
                                />
                            </InputGroup>
                        </Col>



                        <Col sm className="my-1">
                            <Form.Label  >
                                <strong> Selecciona una imagen para subir</strong>
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
                            <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Modificar Producto</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>

        </Row>


    </>)
}
export default ModificarProducto