import { useEffect, useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, Image, InputGroup, Row, Table } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
import mas from '../IMAGENES/mas.png'
import menos from '../IMAGENES/menos.png'
import borrar from '../IMAGENES/borrar.png'
import '../estilos/estilos.css'
import CanvasCrearFactura from '../complementos/CanvasCrearFactura'
import CanvasDeudores from '../complementos/CanvasDeudores'
import CanvasFacturas from '../complementos/CanvasFacturas'
import { URL_DOMINIO } from "../../constantes"
import { minusculaAcentos } from "../funciones/funciones"

export default function DiarioVentas() {
    const [cargando, setCargando] = useState(false)
    const [productos, setProductos] = useState([])
    const [productosEscogidos, setProductosEscogidos] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [dialogoCrearFactura, setDialogoCrearFactura] = useState(false);

    const [dialogoFacturas, setDialogoFacturas] = useState(false);
    const [dialogoDeudores, setDialogoDeudores] = useState(false);

    const [clientes, setClientes] = useState([])





    const [descuentoglobal, setDescuentoGlobal] = useState([])

    const [configurables, setConfigurables] = useState([])

    useEffect(() => {

        Llamados()

    }, [])
    const Llamados = async () => {
        setCargando(true)
        await ObtenerProductos()
        await ObtenerClientes()
        await ObtenerConfigurables()
        setCargando(false)
    }
    const ObtenerClientes = async () => {

        const resp = await Post('API/obtener_clientes.php')


        if (resp.length === undefined) {
            return
        }
        try {
            setClientes(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
    }
    const ObtenerConfigurables = async () => {

        const resp = await Post('API/obtener_configurables.php')


        if (resp.length === undefined) {
            return
        }
        try {
            setConfigurables(resp[0])
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
    }

    const ObtenerProductos = async () => {


        const resp = await Post('API/obtener_productos.php')


        if (resp.length === undefined) {
            return
        }

        try {
            setProductos(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }


    }
    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const productosFiltrados = productos.filter(producto =>

        minusculaAcentos(producto.nombre).includes(minusculaAcentos(filtro))

    );

    const AnadirListaProductos = (item) => {

        item.cantidad = 1;
        item.descuento = 0;
        setProductosEscogidos([...productosEscogidos, item])


    }

    const suma_total_productos_escogidos = productosEscogidos.reduce((acumulador, item) => {
        const cantidad = item.cantidad;
        const precio = item.precio;

        const total = (cantidad * precio) * ((100 - item.descuento) / 100);

        return acumulador + total;
    }, 0);

    const mostrarCanvasFactura = (info) => {
        setDialogoCrearFactura(true)

    };

    const select_tipo_productod = clientes.map((item) => {
        return {
            value: item.id,
            label: item.ordenados
        };
    });


    return (<>


        <CanvasCrearFactura cargarClientes={ObtenerClientes} configurables={configurables} select_clientes={select_tipo_productod} suma_total={suma_total_productos_escogidos} productos={productosEscogidos} setProductos={setProductosEscogidos} setShow={setDialogoCrearFactura} titulo="Titulo" show={dialogoCrearFactura} ></CanvasCrearFactura>
        <CanvasDeudores setShow={setDialogoDeudores} titulo="Titulo" show={dialogoDeudores} ></CanvasDeudores>
        <CanvasFacturas setShow={setDialogoFacturas} titulo="Titulo" show={dialogoFacturas} ></CanvasFacturas>


        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />
        <div style={{ marginLeft: 10, marginRight: 5 }} >

            <Row>
                <Col sm md={3} className="my-1" >
                    <Form.Group className="my-1">
                        <Form.Label><strong>Filtrar producto por nombre:</strong></Form.Label>
                        <Form.Control
                            type="search"
                            value={filtro}
                            onChange={handleFiltroChange}
                        />
                    </Form.Group>
                </Col>
                <Col className="my-1" >
                    <Form.Group className="my-1">
                        <Form.Label><strong>Productos escogidos</strong></Form.Label>

                    </Form.Group>
                    <Row>
                       
                        <Col className="my-1">
                            <Button className="form-control" variant="dark" onClick={() => {
                                setDialogoDeudores(true)
                            }
                            }>Pag. pendientes</Button>
                        </Col>
                        <Col className="my-1">
                            <Button className="form-control" variant="dark" onClick={() => {
                                setDialogoFacturas(true)
                            }
                            }>Hist. Facturas</Button>
                        </Col>

                        <Col className="my-1" md={2}>

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

                </Col>
            </Row>
            <Row >
                <Col sm md={3} className="my-1" style={{ maxHeight: 545, overflowY: "auto" }}>

                    <ul className='movies' >
                        {
                            productosFiltrados.map((item, index) => (

                                <div key={index} className='movie-poster'>


                                    <div
                                        onClick={() => AnadirListaProductos(item)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            maxHeight: 150,
                                            cursor: 'pointer'
                                        }}>
                                        <Image

                                            fluid
                                            style={{
                                                width: '100%',
                                                objectFit: 'contain'
                                            }}
                                            rounded src={URL_DOMINIO + item.imagen} />
                                    </div>
                                    <span><strong>{item.nombre}</strong></span>
                                    <p>$ {(item.precio).toFixed(2)}</p>
                                </div>

                            ))
                        }
                    </ul>
                </Col>

                <Col className="my-1" >


                    <Row>
                        <Col className="my-1" md={12} style={{ maxHeight: 500, overflowY: "auto" }}>
                            {
                                productosEscogidos.length > 0 &&
                                <Table striped bordered hover responsive >
                                    <thead>
                                        <tr>
                                            <th className="col-1">IMAGEN</th>

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

                                                let total_Descuento = (item.precio * (item.cantidad)) * ((100 - item.descuento) / 100)
                                                let sin_Descuento = (item.precio * (item.cantidad))
                                                let iva_tabla = total_Descuento * (configurables.iva / 100)
                                                let total_sin_iva_tabla = (item.precio * (item.cantidad)) * ((100 - item.descuento) / 100)
                                                return (
                                                    <tr key={index}>
                                                        {<td style={{ verticalAlign: 'middle' }}>
                                                            <div
                                                                style={{

                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    maxHeight: 50
                                                                }}>
                                                                <Image
                                                                    fluid
                                                                    style={{
                                                                        objectFit: 'contain'
                                                                    }}
                                                                    src={URL_DOMINIO + item.imagen}
                                                                    alt="Imagen"
                                                                />
                                                            </div>
                                                        </td>}
                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            <Col
                                                                onClick={() => {


                                                                    productosEscogidos.splice(index, 1)
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
                                                                    src={borrar}

                                                                />


                                                            </Col>
                                                        </td>
                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            <Col
                                                                onClick={() => {
                                                                    if (item.cantidad > 1) {
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
                                                                {item.cantidad}


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
                                                                    {item.nombre}


                                                                </Col>

                                                            </Row>


                                                        </td>
                                                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${(item.precio).toFixed(2)}</td>

                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                            <input className="form-class" type="number" value={item.descuento} onChange={(e) => {

                                                                if (e.target.value == "") {
                                                                    return
                                                                }
                                                                if (e.target.value > 100) {
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

                                                                (total_Descuento * (configurables.iva / 100)).toFixed(2)

                                                            }
                                                        </td>

                                                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>$
                                                            {

                                                                (total_sin_iva_tabla + iva_tabla).toFixed(2)
                                                            }
                                                        </td>

                                                    </tr>
                                                )
                                            })
                                        }


                                    </tbody>
                                </Table>
                            }
                        </Col>
                        <Col className="my-1" >
                            {
                                productosEscogidos.length > 0 && <Button onClick={() => {
                                    if (productosEscogidos.length) {
                                        mostrarCanvasFactura()
                                    } else {
                                        setMensaje('No ha escogido productos para mostrar factura')
                                        setMostrarMensaje(true)
                                    }

                                }}
                                    className="form-control" variant="dark">Facturar</Button>
                            }

                        </Col>
                    </Row>


                </Col>
            </Row >
            <Row>
                <Col className="my-1" >
                    {
                        productosEscogidos.length > 0 &&
                        <Table striped bordered hover responsive >
                            <thead>
                                <tr>
                                    <th colSpan={2}>Resumen del pedido</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>Total antes de impuestos</td>
                                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${suma_total_productos_escogidos.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>Impuestos ({configurables.iva}%)</td>
                                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${(suma_total_productos_escogidos * (configurables.iva / 100)).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: 'left', verticalAlign: 'middle' }}><strong>Total (I.V.A incluido)</strong></td>
                                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${(suma_total_productos_escogidos * (1 + (configurables.iva / 100))).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </Table>
                    }
                </Col>
            </Row>

        </div >
    </>)
}
