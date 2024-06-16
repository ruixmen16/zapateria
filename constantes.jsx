export const URL_DOMINIO = 'https://controlsoft.app/'
export const select_dia = [
    { value: '1', label: 'LUNES' },
    { value: '2', label: 'MARTES' },
    { value: '3', label: 'MIERCOLES' },
    { value: '4', label: 'JUEVES' },
    { value: '5', label: 'VIERNES' },
    { value: '6', label: 'SABADO' },
    { value: '7', label: 'DOMINGO' }
]
export const select_tipo_musculo = [
    { value: '1', label: 'HOMBROS' },
    { value: '2', label: 'BICEPS' },
    { value: '3', label: 'TRICEPS' },
    { value: '4', label: 'ESPALDA' },
    { value: '5', label: 'ANTEBRAZOS' },
    { value: '6', label: 'CUADRICEP' },
    { value: '7', label: 'FEMORAL' },
    { value: '8', label: 'GLUTEO' },
    { value: '9', label: 'PANTORILLA' },
    { value: '10', label: 'PECHO' },
]
export const TipoIdentificacion = [
    {
        "value": "R", //04
        "label": "Ruc",
    },
    {
        "value": "C", //05
        "label": "Cédula",
    },
    {
        "value": "P", //06
        "label": "Pasaporte",
    },
    {
        "value": "O", //07
        "label": "Otros",
    },
    {
        "value": "F", //08
        "label": "Consumidor final",
    }
    // {
    //     "value": "09", //09
    //     "label": "Placa",
    // }
]
export const TipoPago = [
    {
        "value": "1",
        "codigo": "1",
        "codigo_sri": "01",
        "periodo": "010",
        "nombre_tipo_pago": "EFECTIVO",
        "label": "EFECTIVO",
        "tipo": "VE",
        "nombre_fp_sri": "SIN UTILIZACION DEL SISTEMA FINANCIERO"
    },
    {
        "value": "6",
        "codigo": "6",
        "codigo_sri": "19",
        "periodo": "010",
        "nombre_tipo_pago": "TARJETA DE CREDITO",
        "label": "TARJETA DE CREDITO",
        "tipo": "VE",
        "nombre_fp_sri": "TARJETA DE CREDITO"
    },
    {
        "value": "11",
        "codigo": "11",
        "codigo_sri": "20",
        "periodo": "010",
        "nombre_tipo_pago": "DEPOSITOS BANCARIOS",
        "label": "DEPOSITOS BANCARIOS",
        "tipo": "VE",
        "nombre_fp_sri": "OTROS CON UTILIZACION DEL SISTEMA FINANC"
    },
    {
        "value": "14",
        "codigo": "14",
        "codigo_sri": "20",
        "periodo": "010",
        "nombre_tipo_pago": "TRANSFERENCIA BANCARIA",
        "label": "TRANSFERENCIA BANCARIA",
        "tipo": "VE",
        "nombre_fp_sri": "OTROS CON UTILIZACION DEL SISTEMA FINANC"
    },
    {
        "value": "15",
        "codigo": "15",
        "codigo_sri": "01",
        "periodo": "010",
        "nombre_tipo_pago": "NOTA DE CREDITO",
        "label": "NOTA DE CREDITO",
        "tipo": "VE",
        "nombre_fp_sri": "SIN UTILIZACION DEL SISTEMA FINANCIERO"
    },
    {
        "value": "18",
        "codigo": "18",
        "codigo_sri": "01",
        "periodo": "010",
        "nombre_tipo_pago": "RETENCION DE LA FUENTE",
        "label": "RETENCION DE LA FUENTE",
        "tipo": "VE",
        "nombre_fp_sri": "SIN UTILIZACION DEL SISTEMA FINANCIERO"
    },
    {
        "value": "19",
        "codigo": "19",
        "codigo_sri": "01",
        "periodo": "010",
        "nombre_tipo_pago": "RETENCION IVA",
        "label": "RETENCION IVA",
        "tipo": "VE",
        "nombre_fp_sri": "SIN UTILIZACION DEL SISTEMA FINANCIERO"
    },
    {
        "value": "22",
        "codigo": "22",
        "codigo_sri": "16",
        "periodo": "010",
        "nombre_tipo_pago": "TARJETA DEBITO",
        "label": "TARJETA DEBITO",
        "tipo": "VE",
        "nombre_fp_sri": "TARJETA DE DEBITO"
    },
    {
        "value": "24",
        "codigo": "24",
        "codigo_sri": "01",
        "periodo": "010",
        "nombre_tipo_pago": "PROMOCIONES ",
        "label": "PROMOCIONES ",
        "tipo": "VE",
        "nombre_fp_sri": "SIN UTILIZACION DEL SISTEMA FINANCIERO"
    },
    {
        "value": "29",
        "codigo": "29",
        "codigo_sri": "20",
        "periodo": "010",
        "nombre_tipo_pago": "CHEQUE",
        "label": "CHEQUE",
        "tipo": "VE",
        "nombre_fp_sri": "OTROS CON UTILIZACION DEL SISTEMA FINANC"
    }
]
export const MenuConstante = [
    {
        nombre: 'Diario',
        link: 'diarioventas',
        hijo: []
    },
    {
        nombre: 'Configurables',
        link: 'configurables',
        hijo: []
    },

    {
        nombre: 'Inventario',
        link: '',
        hijo: [
            {
                nombre: 'Inventario',
                link: 'inventario'
            },
            {
                nombre: 'Movimiento',
                link: 'movimientos'
            }
        ]
    },
    {
        nombre: 'Productos',
        link: '',
        hijo: [
            {
                nombre: 'Crear Producto',
                link: 'crearproducto'
            },
            {
                nombre: 'Modificar Producto',
                link: 'modificarproducto'
            }
        ]
    },
    {
        nombre: 'Usuario',
        link: '',
        hijo: [
            {
                nombre: 'Agregar usuario',
                link: 'crearcliente'
            },
            {
                nombre: 'Modificar usuario',
                link: 'modificarcliente'
            }
        ]
    }
]
export const TipoVenta = [
    {
        label: "Factura",
        value: "F"
    },
    {
        label: "Nota de venta",
        value: "N"
    }
]

