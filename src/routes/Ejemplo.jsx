import { useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../complementos/Nav"
import { Col, Container, Row } from "react-bootstrap"

function Ejemplo() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    return (<>
        <MenuSuperior ></MenuSuperior>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />
        <Container >
            <Row >
                <Col sm md={4} style={{ backgroundColor: 'blue' }}>izquierda</Col>
                <Col sm md={8}>derecha</Col>

            </Row>

        </Container>
    </>)
}
export default Ejemplo