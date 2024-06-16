import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Image, Placeholder, Row, Table } from 'react-bootstrap';
import '../estilos/estilos.css'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Select from 'react-select'
import Cargando from "./Cargando"
import Mensaje from "./Mensaje"
import Post from '../peticiones/Post';
import Agregar from '../IMAGENES/agregar.png'
import CrearClienteRapido from './CrearClienteRapido';
import { TipoPago, TipoVenta } from '../../constantes';
function CanvasCrearFactura({ setProductos, cargarClientes, show, setShow, productos, suma_total, select_clientes, configurables, ...props }) {


    const [modalCliente, setModalCliente] = useState(false);
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);


    // const [idCliente, setIdCliente] = useState('')
    //const [tipoPago, setTipoPago] = useState('')

    const [efectivo, setEfectivo] = useState(0.00)
    const [suelto, setSuelto] = useState(0.00)
    const [totalSinImpuestos, setTotalSinImpuestos] = useState(0.00)
    const [impuestos, setImpuestos] = useState(0.00)

    const [totalConImpuestos, setTotalConImpuestos] = useState(0.00)

    const handleEfectivo = (e) => {

        let valorEfectivo = e.target.value
        valorEfectivo = parseFloat(valorEfectivo)
        valorEfectivo = Math.round(valorEfectivo * 100) / 100;
        let tmp_total_con_impuestos = parseFloat(totalConImpuestos)
        tmp_total_con_impuestos = Math.round(tmp_total_con_impuestos * 100) / 100;


        /*
        if (valorEfectivo > tmp_total_con_impuestos) {
            setMensaje('El valor a pagar no puede ser mayor a: ' + parseFloat(totalConImpuestos).toFixed(2))
            setMostrarMensaje(true)
            return
        }
        */
        setEfectivo(e.target.value);
        if (tmp_total_con_impuestos > valorEfectivo) {
            setSuelto(0)

            return
        }

        if (valorEfectivo >= 0) {

            let tmp = valorEfectivo - totalConImpuestos
            tmp = Math.round(tmp * 100) / 100;
            setSuelto(tmp)
        }


    };
    const handleCliente = (e) => {
        // setIdCliente(e);
    };
    const handlePago = (e) => {
        //setTipoPago(e);
    };

    useEffect(() => {

        setTotalSinImpuestos(suma_total)
        setImpuestos(suma_total * (configurables.iva / 100))
        setTotalConImpuestos(suma_total * (1 + (configurables.iva / 100)))
    }, [suma_total])

    const GuardarFactura = async (event) => {

        event.preventDefault(); // Prevent default form submission
        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)





        // suma_total debfe ser igual a la suma de 
        const formulario = new FormData(event.target);




        let cantidad_escrita = parseFloat(formulario.get('cantidad'))
        cantidad_escrita = Math.round(cantidad_escrita * 100) / 100;

        let total_a_pagar = suma_total * (1 + (configurables.iva / 100))
        total_a_pagar = Math.round(total_a_pagar * 100) / 100;



        if (cantidad_escrita > total_a_pagar) {
            formulario.set('cantidad', total_a_pagar)
        }


        formulario.append('id_creador', datos.id);
        formulario.append('total_antes_impuestos', suma_total.toFixed(2));
        formulario.append('iva', configurables.iva);
        formulario.append('impuestos', (suma_total * (configurables.iva / 100)).toFixed(2));
        formulario.append('total_con_impuestos', (total_a_pagar).toFixed(2));

        let detalle_factura = productos.map((valor) => {
            return {
                id_producto: valor.id,
                cantidad: valor.cantidad,
                descripcion: valor.nombre,
                valor_unitario: valor.precio.toFixed(2),
                descuento: valor.descuento,
                total: ((valor.precio * (valor.cantidad)) * ((100 - valor.descuento) / 100)).toFixed(2)
            }
        })



        formulario.append("detalles_factura", JSON.stringify(detalle_factura));


        setCargando(true)
        const resp = await Post('API/crear_factura.php', formulario)
        setCargando(false)



        if (resp === 'Se agregó correctamente') {


            const form = event.target;
            form.reset();
            setEfectivo(0)
            setSuelto(0)
            setProductos([])
            setShow(false)
            setMensaje('Se creó correctamente la factura')
            setMostrarMensaje(true)
        }

    }
    const AgregarCliente = () => {
        setModalCliente(true)
    }
    return (
        <>
            <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />
            <CrearClienteRapido cargarCliente={cargarClientes} setShow={setModalCliente} show={modalCliente} ></CrearClienteRapido>

            <Cargando show={cargando} />
            <Offcanvas style={{ height: '80vh' }} placement='bottom' show={show} onHide={setShow} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontSize: 16 }}>Factura</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={GuardarFactura}>
                        <Row>
                            <Col sm={3}>
                                <Row>
                                    <Col >
                                        <strong>Cliente</strong>
                                        <Select
                                            placeholder='Seleccione un cliente'

                                            required
                                            //value={idCliente}
                                            //onChange={handleCliente}
                                            name='id_cliente'
                                            options={select_clientes}
                                        /></Col>
                                    <Col md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image onClick={AgregarCliente} fluid src={Agregar}></Image>
                                    </Col>
                                </Row>

                                <strong>Tipo de pago</strong>
                                <Select
                                    placeholder='Seleccione un tipo de pago'

                                    required
                                    name='tipo_pago'
                                    //value={tipoPago}
                                    //onChange={handlePago}
                                    options={TipoPago}
                                />
                                <strong>Tipo de venta</strong>
                                <Select
                                    placeholder='Seleccione un tipo de venta'

                                    required
                                    name='tipo_venta'
                                    //value={tipoPago}
                                    //onChange={handlePago}
                                    options={TipoVenta}
                                />
                                <strong>Valor a pagar</strong>
                                <Form.Control
                                    type="number"
                                    value={efectivo}
                                    step={0.01}
                                    name='cantidad'
                                    required
                                    onChange={handleEfectivo}
                                />
                                <strong>Suelto</strong>
                                <Form.Control
                                    type="number"
                                    disabled
                                    value={suelto}
                                //onChange={handleFiltroChange}
                                />
                                <Button type="submit" className="my-2 form-control" variant="dark">Crear Factura</Button>
                            </Col>
                            <Col>
                                <Col className="my-1" style={{ maxHeight: 300, overflowY: "auto" }}>


                                    {
                                        productos.length > 0 &&
                                        <Table striped bordered hover responsive >
                                            <thead>
                                                <tr>
                                                    <th className="col-1">CANTIDAD</th>
                                                    <th className="col-3">DESCRIPCION</th>
                                                    <th className="col-1">V.UNITARIO</th>
                                                    <th className="col-1">DESCUENTO</th>
                                                    <th className="col-1">TOTAL SIN IVA</th>
                                                    <th className="col-1">IVA</th>
                                                    <th className="col-1">TOTAL CON IVA</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    productos.length > 0 && productos.map((item, index) => {
                                                        let total_sin_iva_tabla = (item.precio * (item.cantidad)) * ((100 - item.descuento) / 100)
                                                        let iva_tabla = total_sin_iva_tabla * (configurables.iva / 100)

                                                        return (
                                                            <tr key={index}>

                                                                <td style={{ verticalAlign: 'middle' }}>



                                                                    <Col style={{ display: "flex", alignItems: "center", justifyContent: 'center', }}>
                                                                        {item.cantidad}


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
                                                                <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                                                                    {item.descuento}%

                                                                </td>

                                                                <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                                                                    ${(total_sin_iva_tabla).toFixed(2)}

                                                                </td>
                                                                <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                                                                    ${(iva_tabla).toFixed(2)}

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
                                        productos.length > 0 &&
                                        <Table striped bordered hover responsive >
                                            <thead>
                                                <tr>
                                                    <th colSpan={2}>Resumen del pedido</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>Total antes de impuestos</td>
                                                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${suma_total.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>Impuestos ({configurables.iva}%)</td>
                                                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${(suma_total * (configurables.iva / 100)).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: 'left', verticalAlign: 'middle' }}><strong>Total (I.V.A incluido)</strong></td>
                                                    <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>${(suma_total * (1 + (configurables.iva / 100))).toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    }
                                </Col>
                            </Col>
                        </Row>
                    </Form>


                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
export default CanvasCrearFactura