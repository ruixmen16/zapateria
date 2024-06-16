import { useEffect, useRef, useState } from "react"
import Cargando from "../complementos/Cargando"
import Mensaje from "../complementos/Mensaje"
import MenuSuperior from "../Menu/MenuIzquierdo"
import { Accordion, Button, Col, Container, Form, Image, InputGroup, Row, Table } from "react-bootstrap"
import Select from 'react-select'
import Post from "../peticiones/Post"
import { select_dia, select_tipo_musculo } from "../../constantes"
import eliminar from '../IMAGENES/borrar.png'
export default function RutinaCliente() {
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const itemRefsRutina = useRef([]);

    const [clientes, setClientes] = useState([])
    const [ejercicio, setEjercicio] = useState([])
    const [rutina, setRutina] = useState([])

    const iniciales = {
        id_rutina: 0,
        select_clientes: '',
        select_tipo_musculo: '',
        select_dia: '',
        select_ejercicio: '',
        desde: '',
        hasta: '',
        sets: '',
        repeticiones: '',
    };
    const [formData, setFormData] = useState(iniciales);


    useEffect(() => {
        const ObtenerClientes = async () => {

            setCargando(true)
            const resp = await Post('API/obtener_clientes.php')
            setCargando(false)

            resp.map(item => {
                item.value = item.id
                item.label = item.ordenados
            })
            setClientes(resp)
        }
        ObtenerClientes()
    }, [])
    const ObtenerEJercicioByTipoMusculo = async (e) => {
        setFormData({ ...formData, select_tipo_musculo: e })
        var formulario = new FormData()
        formulario.append("id", e.value)
        setCargando(true)
        const resp = await Post('API/json_obtener_ejercicio_by_tipo_musculo.php', formulario)
        setCargando(false)

        resp.map(item => {
            item.value = item.id
            item.label = item.nombre
        })
        setEjercicio(resp)
    }
    const EliminarRutina = async (item) => {

        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)


        const formulario = new FormData();
        formulario.append("id_rutina", item.id)
        formulario.append("id_creador", datos.id)



        setCargando(true)
        const resp = await Post('API/eliminar_rutina.php', formulario)
        setCargando(false)


        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se eliminó correctamente') {
            await ObtenerRutinaByPersonaFecha()

        }


    }

    const ObtenerRutinaByPersonaFecha = async (e) => {

        if (e !== undefined) {
            setFormData({ ...formData, hasta: e.target.value })
        }

        if (formData.select_clientes.value === '' || formData.select_dia.value === '' || formData.select_tipo_musculo.value === '' ||
            formData.select_ejercicio.value === '' || formData.desde === '' || formData.hasta === '') {
            return
        }


        var formulario = new FormData()
        formulario.append("id_persona", formData.select_clientes.value)
        formulario.append("dia", formData.select_dia.value)

        if (e === undefined) {

            formulario.append("hasta", formData.hasta)
        } else {
            formulario.append("hasta", e.target.value)
        }

        formulario.append("desde", formData.desde)
        setCargando(true)
        const resp = await Post('API/json_obtener_rutina_dia.php', formulario)
        setCargando(false)

        if (resp?.code === 'ERR_NETWORK') {
            setMensaje('Error al obtener los datos, intente luego')
            setMostrarMensaje(true)
            //setMostrarMensaje(true)
            return
        }



        if (resp.length > 0) {

            let arrayPecho = []
            let arrayHombros = []
            let arrayBiceps = []
            let arrayTriceps = []
            let arrayEspalda = []
            let arrayAntebrazsos = []
            let arrayCuadriceps = []
            let arrayFemoral = []
            let arrayGluteo = []
            let arrayPantorrilla = []
            const tipoEjercicioMap = {
                'PECHO': arrayPecho,
                'HOMBROS': arrayHombros,
                'BICEPS': arrayBiceps,
                'TRICEPS': arrayTriceps,
                'ESPALDA': arrayEspalda,
                'ANTEBRAZOS': arrayAntebrazsos,
                'CUADRICEP': arrayCuadriceps,
                'FEMORAL': arrayFemoral,
                'GLUTEO': arrayGluteo,
                'PANTORRILLA': arrayPantorrilla
            };
            resp.forEach(valor => {
                const arrayEjercicio = tipoEjercicioMap[valor.musculo];
                if (arrayEjercicio) {
                    arrayEjercicio.push({
                        id: valor.id,
                        tipo: valor.musculo,
                        nombre: valor.nombre,
                        sets: valor.sets,
                        repeticiones: valor.repeticiones,
                        desde: valor.desde,
                        hasta: valor.hasta,
                        comentario: valor.comentario,
                    });
                }

            });


            let arrayRutina = []
            for (const [etiqueta, array] of Object.entries(tipoEjercicioMap)) {
                if (array.length > 0) {
                    arrayRutina.push({
                        papa: etiqueta,
                        hijos: array
                    });
                }
            }
            setRutina(arrayRutina)
        }
        //


    }

    const GuardarRutina = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const DatosPersona = localStorage.getItem("DatosPersona")
        const datos = JSON.parse(DatosPersona)


        const formulario = new FormData(event.target);
        formulario.append("id_creador", datos.id)
        formulario.append("id_persona", formData.select_clientes.value)
        formulario.append("dias", formData.select_dia.value)
        formulario.append("id_musculo", formData.select_tipo_musculo.value)
        formulario.append("id_ejercicio", formData.select_ejercicio.value)


        setCargando(true)
        const resp = await Post('API/crear_rutina.php', formulario)
        setCargando(false)


        setMensaje(resp)
        setMostrarMensaje(true)

        if (resp === 'Se agregó correctamente') {
            await ObtenerRutinaByPersonaFecha()

        }


    }

    const SetFormulario = (info) => {
        for (const key in info) {
            const value = info[key];
            setFormData((prevFormData) => ({
                ...prevFormData,
                [key]: value
            }));
        }
    }
    const handleAccordionItemClickRutina = (index) => {
        if (itemRefsRutina.current[index]) {
            itemRefsRutina.current[index].scrollIntoView({
                behavior: 'smooth', // Puedes cambiar a 'auto' si prefieres un desplazamiento más abrupto
                block: 'center' // Asegura que el inicio del elemento esté en la parte superior de la ventana
            });
            itemRefsRutina.current[index].focus(); // Hace autofocus en el elemento
        }
    };
    return (<>

        <Cargando show={cargando} />
        <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />

        <h5><strong>Crear rutina</strong></h5>
        <Row>
            <Col sm={6}>
                <Form onSubmit={GuardarRutina}>
                    <Row >
                        <Col >
                            <Row>
                                <Col>
                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Seleccione un cliente</strong></Form.Label>
                                        <Select
                                            placeholder='Seleccione un cliente'
                                            className="form-control"
                                            required
                                            value={formData.select_clientes}
                                            options={clientes}
                                            onChange={(e) => setFormData({ ...formData, select_clientes: e })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>

                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Día</strong></Form.Label>
                                        <Select
                                            placeholder='Seleccione día'
                                            className="form-control"
                                            required
                                            value={formData.select_dia}
                                            options={select_dia}
                                            onChange={(e) => setFormData({ ...formData, select_dia: e })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Tipos de músculo</strong></Form.Label>
                                        <Select
                                            placeholder='Seleccione tipo de músculo'
                                            className="form-control"
                                            required
                                            value={formData.select_tipo_musculo}
                                            options={select_tipo_musculo}
                                            onChange={
                                                (e) => ObtenerEJercicioByTipoMusculo(e)
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Ejercicio</strong></Form.Label>
                                        <Select
                                            placeholder='Seleccione un ejercicio'
                                            className="form-control"
                                            required
                                            value={formData.select_ejercicio}
                                            options={ejercicio}
                                            onChange={(e) => setFormData({ ...formData, select_ejercicio: e })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>



                            <Row>
                                <Col>
                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Sets</strong></Form.Label>
                                        <InputGroup>

                                            <Form.Control
                                                type="number"
                                                required
                                                name="sets"
                                                value={formData.sets}
                                                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Repeticiones</strong></Form.Label>
                                        <InputGroup>

                                            <Form.Control
                                                type="number"
                                                required
                                                name="repeticiones"
                                                value={formData.repeticiones}
                                                onChange={(e) => setFormData({ ...formData, repeticiones: e.target.value })}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Desde</strong></Form.Label>
                                        <InputGroup>

                                            <Form.Control
                                                type="date"
                                                required
                                                name="desde"
                                                value={formData.desde}
                                                onChange={(e) => setFormData({ ...formData, desde: e.target.value })}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="my-1">
                                        <Form.Label><strong>Hasta</strong></Form.Label>
                                        <InputGroup>

                                            <Form.Control
                                                type="date"
                                                required
                                                name="hasta"
                                                value={formData.hasta}
                                                onChange={
                                                    (e) => ObtenerRutinaByPersonaFecha(e)
                                                }
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>



                            <Form.Group className="my-1">
                                <Form.Label><strong>Comentario</strong></Form.Label>
                                <InputGroup>

                                    <Form.Control
                                        as="textarea"
                                        required
                                        rows={3}
                                        name="comentario"
                                        placeholder="Ingrese una recomendación"
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="my-1">
                                <Button variant="dark" className="form-control" type="submit">Guardar</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col sm={6}>
                {rutina.length > 0 &&


                    <Accordion >
                        {rutina.length > 0 && (rutina.map((papa, index) => {

                            return (
                                <Accordion.Item
                                    key={index}
                                    eventKey={index}
                                    ref={ref => itemRefsRutina.current[index] = ref}
                                    onClick={() => handleAccordionItemClickRutina(index)}>
                                    <Accordion.Header>{papa.papa}</Accordion.Header>
                                    <Accordion.Body>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Series</th>
                                                    <th>Reps</th>
                                                    <th>Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {

                                                    papa.hijos.map((hijo, recorrido) => {

                                                        return (
                                                            <tr key={recorrido}>
                                                                <td style={{ fontSize: 13, verticalAlign: 'middle' }}>{hijo.nombre}</td>
                                                                <td style={{ fontSize: 13, textAlign: 'right', verticalAlign: 'middle' }}>{hijo.sets}</td>
                                                                <td style={{ fontSize: 13, textAlign: 'right', verticalAlign: 'middle' }}>{hijo.repeticiones}</td>
                                                                <td style={{ fontSize: 13, textAlign: 'center', verticalAlign: 'middle' }}>
                                                                    <Image onClick={() => EliminarRutina(hijo)} fluid src={eliminar}></Image></td>

                                                            </tr>
                                                        )
                                                    }
                                                    )

                                                }
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>

                            )
                        }))
                        }
                    </Accordion>

                }
            </Col>

        </Row>

    </>)
}
