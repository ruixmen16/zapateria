import { Button, Col, Form, Image, InputGroup, Modal, Row, Table } from 'react-bootstrap'
import Cargando from "../complementos/Cargando"
import { useState } from 'react'
import Post from '../peticiones/Post'
import Mensaje from "../complementos/Mensaje"
import md5 from 'md5'
import mas from '../IMAGENES/mas.png'
import menos from '../IMAGENES/menos.png'
import borrar from '../IMAGENES/borrar.png'
const ModalEditarFactura = ({ idFactura, show, setShow, productosEscogidos, setProductosEscogidos, configurables, funcionBuscar, desde, hasta }) => {

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [cargando, setCargando] = useState(false)
    const [descuentoglobal, setDescuentoGlobal] = useState(0)
    const valoresInicialesFormData = {
        usuario: '',
        clave: ''
    };


    const [formData, setFormData] = useState(valoresInicialesFormData);

    const EditarFactura = async () => {


        let datos = productosEscogidos




        let suma_total = 0
        datos.map((item) => {
            if (item.estado) {
                let cantidad = parseInt(item.cantidad)
                let precio = parseFloat(item.valor_unitario)
                let descuento = parseFloat(item.descuento)

                let total = (cantidad * precio) * ((100 - descuento) / 100);
                suma_total += total
            }
        })
        if (suma_total === 0) {
            setMensaje('No se puede realizar esta acción')
            setMostrarMensaje(true)
            return
        }

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


        const DatosPersona = localStorage.getItem("DatosPersona")
        const datosPer = JSON.parse(DatosPersona)


        let formulario = new FormData()
        formulario.append('id_factura', idFactura)
        formulario.append('usuario', formData.usuario)
        formulario.append('clave', clave)
        formulario.append('id_creador', datosPer.id);

        formulario.append("detalles_factura", JSON.stringify(datos));


        let total_a_pagar = suma_total * (1 + (configurables[0].iva / 100))
        total_a_pagar = Math.round(total_a_pagar * 100) / 100;

        formulario.append('total_antes_impuestos', suma_total.toFixed(2));
        formulario.append('iva', configurables[0].iva);
        formulario.append('impuestos', (suma_total * (configurables[0].iva / 100)).toFixed(2));
        formulario.append('total_con_impuestos', (total_a_pagar).toFixed(2));

        setCargando(true)
        const resp = await Post('API/editar_factura.php', formulario)
        setCargando(false)


        setMensaje(resp)
        setMostrarMensaje(true)
        if (resp === 'Se ha editado correctamente') {
            setShow(false)
            setFormData(valoresInicialesFormData)
            await funcionBuscar(desde, hasta)
        }





    }
    return (
        <>
            <Cargando show={cargando} />
            <Mensaje mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

            <Modal
                centered
                size="xl"
                show={show}
                onHide={() => { setShow(false) }}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar factura</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm md={4} className="my-1">
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
                        <Col sm md={4} className="my-1">
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
                        <Col className="my-1" md={4}>
                            <Form.Label  >
                                <strong>Descuento global</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="number"
                                    required
                                    name="descuentoglobal"
                                    placeholder="Desct. global"
                                    value={descuentoglobal}
                                    onChange={
                                        (e) => {

                                            if (e.target.value == "") {
                                                return
                                            }
                                            if (e.target.value > 100) {
                                                return
                                            }
                                            if (e.target.value >= 0) {
                                                setDescuentoGlobal(e.target.value)

                                                productosEscogidos.map((valor) => (
                                                    valor.descuento = e.target.value
                                                ))


                                                setProductosEscogidos([...productosEscogidos]);
                                            } else {

                                                setDescuentoGlobal(0)
                                                productosEscogidos.map((valor) => (
                                                    valor.descuento = 0
                                                ))
                                                setProductosEscogidos([...productosEscogidos]);

                                            }
                                        }
                                    }
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Col className="my-1" md={12} style={{ maxHeight: 500, overflowY: "auto" }}>
                        {
                            productosEscogidos.length > 0 &&
                            <Table striped bordered hover responsive >
                                <thead>
                                    <tr>


                                        <th className="col-1" colSpan={4}>CANTIDAD</th>

                                        <th className="col-2">DESCRIPCION</th>
                                        <th className="col-1">V.UNITARIO</th>

                                        <th className="col-1">DESCUENTO</th>

                                        <th className="col-1">TOTAL SIN IVA</th>
                                        <th className="col-1">IVA</th>
                                        <th className="col-1">TOTAL CON IVA</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        productosEscogidos.length > 0 && productosEscogidos.map((item, index) => {


                                            if (item.estado) {
                                                let precio = parseFloat(item.valor_unitario)
                                                let cantidad = parseInt(item.cantidad)
                                                let descuento = parseFloat(item.descuento)
                                                let descripcion = item.descripcion
                                                let iva = configurables[0].iva

                                                let total_Descuento = (precio * cantidad) * ((100 - descuento) / 100)
                                                let sin_Descuento = (precio * (cantidad))
                                                let iva_tabla = total_Descuento * (iva / 100)
                                                let total_sin_iva_tabla = (precio * cantidad) * ((100 - descuento) / 100)
                                                return (
                                                    <tr key={index}>

                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            <Col
                                                                onClick={() => {


                                                                    productosEscogidos[index].estado = false
                                                                    setProductosEscogidos([...productosEscogidos]);


                                                                    //productosEscogidos.splice(index, 1)
                                                                    //setProductosEscogidos([...productosEscogidos]);


                                                                }}
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',

                                                                    cursor: 'pointer'
                                                                }}>
                                                                <Image

                                                                    width={30}

                                                                    fluid
                                                                    src={borrar}

                                                                />


                                                            </Col>
                                                        </td>
                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            <Col
                                                                onClick={() => {
                                                                    if (cantidad > 1) {
                                                                        productosEscogidos[index].cantidad--
                                                                        setProductosEscogidos([...productosEscogidos]);
                                                                    }

                                                                }}
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',

                                                                    cursor: 'pointer'
                                                                }}>
                                                                <Image

                                                                    width={30}

                                                                    fluid
                                                                    src={menos}

                                                                />


                                                            </Col>
                                                        </td>
                                                        <td style={{ verticalAlign: 'middle' }}>



                                                            <Col style={{ display: "flex", alignItems: "center", justifyContent: 'center', }}>
                                                                {cantidad}


                                                            </Col>

                                                        </td>
                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            <Col
                                                                onClick={() => {
                                                                    productosEscogidos[index].cantidad++
                                                                    setProductosEscogidos([...productosEscogidos]);
                                                                }}
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',

                                                                    cursor: 'pointer'
                                                                }}>
                                                                <Image
                                                                    width={30}
                                                                    fluid
                                                                    src={mas}
                                                                />
                                                            </Col>
                                                        </td>
                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            <Row >

                                                                <Col style={{ display: "flex", alignItems: "center" }}>
                                                                    {descripcion}


                                                                </Col>

                                                            </Row>


                                                        </td>
                                                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${(precio).toFixed(2)}</td>

                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                            <input className="form-class" type="number" value={descuento} onChange={(e) => {


                                                                if (e.target.value > 100) {
                                                                    return
                                                                }
                                                                if (e.target.value == "") {
                                                                    return
                                                                }
                                                                if (e.target.value < 0) {
                                                                    return
                                                                }

                                                                if (e.target.value >= 0) {
                                                                    productosEscogidos[index].descuento = e.target.value
                                                                    setProductosEscogidos([...productosEscogidos]);
                                                                } else {
                                                                    productosEscogidos[index].descuento = 0
                                                                    setProductosEscogidos([...productosEscogidos]);
                                                                }

                                                            }} />
                                                        </td>
                                                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>$
                                                            {

                                                                (total_sin_iva_tabla).toFixed(2)
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>$
                                                            {

                                                                (total_Descuento * (iva / 100)).toFixed(2)

                                                            }
                                                        </td>

                                                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>$
                                                            {

                                                                (total_sin_iva_tabla + iva_tabla).toFixed(2)
                                                            }
                                                        </td>

                                                    </tr>
                                                )
                                            }

                                        })
                                    }


                                </tbody>
                            </Table>
                        }
                    </Col>
                    <Col className="my-1" >

                        <Button onClick={EditarFactura} className="form-control" variant="dark">Editar</Button>


                    </Col>
                </Modal.Body>

            </Modal>

        </>
    )
}
export default ModalEditarFactura
