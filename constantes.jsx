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
        "value": "RUC", //04
        "label": "Ruc",
    },
    {
        "value": "CEDULA", //05
        "label": "Cédula",
    },
    {
        "value": "PASAPORTE", //06
        "label": "Pasaporte",
    },
    {
        "value": "OTROS", //07
        "label": "Otros",
    },
    {
        "value": "CONSUMIDOR FINAL", //08
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
        nombre: 'Principal',
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