const EstructuraJsonFactura = {
    token: "",
    firmaBase64: "",
    claveFirma: "",
    contribuyente: {
        identificacion: "ruc",
        direccion: "direccion",
        obliga_contabilidad: "S | N",
        n_resolucion: "",
        es_agente_retencion: "S | N",
        resolucion_age_retencion: "N° de resolucion, es obligatorio",
        es_rimpe: "'P'|| 'R'  || 'N' ",
        ubicacion: "direccion del establecimiento",
        nombre_comercial: "nombre comercial",
        ambiente: " '1' para el ambiente de produccion  || '2' para el ambiente de pruebas",
        codDoc: "01",
    },
    factura: {
        fechaEmision: "YYYY-MM-DD",
        establecimiento: "001",
        punto: "003",
        secuencia: "10",
        TipoIdentificacion: "'C':cedula || 'R': ruc || 'P':pasaporte || 'O':otros || 'F': consumido final",
        identificacionCliente: "consumidoFinal:9999999999999 || cualquier tipo de identificacion",
        nombreCliente: "",
        direcicionCliente: "S/D",
    },
    productos: [{
        codigo: "codigo unico del producto",
        nombreProducto: "nombre del producto",
        porcentajeIva: "porcentaje iva respuesta: 0 || 12 || 8 ",
        precioUnitario: "precio sin iva del producto",
        cantidad: "cantidad de productos, esto debe ser mayor a 0",
        porcentajeDescuento: "porcentaje de descuento, si no tiene descuento enviar 0",
        informacionAdicional1: "",
        informacionAdicional2: "",
    }],

    formaPago: [
        {
            codigoSri: "son los codigos ya acordado",
            total: "total del pago"
        }
    ],
    informacionAdicion: []
}


const jsonRod = {
    contribuyente: {

        obliga_contabilidad: "en caso de ser obligado a llevar contabilidad respuesta: S | N",
        n_resolucion: "si es contribuyente especia en caso de no se puede enviar null o vacio",
        es_agente_retencion: "en caso de ser agente de retencion, respuesta: S | N",
        resolucion_age_retencion: "si es agente de retencion tiene que poner el N° de resolucion, es obligatorio",
        es_rimpe: "en caso de ser rimpe tiene que enviar: 'P' si es NEGOCIO POPULAR || 'R' si es RÉGIMEN RIMPE  || 'N' si no es rimpe",
        ubicacion: "direccion del establecimiento",
        nombre_comercial: "nombre comercial de la empresa si no tiene enviar la misma razon social",
        ambiente: " '1' para el ambiente de produccion  || '2' para el ambiente de pruebas",
        codDoc: "codigo del documento, como es factura enviar '01' siempre",
    },
    factura: {
        fechaEmision: "fecha de la factura, formato: YYYY-MM-DD",
        establecimiento: "001 siempre 3 digitos",
        punto: "003 siempre 3 digitos",
        secuencia: "10",
        TipoIdentificacion: "'C':cedula || 'R': ruc || 'P':pasaporte || 'O':otros || 'F': consumido final",
        identificacionCliente: "consumidoFinal:9999999999999 || cualquier tipo de identificacion",
        nombreCliente: "nombre del cliente ||  empresa  || 'CONSUMIDOR FINAL' en caso de ser consumido final",
        direcicionCliente: "direccion del cliente || emrpresa || S/D",
    }

}