<?php
require("../DATABASE/conexion.php");
$conexion = new base();

$sql_configurables = "SELECT * FROM configurables LIMIT 1";
$resultado_configurables = $conexion->buscar($sql_configurables);

$configurables = mysqli_fetch_assoc($resultado_configurables);


/// LA INFORMACION DE LA FACTURA
$id_factura = $_POST["id"];
$sql_Factura = "SELECT * FROM facturas where id='{$id_factura}' LIMIT 1";
$resp_Factura = $conexion->buscar($sql_Factura);

$infoFactura = mysqli_fetch_assoc($resp_Factura);



/// LA SECUENCIA 

$sqlSecuencia = "select max(secuencia) as secuencia from facturas where establecimiento='{$infoFactura["establecimiento"]}' and punto ='{$infoFactura["punto"]}' and tipo_venta='F' LIMIT 1";
$respSecuencia = $conexion->buscar($sqlSecuencia);

$infoSecuencia = mysqli_fetch_assoc($respSecuencia);


/// LA INFORMACION DEL CLIENTE
$sqlCliente = "SELECT * FROM usuario where id='{$infoFactura['id_cliente']}' LIMIT 1";
$respCliente = $conexion->buscar($sqlCliente);

$infoCliente = mysqli_fetch_assoc($respCliente);

$identificacionCliente = $infoCliente['cedula'];
$TipoIdentificacion = $infoCliente['TipoIdentificacion'];
$nombreCliente = $infoCliente['apellidos'] . " " . $infoCliente['nombres'];



// json factura
date_default_timezone_set('America/Guayaquil');
//$fechaEmision = (new DateTime())->format('Y-m-d H:i:s');
$fechaEmision = (new DateTime())->format('Y-m-d');

$factura = array(
    'fechaEmision' =>  $fechaEmision, // Puedes ajustar el formato según tus necesidades
    'establecimiento' => $infoFactura["establecimiento"],
    'punto' => $infoFactura["punto"],
    'secuencia' => strval(intval($infoSecuencia["secuencia"]) + 1),
    'TipoIdentificacion' => $TipoIdentificacion, // Puedes ajustar según lo que necesites
    'identificacionCliente' => $identificacionCliente, // Puedes ajustar según lo que necesites
    'nombreCliente' => $nombreCliente,
    'direccionCliente' => 'S/D',
);


// json contribuyente
$contribuyente = array(
    'identificacion' =>  $configurables["ruc"],
    'direccion' => $configurables["direccion_matriz"],
    'obliga_contabilidad' => $configurables["obligado_contabilidad"] === "on" ? "S" : "N",
    'n_resolucion' => $configurables["n_resolucion"] !== "0" ? $configurables["n_resolucion"] : "",
    'es_agente_retencion' => $configurables["es_agente_retencion"] === "on" ? "S" : "N",
    'resolucion_age_retencion' => $configurables["es_agente_retencion"] === "on" ? $configurables["resolucion_age_retencion"] : "",
    'es_rimpe' => $configurables["es_rimpe"] === "" ? "N" : $configurables["tipo_rimpe"],
    'ubicacion' => $configurables["direccion_matriz"],
    'nombre_comercial' => $configurables["nombre_empresa"],
    'ambiente' => '2', // " '1' para el ambiente de produccion  || '2' para el ambiente de pruebas",
    'codDoc' => '01',
    'razonsocial' => $configurables["nombre_empresa"]
);
$formaPago = array(
    'codigoSri' =>  $infoFactura["tipo_pago"],
    'total' => $infoFactura["total_con_impuestos"],
);



///////// En esta parte obtendré los productos de la factura

$sql_Productos = "select * from detalle_factura where id_factura='{$id_factura}'";
$resultado_Productos = $conexion->buscar($sql_Productos);

$Productos = [];

while ($row = mysqli_fetch_array($resultado_Productos)) {
    $array = array(
        'codigo' => $row['id_producto'],
        'nombreProducto' => $row['descripcion'],
        'porcentajeIva' => $configurables['iva'],
        'precioUnitario' => $row['valor_unitario'],
        'cantidad' => $row['cantidad'],
        'porcentajeDescuento' => $row['descuento'],
        'informacionAdicional1' => "",
        'informacionAdicional2' => ""
    );

    array_push($Productos, $array);
}


$estructura = array(
    'token' => "",
    'firmaBase64' => $configurables["firmaelectronica"],
    'claveFirma' => $configurables["clavefirma"],
    'contribuyente' => $contribuyente,
    'factura' => $factura,
    'productos' => $Productos,
    'formaPago' => $formaPago,
    'informacionAdicion' => []
);
// URL de la API



$url = "https://apinavi.factureroec.com/apiSri";
$jsonData = json_encode($estructura);



// Inicializar cURL
$ch = curl_init($url);



// Configurar opciones de cURL
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));




// Deshabilitar la verificación del certificado SSL (solo para propósitos de depuración)
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Ejecutar la consulta cURL y obtener la respuesta
$response = curl_exec($ch);

// Verificar si hubo algún error
if (curl_errno($ch)) {
    echo 'Error en la solicitud cURL: ' . curl_error($ch);
}

// Cerrar la sesión cURL
curl_close($ch);

// Procesar la respuesta (puede variar según la estructura de la respuesta de la API)
$json_response = json_decode($response, true);


//echo json_encode($json_response);  
$estado = $json_response["estado"];
$error = $json_response["error"];
$fechaAutorizacion = $json_response["fechaAutorizacion"];
$xml = $json_response["xml"];
$autorizacion_sri = $json_response["autorizacion_sri"];

echo "Estado: $estado\nError: $error\n Fecha autorizacion: $fechaAutorizacion\n Xml: $xml\nAutorizacion SRI: $autorizacion_sri";
