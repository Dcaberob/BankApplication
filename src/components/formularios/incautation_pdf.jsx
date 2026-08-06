

export default  async function generarIncautacionPDF(formData) {
  const pdfMake = await import("pdfmake/build/pdfmake");
  const pdfFonts = await import("pdfmake/build/vfs_fonts");

  const docDefinition = {
    content: [
      { text: "📄 Formulario de Incautación", style: "header" },

      // Información General
      { text: "🔹 Información General", style: "subheader" },
      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            ["Entidad Financiera:", formData.entidad || "", "Agencia:", formData.agencia || ""],
            ["Fecha:", formData.fecha || "", "Departamento:", formData.departamento || ""],
            ["Localidad:", formData.localidad || "", "", ""],
          ],
        },
        layout: "lightHorizontalLines",
      },

      // Información del Portador
      { text: "👤 Datos del Portador", style: "subheader" },
      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            ["CI:", formData.ciPortador || "", "Teléfono:", formData.telefonoPortador || ""],
            ["Nombre:", formData.nombrePortador || "", "Apellidos:", formData.apellidoPortador || ""],
          ],
        },
        layout: "lightHorizontalLines",
      },

      // Tabla de Billetes Incautados
      { text: "💰 Billetes Incautados", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["10%", "10%", "10%", "10%", "10%", "15%", "20%", "15%"],
          body: [
            [
              { text: "Nro", bold: true },
              { text: "Moneda", bold: true },
              { text: "Corte", bold: true },
              { text: "Número", bold: true },
              { text: "Serie", bold: true },
              { text: "Motivo", bold: true },
              { text: "Tipo Falsificación", bold: true },
              { text: "Cantidad", bold: true },
            ],
            ...(formData.billetes?.map((billete, index) => [
              index + 1,
              billete.moneda || "",
              billete.corte || "",
              billete.numero || "",
              billete.serie || "",
              billete.motivo || "",
              billete.tipoFalsificacion || "",
              billete.cantidad || "",
            ]) || []),
          ],
        },
        layout: "lightHorizontalLines",
      },

      // Firmas
      { text: "✍ Firmas", style: "subheader" },
      {
        columns: [
          { text: "________________________\nFirma del Portador", alignment: "center" },
          { text: "________________________\nFirma y Sello", alignment: "center" },
          { text: "________________________\nFirma y Sello", alignment: "center" },
        ],
        margin: [0, 20, 0, 0],
      },
    ],

    // Estilos
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
    },
  };
pdfMake.createPdf(docDefinition).download("incautacion.pdf");
  return <></>;
}
