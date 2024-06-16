import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FloatingLabel, Form, Image } from 'react-bootstrap';
import Cargando from '../complementos/Cargando'
import Mensaje from '../complementos/Mensaje'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../peticiones/Post';
import md5 from 'md5'
import escudo from '../IMAGENES/almacen.png'
function Login() {
    const navigate = useNavigate()
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const Logear = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.target);

        // Retrieve the data using the names of the input fields
        const usuario = formData.get('usuario');
        const contrasena = formData.get('contrasena');
        const clave = md5(contrasena);//md5 de contrasena



        var datos = new FormData();

        // Agregar datos al objeto FormData
        datos.append('usuario', usuario);
        datos.append('clave', clave);

        setCargando(true)
        const respu = await Post('API/json_logear.php', datos)


        setCargando(false)


        if (respu.existe && respu.estado) {

            let tmpjson = {
                cargo: respu.cargo, id: respu.id, nombres: respu.nombres
            }
            const json = JSON.stringify(tmpjson)


            //localStorage.setItem("DatosPersona", json, new Date(Date.now() + 3600000)) // aquí le damos sólo una hora para que la variable funcione, caso contrario se cierra la sesión
            localStorage.setItem("DatosPersona", json)


            navigate('/')
            return
        } else if (respu.existe && !respu.estado) {
            setMensaje("El usuario: " + obj.nombres + " no está activo actualmente");
        } else {
            setMensaje("Usuario o contraseña incorrecta");
        }



        setMostrarMensaje(true)


    }

    useEffect(() => {

        if (localStorage.getItem("DatosPersona")) {
            navigate('/')
        }
    }, [])
    return (
        <>
            <div style={{
                backgroundImage: "url('/IMAGENES/IMAGENES/distribucion.jpg')",
                backgroundSize: 'cover', textAlign: 'center',

            }}>
                <div className='container'
                    style={{

                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh'


                    }}
                >
                    <div style={{ maxWidth: 300, border: '1px solid gray', padding: 20, borderRadius: 30, backgroundColor: 'rgba(200, 200, 200, 0.3)' }}>
                        <Form onSubmit={Logear} style={{ textAlign: 'left' }}>
                            {<div>
                                <Image fluid src={escudo} style={{ marginBottom: 10 }}></Image>

                            </div>}

                            <FloatingLabel
                                label="Usuario"
                                className="mb-3"
                            >
                                <Form.Control type="text" name='usuario' required placeholder="Ingrese usuario" />
                            </FloatingLabel>



                            <FloatingLabel
                                label="Clave"
                                className="mb-3"
                            >
                                <Form.Control type="password" name='contrasena' required placeholder="Ingrese contraseña" />
                            </FloatingLabel>

                            <Form.Group className="mb-3">
                                <Button type='submit' style={{ fontSize: 18, backgroundColor: 'black', borderColor: "black" }} className='form-control'>Ingresar</Button>

                            </Form.Group>
                        </Form>


                    </div>

                </div >
            </div>
            <Cargando show={cargando} />
            <Mensaje tipo="informacion" mensaje={mensaje} show={mostrarMensaje} setShow={setMostrarMensaje} />


        </>

    );
}

export default Login