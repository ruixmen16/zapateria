import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../stilos/estilos.css'
import { Accordion, Image, Table } from 'react-bootstrap';
import GetDominio from '../peticiones/GetDominio';
import { useState } from 'react';
import Mensaje from '../complementos/Mensaje';
import Cargando from '../complementos/Cargando';
import Pagar from '../complementos/Pagar';

import imagenuno from '../imagenes/noticia1.jpg'
import imagendos from '../imagenes/noticia2.jpg'
import imagentres from '../imagenes/noticia3.jpg'
function Noticias() {
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [deudaTotal, setDeudaTotal] = useState('')
    const [datosDeuda, setDadosDeuda] = useState([])
    const ConsultarDeudas = async (event) => {
        event.preventDefault()
        setDadosDeuda([])
        setDeudaTotal('')
        const formData = new FormData(event.target);

        // Retrieve the data using the names of the input fields
        const cedula = formData.get('cedula');
        setCargando(true)
        try {
            var resp = await GetDominio('https://servicios.portoviejo.gob.ec/Deuda/api/deuda?cedularuc=' + cedula + '&empresa=0')
        } catch {
            setCargando(false)
            setDeudaTotal('No hay datos para el texto ingresado')
            //setMostrarMensaje(true)
            return

        }
        setCargando(false)
        if (resp.Resultado !== 'OK') {
            setDeudaTotal('No hay conexión por el momento, intente luego')
            //setMostrarMensaje(true)
            return
        }

        if (resp.Datos.Valor === '0') {
            setDeudaTotal('No tiene deudas con el municipio de portoviejo')
            //setMostrarMensaje(true)
            return
        }
        console.log(resp.Datos)
        const valor = parseFloat(resp.Datos.Valor)

        const decimalPlaces = 2;

        // Shifting the decimal point to the right by the desired number of decimal places
        const redondeo = Math.round(valor * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

        setDadosDeuda(resp.Datos.Detalle)

        setDeudaTotal('Su deuda total es: $' + redondeo)
    }
    const redondear = (stringvalor) => {

        if (!stringvalor) {
            return "0.00"
        }
        const valor = parseFloat(stringvalor)

        const decimalPlaces = 2;

        // Shifting the decimal point to the right by the desired number of decimal places
        const redondeo = Math.round(valor * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

        return redondeo
    }
    return (

        <>
            <Cargando show={cargando} />
            <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

            <div style={{ padding: 10 }}>
                <div className='row' style={{
                    padding: 10, border: '1px solid gray', padding: 0, margin: 0,
                    backgroundColor: 'white',
                }}>
                    <div className='col-lg-5 col-12'>

                        <form onSubmit={ConsultarDeudas}>
                            <label><strong>Cédula</strong></label>
                            <input required name='cedula' placeholder='Ingrese cédula' type="text" className='form-control' />
                            <Button type='submit' style={{ marginTop: 10 }} className='form-control'>Buscar</Button>

                        </form>
                        <p>{deudaTotal}</p>
                        <div className='col' style={{ padding: 10 }}>
                            {
                                datosDeuda.length > 0 && (
                                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                                        {

                                            datosDeuda.map((DetallePadre, indexPadre) => {

                                                return (
                                                    <Accordion.Item key={"Acordio_" + indexPadre} eventKey={indexPadre}>
                                                        <Accordion.Header className='row' style={{ padding: 0, margin: 0 }}>
                                                            <div className='col'>
                                                                {DetallePadre.Nombre}
                                                            </div>
                                                            <div className='col-' style={{ marginRight: 10 }}>
                                                                ${redondear(DetallePadre.Valor)}
                                                            </div>

                                                        </Accordion.Header>
                                                        <Accordion.Body>
                                                            <Table key={"Tabla_" + indexPadre} responsive striped bordered hover>
                                                                <thead >
                                                                    <tr style={{ fontSize: 14 }}>
                                                                        <th >C. Predial</th>
                                                                        <th>Periodo</th>
                                                                        <th style={{ textAlign: 'right' }}>Coactiva</th>
                                                                        <th style={{ textAlign: 'right' }}>Valor</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {DetallePadre.Detalle.map((DetalleHijo, indexHijo) => {
                                                                        let coactiva = redondear(DetalleHijo.Detalle.find(x => x.Nombre === 'Coactiva')?.Valor)
                                                                        let color = coactiva === '0.00' ? 'transparent' : '#FFCDD2'
                                                                        return (
                                                                            <>
                                                                                <tr style={{ fontSize: 13 }} key={"TR_" + indexHijo} >
                                                                                    <td style={{ backgroundColor: color }}>{DetalleHijo.Detalle.find(x => x.Nombre === 'ClavePredial').Valor}</td>
                                                                                    <td style={{ backgroundColor: color }}>{DetalleHijo.Detalle.find(x => x.Nombre === 'Periodo').Valor}</td>
                                                                                    <td style={{ textAlign: 'right', backgroundColor: color }}>${coactiva}</td>
                                                                                    <td style={{ textAlign: 'right', backgroundColor: color }}>${redondear(DetalleHijo.Valor)}</td>

                                                                                </tr>
                                                                            </>
                                                                        )
                                                                    })}
                                                                </tbody>
                                                            </Table>
                                                        </Accordion.Body>
                                                    </Accordion.Item>


                                                )
                                            }
                                            )
                                        }
                                    </Accordion>
                                )


                            }
                        </div>


                    </div>
                    <div className='col' style={{ padding: 10 }}>


                        {
                            datosDeuda.length > 0 &&
                            <>
                                <p><strong>Métodos de pago:</strong></p>
                                <Pagar />
                            </>
                        }


                    </div>
                </div>

            </div >





            <ul className='movies'>
                {
                    [imagenuno, imagendos, imagentres, imagenuno].map((item, index) => (

                        <div key={index} className='movie-poster'>
                            <Image fluid rounded src={item} />
                            <span><strong>Tiulo de ejemplo : {index + 1}</strong></span>
                            <p>  Texto de ejemplo: {index + 1} donde se pondrá una pequeña descripción</p>
                        </div>

                    ))
                }
            </ul>

        </ >


    );
}

export default Noticias;