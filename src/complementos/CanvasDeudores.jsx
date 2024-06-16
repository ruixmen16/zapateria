import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Image, InputGroup, Placeholder, Row, Table } from 'react-bootstrap';
import '../estilos/estilos.css'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Select from 'react-select'
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import ModalPagos from '../complementos/ModalHistorialPagos'
import Post from '../peticiones/Post';
import { minusculaAcentos } from '../funciones/funciones';
function CanvasDeudores({ show, setShow, ...props }) {


    const [mostrarDebe, setMostrarDebe] = useState(false)

    const buttonRef = useRef(null);
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    const [hisotrialpagos, setHistorialPagos] = useState([])

    const [mostrarModalPagos, setMostrarModalPagos] = useState(false);
    const [deudores, setDeudores] = useState([])
    const select_filtro = [
        { value: 'debe', label: 'Debe' },
        { value: 'no debe', label: 'No debe' }
    ]
    const valoresInicialesFormData = {
        select_filtro: '',
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
            'select_filtro': select_filtro[0]
        }));
        ObtenerDeudores(desde, hasta)
    }, [])
    const ObtenerDeudores = async (desde, hasta) => {

        setMostrarDebe(true)
        let formulario = new FormData()
        formulario.append('desde', desde)
        formulario.append('hasta', hasta)
        formulario.append('debe', 'debe')

        const resp = await Post('API/obtener_deudores.php', formulario)




        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        if (resp.length === 0) {
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

    const ObtenerDeudoresEvento = async (evento) => {



        evento.preventDefault(); // Prevent default form submission


        if (formData.select_filtro.value === 'no debe') {
            setMostrarDebe(false)
        } else {
            setMostrarDebe(true)
        }

        const formulario = new FormData(evento.target);
        setCargando(true)
        const resp = await Post('API/obtener_deudores.php', formulario)
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

    const AbonarDeuda = async (info) => {

        let formulario = new FormData()
        formulario.append('id_factura', info.id)
        formulario.append('cantidad', info.abono)




        if (parseFloat(info.abono) === 0) {
            setMensaje('No puede abonar una cantidad igual a 0')
            setMostrarMensaje(true)
            return
        }

        setCargando(true)
        const resp = await Post('API/crear_abonar_deuda.php', formulario)
        setCargando(false)

        setMensaje(resp)
        setMostrarMensaje(true)
        if (resp === 'Se agregó correctamente') {

            if (formData.desde === '') {

                let fecha = new Date()
                const desde = fecha.getFullYear() + "-" +
                    (fecha.getMonth() + 1) + "-" +
                    fecha.getDate();


                const hasta = fecha.getFullYear() + "-" +
                    (fecha.getMonth() + 1) + "-" +
                    fecha.getDate();
                await ObtenerDeudores(desde, hasta)
            } else {
                await ObtenerDeudores(formData.desde, formData.hasta)
            }


        }
    }
    const HistorialPagos = async (info) => {

        let formulario = new FormData()
        formulario.append('id_factura', info.id)






        setCargando(true)
        const resp = await Post('API/obtener_historial_pagos.php', formulario)
        setCargando(false)

        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }
        setHistorialPagos(resp)

        setMostrarModalPagos(true)


    }


    function validarabono(abono, deuda) {


        if (abono <= deuda) {
            return true;
        } else {
            return false;
        }
    }

    function validarAbonoInput(e, valor, index) {
        const abono = parseFloat(e.target.value);
        const deuda = parseFloat(valor.debe);


        if (abono < 0) {
            let tmp = [...deudores]
            tmp[index].abono = 0
            setDeudores(tmp);
            return
        }
        if (abono === '') {
            let tmp = [...deudores]
            tmp[index].abono = ''
            setDeudores(tmp);
            return
        }
        const isValidAbono = validarabono(abono, deuda);

        if (isValidAbono) {
            valor.abono = abono
            let tmp = [...deudores]
            tmp[index].abono = abono
            setDeudores(tmp);

        } else {
            setMensaje('El valor de abono no puede ser mayor a la deuda');
            setMostrarMensaje(true)
        }
    }
    return (
        <>
            <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

            <ModalPagos info={hisotrialpagos} boton={buttonRef} show={mostrarModalPagos} setShow={setMostrarModalPagos} />

            <Cargando show={cargando} />
            <Offcanvas style={{ height: '80vh' }} placement='bottom' show={show} onHide={setShow} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontSize: 16 }}>Deudores</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                    <Col>
                        <Row>
                            <Col className='my-1'>
                                <Form onSubmit={ObtenerDeudoresEvento}>
                                    <Row >
                                        <Col sm md={3} className="my-1">
                                            <Form.Label  >
                                                <strong>Filtro</strong>
                                            </Form.Label>
                                            <Select
                                                placeholder='Seleccione filtro'

                                                required
                                                name='debe'
                                                value={formData.select_filtro}
                                                onChange={(e) => setFormData({ ...formData, select_filtro: e })}
                                                options={select_filtro}
                                            />
                                        </Col>
                                        <Col sm md={3} className="my-1">
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
                                        <Col sm md={3} className="my-1">
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
                                        <Col sm md={3} className="my-1">
                                            <Form.Label  >
                                                <strong>Buscar</strong>
                                            </Form.Label>
                                            <Button className='form-control' variant='dark' type='submit' ref={buttonRef} >Buscar</Button>

                                        </Col>



                                    </Row>
                                </Form>
                            </Col>


                        </Row>

                        {
                            deudores.length > 0 ? <Col><Form.Group className="my-1">
                                <Form.Label><strong>Filtrar persona:</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={filtro}
                                    onChange={handleFiltroChange}
                                />
                            </Form.Group>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Total</th>

                                            {mostrarDebe && <>
                                                <th>Debe</th>
                                            </>
                                            }
                                            <th>Fecha</th>
                                            {mostrarDebe && <>
                                                <th>Cantidad</th>
                                                <th>Abonar</th>
                                            </>
                                            }

                                            <th>Historial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            deudorFiltrado.length > 0 && deudorFiltrado.map((valor, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{valor.nombre}</td>
                                                        <td style={{ textAlign: 'right' }}>{parseFloat(valor.total).toFixed(2)}</td>
                                                        {
                                                            mostrarDebe && <>
                                                                <td style={{ textAlign: 'right' }}>{parseFloat(valor.debe).toFixed(2)}</td>
                                                            </>

                                                        }
                                                        <td>{valor.fecha}</td>
                                                        {mostrarDebe && <>
                                                            <td>
                                                                <InputGroup>

                                                                    <Form.Control
                                                                        name="abono"
                                                                        type="number"
                                                                        required
                                                                        step={0.01}
                                                                        value={valor.abono}
                                                                        onChange={(e) => validarAbonoInput(e, valor, index)}

                                                                        placeholder="Cantidad del producto"
                                                                    />
                                                                </InputGroup>
                                                            </td>
                                                            <td><Button className='btn btn-info form-control' onClick={() => AbonarDeuda(valor)} >Abonar</Button></td>

                                                        </>
                                                        }
                                                        <td><Button className='btn btn-info form-control' onClick={() => HistorialPagos(valor)} >Historial</Button></td>

                                                    </tr>
                                                )
                                            })
                                        }


                                    </tbody>
                                </Table></Col> : <strong>No hay deudores</strong>
                        }</Col>

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
export default CanvasDeudores