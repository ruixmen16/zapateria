import { useEffect, useState } from 'react';
import { Button, Card, Image, Placeholder } from 'react-bootstrap';

import Offcanvas from 'react-bootstrap/Offcanvas';
import { URL_DOMINIO } from '../../constantes';
function CanvasComidas({ show, cuerpo, setShow, informacion, ...props }) {
    const [cargando, setCargando] = useState(true)


    const prueba = () => {
        setCargando(false)


    }
    let urlImagen = URL_DOMINIO + informacion.imagen

    return (
        <>

            <Offcanvas style={{ height: '70vh' }} onShow={() => { setCargando(true) }} placement='bottom' show={show} onHide={setShow} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontSize: 16 }}>{informacion.nombre}, {informacion.calorias} cal</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body >

                    {
                        cargando && <Card >
                            <Placeholder bg="secondary" animation="wave">
                                <div style={{ height: 300 }}></div>
                            </Placeholder>
                        </Card>
                    }
                    <div
                        style={{
                            display: cargando ? 'none' : 'flex',
                            justifyContent: 'center',
                            maxHeight: 300
                        }}>
                        <Image
                            onLoad={prueba}
                            fluid
                            style={{
                                width: '100%',
                                maxHeight: 300,
                                objectFit: 'contain'
                            }}
                            src={urlImagen}
                            alt="Imagen"
                        />
                    </div>


                    <div className='row'>
                        <div className='col-6'>
                            <span><strong>Gramos</strong></span>
                            <input className='form-control' type="text" disabled readOnly value={informacion.gramos} />
                        </div>
                        <div className='col-6'>
                            <span><strong>Proteínas</strong></span>
                            <input className='form-control' type="number" disabled readOnly value={informacion.proteinas} />

                        </div>
                        <div className='col-6'>
                            <span><strong>Carbohidratos</strong></span>

                            <input className='form-control' type="number" disabled readOnly value={informacion.carbohidratos} />
                        </div>
                        <div className='col-6'>
                            <span><strong>Grasas</strong></span>

                            <input className='form-control' type="number" disabled readOnly value={informacion.grasas} />

                        </div>
                    </div>



                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
export default CanvasComidas