import { useEffect, useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
function Configurables() {
    const [cargando, setCargando] = useState(false)

    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const valoresInicialesFormData = {
        id: '',
        establecimiento: '',
        punto: '',
        iva: '',
        mensajes_automaticos: '',
        propietario: '',
        nombre_empresa: '',
        direccion_matriz: '',
        direccion_sucursal: '',
        obligado_contabilidad: false,
        ruc: '',
        firmaelectronica: '',
        clavefirma: '',
        es_agente_retencion: false,
        n_resolucion: 1,
        es_rimpe: false,
        resolucion_age_retencion: '',
        tipo_rimpe: '',



    };
    const [formData, setFormData] = useState(valoresInicialesFormData);

    useEffect(() => {
        ObtenerConfigurables()
    }, [])
    const ObtenerConfigurables = async () => {
        setCargando(true)
        const resp = await Post('API/obtener_configurables.php')
        setCargando(false)


        if (resp.length === undefined) {
            if (resp.code == 'ERR_NETWORK') {
                setMensaje('Error de servidor: ' + resp.message)
                setMostrarMensaje(true)
            }
            return
        }

        try {
            for (const key in resp[0]) {
                const value = resp[0][key];
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [key]: value
                }));

            }
        } catch (e) {
            setMensaje('Intente nuevamente')
            setMostrarMensaje(true)
        }
    }
    const GuardarConfigurables = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);
        formData.append('firmaelectronica', base64)

        setCargando(true)
        const resp = await Post('API/actualizar_configurables.php', formData)
        setCargando(false)
        console.log(resp)
        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se actualizó correctamente') {

            setFormData(valoresInicialesFormData)
            await ObtenerConfigurables()

        }


    }

    const [base64, setBase64] = useState('')
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                // El resultado es el contenido base64
                const result = reader.result;

                setBase64(result)
                /*
                setFormData({
                    ...formData,
                    firmaelectronica: result
                })*/
            };
            reader.readAsDataURL(file);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Configurables</strong></h5>
        <Row>


            <Col >
                <Form onSubmit={GuardarConfigurables}>
                    <InputGroup>

                        <Form.Control
                            type="text"
                            required
                            name="id"
                            hidden
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}

                        />
                    </InputGroup>
                    <Row >

                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Establecimiento</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    maxLength={3}
                                    required
                                    name="establecimiento"
                                    placeholder="Valor del establecimiento"
                                    value={formData.establecimiento}
                                    onChange={(e) => setFormData({ ...formData, establecimiento: e.target.value })}

                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Punto</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    maxLength={3}
                                    required
                                    name="punto"
                                    placeholder="Valor del punto"
                                    value={formData.punto}
                                    onChange={(e) => setFormData({ ...formData, punto: e.target.value })}

                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Iva</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="number"
                                    step={0.01}
                                    required
                                    name="iva"
                                    placeholder="Valor del iva"
                                    value={formData.iva}
                                    onChange={(e) => setFormData({ ...formData, iva: e.target.value })}

                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Mensajes automáticos</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="number"
                                    required
                                    step={0.01}
                                    name="mensajes_automaticos"
                                    value={formData.mensajes_automaticos}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                mensajes_automaticos: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Propietario</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="propietario"
                                    value={formData.propietario}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                propietario: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Nombre empresa</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="nombre_empresa"
                                    value={formData.nombre_empresa}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                nombre_empresa: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Dirección matriz</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="direccion_matriz"
                                    value={formData.direccion_matriz}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                direccion_matriz: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Dirección sucursal</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="direccion_sucursal"
                                    value={formData.direccion_sucursal}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                direccion_sucursal: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={4} className="my-1">
                            <Form.Label  >
                                <strong>Obligado a llevar contabilidad</strong>
                            </Form.Label>
                            <InputGroup>


                                <Form.Check
                                    type="switch"
                                    name="obligado_contabilidad"
                                    label='Obligado a llevar contabilidad'
                                    checked={formData.obligado_contabilidad}
                                    onChange={(e) => setFormData({ ...formData, obligado_contabilidad: e.target.checked })}

                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={4} className="my-1">
                            <Form.Label  >
                                <strong>Agente de retención</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Check
                                    type="switch"
                                    name="es_agente_retencion"
                                    label='Agente de retención'
                                    checked={formData.es_agente_retencion}
                                    onChange={(e) => setFormData({ ...formData, es_agente_retencion: e.target.checked })}

                                />
                                {

                                    formData.es_agente_retencion && <>
                                        <br />

                                        <InputGroup>
                                            <Col className="my-1">
                                                <Form.Label  >
                                                    <strong>N. de resolución</strong>

                                                </Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        name="n_resolucion"
                                                        value={formData.n_resolucion}
                                                        onChange={
                                                            (e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    n_resolucion: e.target.value
                                                                })}
                                                    />
                                                </InputGroup>
                                            </Col>


                                        </InputGroup>
                                        <InputGroup>
                                            <Col className="my-1">
                                                <Form.Label  >
                                                    <strong>Contribuyente especial</strong>

                                                </Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="number"

                                                        name="resolucion_age_retencion"
                                                        value={formData.resolucion_age_retencion}
                                                        onChange={
                                                            (e) =>
                                                                setFormData({
                                                                    ...formData,
                                                                    resolucion_age_retencion: e.target.value
                                                                })}
                                                    />
                                                </InputGroup>
                                            </Col></InputGroup>


                                    </>
                                }
                            </InputGroup>

                        </Col>

                        <Col sm md={4} className="my-1">
                            <Form.Label  >
                                <strong>RIMPE</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Check
                                    type="switch"
                                    name="es_rimpe"
                                    label='RIMPE'
                                    checked={formData.es_rimpe}
                                    onChange={(e) => setFormData({ ...formData, es_rimpe: e.target.checked })}

                                />{
                                    formData.es_rimpe && <>

                                        <InputGroup>

                                            <Col className="my-1">
                                                <Form.Label  >
                                                    <strong>Elija</strong>

                                                </Form.Label>
                                                <InputGroup>
                                                    <Form.Check
                                                        type="radio"
                                                        label='POPULAR'
                                                        name="tipo_rimpe"
                                                        checked={formData.tipo_rimpe === 'P'}
                                                        value='P'
                                                        onChange={handleChange}


                                                    />

                                                    <Form.Check
                                                        type="radio"
                                                        label='EMPRENDEDOR'
                                                        name="tipo_rimpe"
                                                        checked={formData.tipo_rimpe === 'R'}
                                                        value='R'
                                                        onChange={handleChange}

                                                    />
                                                </InputGroup>
                                            </Col>

                                        </InputGroup>
                                    </>
                                }
                            </InputGroup>


                        </Col>


                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Ruc</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"
                                    required
                                    name="ruc"
                                    value={formData.ruc}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                ruc: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Firma electrónica</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="file"


                                    onChange={(e) => handleFileChange(e)}
                                />
                            </InputGroup>
                        </Col>
                        <Col sm md={6} className="my-1">
                            <Form.Label  >
                                <strong>Clave firma</strong>
                            </Form.Label>
                            <InputGroup>

                                <Form.Control
                                    type="text"

                                    name="clavefirma"
                                    value={formData.clavefirma}
                                    onChange={
                                        (e) =>
                                            setFormData({
                                                ...formData,
                                                clavefirma: e.target.value
                                            })}
                                />
                            </InputGroup>
                        </Col>

                        <Col sm={12} className="my-1">
                            <Button style={{ backgroundColor: "black", borderColor: "black", color: 'white' }} className="form-control" type="submit">Guardar</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>

        </Row>


    </>)
}
export default Configurables