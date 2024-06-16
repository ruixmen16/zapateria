import axios from 'axios'
import { URL_DOMINIO } from '../../constantes'

export const Get = async (url, parametros) => {
    try {
        const token = localStorage.getItem('token')
        const urlConParametros = new URL(URL_DOMINIO + url)
        if (parametros) {
            Object.keys(parametros).forEach(key => urlConParametros.searchParams.append(key, parametros[key]))
        }

        const response = await axios.get(urlConParametros.toString(), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        //console.error('Error obteniendo los datos:', error)
        return error
    }
}
export default Get
