import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Image, InputGroup, Placeholder, Row, Table } from 'react-bootstrap';
import '../estilos/estilos.css'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import Post from '../peticiones/Post';
import imprimir from '../IMAGENES/imprimir.png'
import editar from '../IMAGENES/editar.png'
import facturar from '../IMAGENES/facturar.png'
import ModalEditarFactura from './ModalEditarFactura';
import { minusculaAcentos } from '../funciones/funciones';
function CanvasFacturas({ show, setShow, ...props }) {
    const [idFactura, setIdFactura] = useState(0)

    const [productosEscogidos, setProductosEscogidos] = useState([])
    const [modalEditarFactura, setModalEditarFactura] = useState(false)
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const [configurables, setConfigurables] = useState([])



    const [deudores, setDeudores] = useState([])
    const ref = useRef();

    const valoresInicialesFormData = {
        desde: '',
        hasta: ''
    };
    const [formData, setFormData] = useState(valoresInicialesFormData);



    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    useEffect(() => {

        let fecha = new Date()
        const desde = formatDate(fecha);
        const hasta = formatDate(fecha);



        setFormData((prevFormData) => ({
            ...prevFormData,
            'desde': desde,
            'hasta': hasta,
        }));
        ObtenerFacturas(desde, hasta)
        ObtenerConfigurables()
    }, [])
    const ObtenerConfigurables = async () => {

        const resp = await Post('API/obtener_configurables.php')




        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        try {
            setConfigurables(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
    }
    const ObtenerFacturas = async (desde, hasta) => {



        let formulario = new FormData()
        formulario.append('desde', desde)
        formulario.append('hasta', hasta)
        setCargando(true)
        const resp = await Post('API/obtener_facturas.php', formulario)
        setCargando(false)



        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }

        try {
            setDeudores(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
        //console.log(resp)


    }
    const ObtenerFacturasEvento = async (evento) => {



        evento.preventDefault(); // Prevent default form submission

        const formulario = new FormData(evento.target);
        setCargando(true)
        const resp = await Post('API/obtener_facturas.php', formulario)
        setCargando(false)

        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        if (resp.length === 0) {
            setMensaje('No hay resultado para esta búsqueda')
            setMostrarMensaje(true)
        }

        try {
            setDeudores(resp)
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
        //console.log(resp)


    }

    const [filtro, setFiltro] = useState('');

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };


    const deudorFiltrado = deudores.filter(valor =>

        minusculaAcentos(valor.nombre).includes(minusculaAcentos(filtro))

    );




    const HistorialFacturas = () => {




        let tabla = '<table>' +
            '<tr>' +
            '<th>Fecha</th>' +
            '<th>Nombre</th>' +
            '<th>Iva</th>' +
            '<th>Sin impuestos</th>' +
            '<th>Impuestos</th>' +
            '<th>Con impuestos</th>' +
            '</tr>'

        deudorFiltrado.map((valor) => {

            tabla += '<tr>' +
                '<td>' + valor.fecha + '</td>' +
                '<td>' + valor.nombre + '</td>' +
                '<td>' + valor.iva + '%</td>' +
                '<td style="text-align: right">$' + valor.total_antes_impuestos + '</td>' +
                '<td style="text-align: right">$' + valor.impuestos + '</td>' +
                '<td style="text-align: right">$' + valor.total_con_impuestos + '</td>' +
                '</tr> '
        })

        tabla += '</table>'
        return (tabla)
    }







    const Imprimir = () => {


        var mywindow = window.open('Impresiónc', 'PRINT', 'height=700,width=1100');

        var inicioHtml = '<!doctype html><html lang="en">';
        var getHead = '<head>' +
            '<meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">' +
            '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">' +
            '<style>' +
            '@page {size: A4;margin: 11mm 17mm 17mm 17mm;}' +
            '@media print {html, body {width: 210mm;height: 297mm;}}' +
            'table{width:100%;border:1px solid #ccc}' +
            'th,td{border:1px solid #ccc;padding:8px;text-align:left}' +
            '</style>' +
            '<title>Historial de factura</title>' +
            '</head >'

        var inicioBody = '<body>';
        var finBody = '</body>';


        var tabla = HistorialFacturas()
        var impresion = tabla;

        var finHtml = '</html>';
        var scripts = '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>'

        var htmlImprimir = inicioHtml + getHead + inicioBody + impresion + scripts + finBody + finHtml;
        //var htmlCompleto = getHead + impresion;


        mywindow.document.write(htmlImprimir);
        mywindow.document.close();
        mywindow.focus();

        mywindow.print();
        mywindow.close();

    }
    const DetallesFacturas = async (info) => {




        let tabla_datos_empresa = '<br><br><br><br>'
        tabla_datos_empresa += '<table>'

        tabla_datos_empresa += '<tr>'
        tabla_datos_empresa += '<td colspan="2">' + configurables[0].propietario + '</td>'
        tabla_datos_empresa += '</tr>'

        tabla_datos_empresa += '<tr>'
        tabla_datos_empresa += '<td colspan="2">' + configurables[0].nombre_empresa + '</td>'
        tabla_datos_empresa += '</tr>'

        tabla_datos_empresa += '<tr>'
        tabla_datos_empresa += '<td><strong>Dirección matriz</strong></td>'
        tabla_datos_empresa += '<td>' + configurables[0].direccion_matriz + '</td>'
        tabla_datos_empresa += '</tr>'

        tabla_datos_empresa += '<tr>'
        tabla_datos_empresa += '<td><strong>Dirección sucursal</strong></td>'
        tabla_datos_empresa += '<td>' + configurables[0].direccion_sucursal + '</td>'
        tabla_datos_empresa += '</tr>'

        tabla_datos_empresa += '<tr>'
        tabla_datos_empresa += '<td colspan="2">Obligado a llevar contabilidad: '
            + (configurables[0].obligado_contabilidad == '1' ? 'Sí' : 'No') +
            '</td>'
        tabla_datos_empresa += '</tr>'

        tabla_datos_empresa += '</table>'


        let imagen_clave_acceso = '<img src="/IMAGENES/systemec.JPG" alt="clave de acceso" width="100%" height="auto">'

        let tabla_datos_ruc = ''
        tabla_datos_ruc += '<table>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td><strong>Ruc</strong></td>'
        tabla_datos_ruc += '<td>' + configurables[0].ruc + '</td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td colspan="2"><h5><strong>FACTURA</strong></h5></td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td><strong>No.</strong></td>'
        tabla_datos_ruc += '<td>' + 5555555555555 + '</td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td colspan="2"><strong>NÚMERO DE AUTORIZACIÓN</strong></td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td colspan="2">8888888888888888888888888</td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td><strong>FECHA Y HORA DE AUTORIZACIÓN</strong></td>'
        tabla_datos_ruc += '<td>' + 'hora' + '</td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td><strong>AMBIENTE</strong></td>'
        tabla_datos_ruc += '<td>' + 'PRUEBAS' + '</td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td><strong>EMISIÓN</strong></td>'
        tabla_datos_ruc += '<td>' + 'NORMAL' + '</td>'
        tabla_datos_ruc += '</tr>'

        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td><strong>CLAVE DE ACCESO</strong></td>'
        tabla_datos_ruc += '<td>' + 'NORMAL' + '</td>'
        tabla_datos_ruc += '</tr>'



        tabla_datos_ruc += '<tr>'
        tabla_datos_ruc += '<td colspan="2">' + imagen_clave_acceso + '</td>'
        tabla_datos_ruc += '</tr>'



        tabla_datos_ruc += '</table>'



        ///////
        let formulario = new FormData()
        formulario.append('id_factura', info.id)

        setCargando(true)
        const resp = await Post('API/obtener_detalle_factura_por_id.php', formulario)
        setCargando(false)



        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }


        let imagen_empresa = '<img src="/IMAGENES/systemec.JPG" alt="imagenfactura" width="100%" height="auto">'

        let tablaDatosPersona = '<br><table>'

        tablaDatosPersona += '<tr>' +
            '<td style="text-align: left; vertical-align: middle;">Razón Social / Nombres y Apellidos:</td>' +
            '<td style="text-align: left; vertical-align: middle;">' + info.nombre + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td style="text-align: left; vertical-align: middle;">Identificación:</td>' +
            '<td style="text-align: left; vertical-align: middle;">' + info.cedula + '</td>' +
            '</tr>' +

            '<tr>' +
            '<td style="text-align: left; vertical-align: middle;">Fecha de Emisión:</td>' +
            '<td style="text-align: left; vertical-align: middle;">' + info.fecha + '</td>' +
            '</tr>'
        tablaDatosPersona += '</table>'







        let row = '<div class="row">'

        let div_izquierda = '<div class="col-6">'

        div_izquierda += imagen_empresa
        div_izquierda += tabla_datos_empresa
        div_izquierda += '</div>'

        let div_derecha = '<div class="col-6">'
        div_derecha += tabla_datos_ruc
        div_derecha += '</div>'

        row += div_izquierda + div_derecha + '</div >'


        let tabla_detalles_factura = '<br><table>' +
            '<tr style="border-top: none;">' +
            '<th>Cantidad</th>' +
            '<th>Descripcion</th>' +
            '<th>Valor unitario</th>' +
            '<th>Descuento</th>' +
            '<th>Total</th>' +
            '</tr>'


        let sumatotal = 0
        resp.map((valor) => {

            let cantidad = parseInt(valor.cantidad)
            let precio = parseFloat(valor.valor_unitario)
            let total = cantidad * precio
            let descuento = (100 - parseFloat(valor.descuento)) / 100
            sumatotal += total * descuento
            let total_precio = total * descuento
            tabla_detalles_factura += '<tr>' +
                '<td style="text-align: right">' + valor.cantidad + '</td>' +
                '<td>' + valor.descripcion + '</td>' +
                '<td style="text-align: right">$' + valor.valor_unitario + '</td>' +
                '<td style="text-align: right">' + valor.descuento + '%</td>' +
                '<td style="text-align: right">$' + total_precio + '</td>' +
                '</tr> '
        })

        tabla_detalles_factura += '</table>'

        let tabla_resumen_pedido = '<br><table>' +
            '<tr>' +
            '<th colSpan={2}>Resumen del pedido</th>' +
            '</tr>'
        tabla_resumen_pedido += '<tr>' +
            '<td style="text-align: left; vertical-align: middle;">Total antes de impuestos</td>' +
            '<td style="text-align: right; vertical-align: middle;">$' + sumatotal.toFixed(2) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align: left; vertical-align: middle;">Impuestos (' + info.iva + '}%)</td>' +
            '<td style="text-align: right; vertical-align: middle;">$' + (sumatotal * (info.iva / 100)).toFixed(2) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align: left; vertical-align: middle;"><strong>Total (I.V.A incluido)</strong></td>' +
            '<td style="text-align: right; vertical-align: middle;">$' + (sumatotal * (1 + (info.iva / 100))).toFixed(2) + '</td>' +
            '</tr>'
        tabla_resumen_pedido += '</table>'
        return (row + tablaDatosPersona + tabla_detalles_factura + tabla_resumen_pedido)
    }

    const ImprimirDetalles = async (info) => {


        var tabla = await DetallesFacturas(info)

        if (tabla === undefined) {

            setMensaje('Error de servidor')
            setMostrarMensaje(true)

            return
        }


        var mywindow = window.open('Impresiónc', 'PRINT', 'height=700,width=1100');

        var inicioHtml = '<!doctype html><html lang="en">';
        var getHead = '<head>' +
            '<meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">' +
            '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">' +
            '<style>' +
            '@page {size: A4;margin: 11mm 17mm 17mm 17mm;}' +
            '@media print {html, body {width: 210mm;height: 297mm;}}' +
            'table{width:100%;border:1px solid black}' +
            'th,td{border:1px solid black;padding:4px;text-align:left}' +
            '.row {display: flex;flex-direction: row;justify-content: space-between;}' +
            '.col-6 {flex: 1 1 50%;}' +
            '</style>' +
            '<title>Detalles de la factura fecha: ' + info.fecha + '</title>' +
            '</head >'

        var inicioBody = '<body>';
        var finBody = '</body>';




        var impresion = ''
        impresion += ''
        impresion += tabla;

        var finHtml = '</html>';
        var scripts = '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>'

        var htmlImprimir = inicioHtml + getHead + inicioBody + impresion + scripts + finBody + finHtml;
        //var htmlCompleto = getHead + impresion;

        try {
            mywindow.document.write(htmlImprimir);
            mywindow.document.close();
        } catch (error) {
            // Log any errors that occur.
            console.log('Error writing HTML to new window:', error);
        }
        setTimeout(() => {
            mywindow.focus();
            mywindow.print();
            mywindow.close();// esto es para que cuando se imprima no haya que cerrar dos veces
        }, 450);

    }
    const DatosEditarFactura = async (info) => {


        let formulario = new FormData()
        formulario.append('id_factura', info.id)

        setCargando(true)
        const resp = await Post('API/obtener_detalle_factura_por_id.php', formulario)
        setCargando(false)

        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        if (resp.length === 0) {
            setMensaje('No se encontró información, intentar luego')
            setMostrarMensaje(true)
            return
        }
        setIdFactura(info.id)
        setProductosEscogidos(resp)
        setModalEditarFactura(true)
    }

    const FacturarElectronicamente = async (valor) => {

        let formulario = new FormData()
        formulario.append('id', valor.id)

        setCargando(true)
        const resp = await Post('API/consumir_api_factura_electronica.php', formulario)
        setCargando(false)

        let debug = valor

    }

    return (
        <>
            <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

            <ModalEditarFactura desde={formData.desde} hasta={formData.hasta} funcionBuscar={ObtenerFacturas} idFactura={idFactura} configurables={configurables} show={modalEditarFactura} setShow={setModalEditarFactura} productosEscogidos={productosEscogidos} setProductosEscogidos={setProductosEscogidos}></ModalEditarFactura>
            <Cargando show={cargando} />
            <Offcanvas style={{ height: '80vh' }} placement='bottom' show={show} onHide={setShow} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontSize: 16 }}>Historial de facturas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                    <Col >
                        <Row>

                            <Col className='my-1'>
                                <Form onSubmit={ObtenerFacturasEvento}>
                                    <Row >

                                        <Col className="my-1">
                                            <Form.Label  >
                                                <strong>Desde</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                required
                                                name="desde"

                                                value={formData.desde}
                                                onChange={(e) => setFormData({ ...formData, desde: e.target.value })}

                                            />

                                        </Col>
                                        <Col className="my-1">
                                            <Form.Label  >
                                                <strong>Hasta</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                required
                                                name="hasta"

                                                value={formData.hasta}
                                                onChange={(e) => setFormData({ ...formData, hasta: e.target.value })}

                                            />

                                        </Col>
                                        <Col className="my-1">
                                            <Form.Label  >
                                                <strong>Buscar</strong>
                                            </Form.Label>
                                            <Button className='form-control' variant='dark' type='submit' >Buscar</Button>

                                        </Col>
                                        {
                                            deudores.length > 0 && <Col className="my-1">
                                                <Form.Label  >
                                                    <strong>Impimir historial</strong>
                                                </Form.Label>
                                                <Button className='form-control' variant='dark' onClick={() => Imprimir()}>Imprimir historial</Button>

                                            </Col>
                                        }




                                    </Row>
                                </Form>
                            </Col>

                        </Row>


                        {
                            deudores.length > 0 ? <Col><Form.Group className="my-1">
                                <Form.Label><strong>Filtrar factura:</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={filtro}
                                    onChange={handleFiltroChange}
                                />
                            </Form.Group>
                                <Col ref={ref}>
                                    <Table striped bordered hover responsive >
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Iva</th>
                                                <th>Sin impuestos</th>
                                                <th>Impuestos</th>
                                                <th>Total</th>
                                                <th colSpan={3}>Acción</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                deudorFiltrado.length > 0 && deudorFiltrado.map((valor, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{valor.nombre}</td>
                                                            <td>{valor.iva}%</td>
                                                            <td style={{ textAlign: 'right' }}>{valor.total_antes_impuestos}</td>
                                                            <td style={{ textAlign: 'right' }}>{valor.impuestos}</td>
                                                            <td>{valor.total_con_impuestos}</td>



                                                            <td >
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <Image onClick={async () => { await DatosEditarFactura(valor) }} fluid width={30} src={editar}></Image>

                                                                </div>

                                                            </td>
                                                            <td >
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                                    <Image onClick={async () => await ImprimirDetalles(valor)} fluid width={30} src={imprimir}></Image>
                                                                </div>
                                                            </td>
                                                            <td >
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                                    <Image onClick={async () => await FacturarElectronicamente(valor)} fluid width={30} src={facturar}></Image>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }


                                        </tbody>
                                    </Table>
                                </Col>




                            </Col> : <strong>No hay datos</strong>
                        }</Col>

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
export default CanvasFacturas