

async function generatePCC01PDF(formData){
  const pdfMake = await import("pdfmake/build/pdfmake.js");
  const pdfFonts = await import("pdfmake/build/vfs_fonts.js");
  const docDefinition = {
    content: [
      { text: "Formulario PCC-01", style: "title" },

      { text: "Información General", style: "header" },
      {
        table: {
          widths: ["33%", "33%", "33%"],
          body: [
            ["Oficina", "Ciudad", "Fecha"],
            [formData.oficina || "" , formData.ciudad || "", formData.fecha || ""],
          ],
        },
      },

      { text: "Datos Bancarios", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            ["Razón Social", formData.razonSocial|| ""],
            ["Dirección", formData.direccion|| ""],
          ],
        },
      },

      { text: "Información del Declarante", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            ["Nombre", formData.nombreDeclarante|| ""],
            ["Apellido", formData.apellidoDeclarante|| ""],
            ["C.I.", `${formData.ciDeclarante} (${formData.extensionDeclarante})`|| ""],
            ["Nacionalidad", formData.nacionalidadDeclarante|| ""],
            ["Residencia", formData.paisResidente|| ""],
            ["Dirección", formData.direccionDeclarante|| ""],
            ["Profesión", formData.profesion|| ""],
            ["Actividad", formData.actividadEconomica|| ""],
          ],
        },
      },

      { text: "Empresa", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            ["Empresa", formData.empresaTrabajo|| ""],
            ["Cargo", formData.cargo|| ""],
          ],
        },
      },

      { text: `El dinero de la presente operación es de su propiedad: ${formData.propio ? "Sí" : "No"}`, style: "header" },

      (!formData.propio? [{
        text: "Propietario",
        style: "header",
      }]:[]),
      (!formData.propio? [{
        table: {
          widths: ["50%", "50%"],
          body: [
            ["Nombre", formData.nombre|| ""],
            ["Apellido", formData.apellido|| ""],
            ["CI", formData.ciProp|| ""],
            ["Extensión", formData.extensionProp|| ""],
            ["NIT", formData.NitProp|| ""],
            ["Actividad Económica", formData.actividadEconomica|| ""],
            ["Razón Social", formData.razonSocialPropietario|| ""],
          ],
        },
      }]:[]),

      { text: "Información de Transacción", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            ["Forma de Operación", formData.formaOperacion|| ""],
            ["Moneda de Operación", formData.moneda|| ""],
            ["Monto (Numeral)", formData.montoNumeral|| ""],
            ["Monto (Literal)", formData.montoLiteral|| ""],
            ["Tipo de Operación", formData.tipoOperacion|| ""],
            ["Detalle de Operación", formData.detalleOperacion|| ""],
            ["Cuenta Origen", formData.cuentaOrigen|| ""],
            ["Moneda Origen", formData.monedaOrigen|| ""],
            ["Cuenta Destino", formData.cuentaDestino|| ""],
            ["Moneda Destino", formData.monedaDestino|| ""],
            ["Origen de Recursos", formData.origenRecursos|| ""],
            ["Destino de Recursos", formData.destinoRecursos|| ""],
          ],
        },
      },

      { text: "Firmas", style: "header" },
      {
        table: {
          widths: ["33%", "33%", "33%"],
          body: [
            ["Firma del Declarante", "Firma y Sello del Funcionario", "Firma y Sello del Supervisor"],
            ["________________________", "________________________", "________________________"],
          ],
        },
      },
    ],
    styles: {
      title: { fontSize: 16, bold: true, alignment: "center", marginBottom: 10 },
      header: { fontSize: 12, bold: true, marginTop: 10, marginBottom: 5 },
    },
  };

  pdfMake.createPdf(docDefinition).download("Formulario-PCC01.pdf");
  return <></>;
};

export default generatePCC01PDF;
