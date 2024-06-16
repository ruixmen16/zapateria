import React, { useState } from 'react';
import MenuArriba from './Menu/MenuArriba';
import MenuIzquierdo from './Menu/MenuIzquierdo';
import { Col, Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { MenuConstante } from '../constantes';

const Layout = ({ children }) => {
    const [datos, setDatos] = useState(MenuConstante);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const handleInputChange = (event) => {


        let letra = quitartildes(event.target.value)

        setDatos(MenuConstante.filter((persona) =>
            quitartildes(persona.nombre).includes(letra) ||
            (persona.hijo && persona.hijo.some((hijo) => quitartildes(hijo.nombre).includes(letra)))
        ))
    };

    function quitartildes(letra) {

        letra = letra.toLowerCase()

        return letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return (
        <>
            <MenuArriba></MenuArriba>
            <Container fluid>
                <Row >
                    {/* Sidebar */}
                    {
                        !isMobile && <Col md={2} style={{ height: `calc(100vh - 60px)`, padding: 0 }}>
                            <Col style={{ padding: 10 }}>
                                <label htmlFor=""><strong>MENU</strong></label>
                                <input
                                    type="search"
                                    placeholder="Escriba para buscar..."
                                    className='form-control'
                                    onChange={handleInputChange}
                                />
                            </Col>

                            <MenuIzquierdo busqueda={datos} ></MenuIzquierdo>

                        </Col>
                    }

                    {/* height: `calc(100vh - 60px)` */}
                    {/* Main content area */}
                    <Col style={{ backgroundColor: 'lightgray' }} >
                    <Container fluid style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 8, padding: 10, height: 'calc(100vh - 80px)', overflowY: 'auto', overflowX: 'hidden' }}>

                            {children}
                        </Container>

                    </Col>
                </Row>
            </Container >

        </>
    );
};

export default Layout;