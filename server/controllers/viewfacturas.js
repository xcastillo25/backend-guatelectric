const PDFDocument = require('pdfkit');
const { viewfactura } = require('../models');

const imprimirFactura = async (req, res) => {
    try {
        const { idfactura } = req.params;
        const factura = await viewfactura.findOne({ where: { idfactura } });

        if (!factura) {
            return res.status(404).send({ mensaje: "Factura no encontrada" });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura_${factura.idfactura}.pdf`);

        doc.pipe(res);

        doc.fontSize(25).text('FACTURA DEL MES', { align: 'center' });
        doc.fontSize(18).text('GuatElectric', { align: 'center' });
        doc.fontSize(10).text('Distribuidora de Electricidad de Guatemala - 1234567-8', { align: 'center' });
        doc.text('3-52 calle 4a. avenida, zona 4, Salamá, Baja Verapaz', { align: 'center' });
        doc.text('www.guatelectric.com - atencionalcliente@guatelectric.com', { align: 'center' });
        doc.text('SALAMÁ, GUATEMALA', { align: 'center' });
        doc.moveDown(0.5);

        doc.fontSize(12).text(`NIS: ${factura.idmedidor}`, { continued: true });
        doc.text(` - Serie: ${factura.serie}`, { continued: true });
        doc.text(` - NIT: ${factura.nit}`);
        doc.text(`Nombre: ${factura.nombre} ${factura.apellidos}`);
        doc.text(`Dirección: ${factura.direccion}`);
        doc.text(`Fecha de Emisión: ${new Date(factura.fecha).toLocaleDateString()}`);
        doc.moveDown(0.5);

        doc.fontSize(14).text('Detalles de Consumo', { underline: true });
        doc.fontSize(10);
        doc.text(`Energía del Mes: ${factura.consumokw} kWh`);
        doc.text(`Tarifa (Q/kWh): ${factura.cargofijo.toFixed(2)}`);
        doc.text(`Consumo de Electricidad: Q ${factura.monto.toFixed(2)}`);
        doc.text(`Tasa de Alumbrado Público: Q ${factura.cuotaalumbrado.toFixed(2)}`);
        doc.moveDown(0.5);

        // Graph for previous consumptions
        const maxConsumption = Math.max(factura.consumo1, factura.consumo2, factura.consumo3, factura.consumo4, factura.consumo5, 1);  // Avoid division by zero
        const barWidth = 40;
        const baseY = 500;  // Lower starting point for the graph
        const barHeight = (value) => (value / maxConsumption) * 100;  // Scale bars to max 100 points high

        doc.fontSize(12).text('Historial de Consumo:', { underline: true });
        ['consumo1', 'consumo2', 'consumo3', 'consumo4', 'consumo5'].forEach((key, index) => {
            doc.fillColor('black').rect(100 + index * 50, baseY, barWidth, -barHeight(factura[key])).fill();
            doc.fontSize(10).text(`${factura[key]} kWh`, 100 + index * 50, baseY + 10, { width: barWidth, align: 'center' });
        });

        // Final text and total
        doc.fontSize(12).text('Total a Pagar:', { continued: true });
        doc.text(` Q ${factura.total.toFixed(2)}`, { align: 'right' });

        doc.end();
    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
    }
};


const mostrarFacturas = async (req, res) => {
    try {
        const facturas = await viewfactura.findAll({
            order: [['fecha', 'DESC']]  // Ordena por la columna 'fecha' en orden descendente
        });
        res.status(200).send({Facturas: facturas});
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).send({
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    mostrarFacturas, imprimirFactura
}