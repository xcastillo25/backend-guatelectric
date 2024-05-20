const PDFDocument = require('pdfkit');
const { viewfactura } = require('../models');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurar nodemailer para usar Outlook
const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
});

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

        // Estilos de fuentes y colores
        const titleFontSize = 20;
        const subTitleFontSize = 16;
        const normalFontSize = 12;
        const smallFontSize = 10;
        const primaryColor = '#0033a0';
        const secondaryColor = '#aaaaaa';

        // Encabezado
        doc
            .fillColor(primaryColor)
            .fontSize(titleFontSize)
            .text('RE-IMPRESIÓN DE FACTURA DEL MES', { align: 'center' })
            .moveDown(0.5)
            .fontSize(subTitleFontSize)
            .text('GuatElectric', { align: 'center' })
            .moveDown(0.5)
            .fontSize(normalFontSize)
            .fillColor('black')
            .text('Electricidad de Guatemala GuatElectric - 1234567-8', { align: 'center' })
            .text('3-52 calle 4a. avenida, zona 4, Salamá, Baja Verapaz', { align: 'center' })
            .text('www.guatelectric.com - atencionalcliente@guatelectric.com', { align: 'center' })
            .text('SALAMÁ, GUATEMALA', { align: 'center' })
            .moveDown(1);

        // Línea separadora
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke()
            .moveDown(1);

        // Información del cliente
        doc
            .fontSize(normalFontSize)
            .fillColor(primaryColor)
            .text(`NIS: ${factura.idmedidor}`, { continued: true })
            .text(` - Serie: ${factura.serie}`, { continued: true })
            .text(` - NIT: ${factura.nit}`)
            .fillColor('black')
            .text(`Nombre: ${factura.nombre} ${factura.apellidos}`)
            .text(`Dirección: ${factura.direccion}`)
            .text(`Fecha de Emisión: ${new Date(factura.fecha).toLocaleDateString()}`)
            .moveDown(1);

        // Detalles de consumo
        doc
            .fontSize(subTitleFontSize)
            .fillColor(primaryColor)
            .text('Detalles de Consumo', { underline: true })
            .moveDown(0.5)
            .fontSize(normalFontSize)
            .fillColor('black')
            .text(`Energía del Mes: ${factura.consumokw} kWh`)
            .text(`Tarifa (Q/kWh): ${factura.cargofijo.toFixed(2)}`)
            .text(`Consumo de Electricidad: Q ${factura.monto.toFixed(2)}`)
            .text(`Tasa de Alumbrado Público: Q ${factura.cuotaalumbrado.toFixed(2)}`)
            .moveDown(1);

        // Gráfico de barras
        const maxConsumption = Math.max(factura.consumo1, factura.consumo2, factura.consumo3, factura.consumo4, factura.consumo5, 1);
        const barWidth = 40;
        const baseY = doc.y + 120;
        const barHeight = (value) => (value / maxConsumption) * 100;

        doc
            .fontSize(subTitleFontSize)
            .fillColor(primaryColor)
            .text('Historial de Consumo', { underline: true })
            .moveDown(0.5);

        ['MAY24', 'ABR24', 'MAR24', 'FEB24', 'ENE24'].forEach((label, index) => {
            doc
                .save()
                .rect(100 + index * 60, baseY, barWidth, -barHeight(factura[`consumo${index + 1}`]))
                .fillColor(primaryColor)
                .fill()
                .restore()
                .fontSize(smallFontSize)
                .fillColor('black')
                .text(`${factura[`consumo${index + 1}`]} kWh`, 100 + index * 60, baseY + 10, { width: barWidth, align: 'center' })
                .text(label, 100 + index * 60, baseY + 25, { width: barWidth, align: 'center' });
        });

        doc.moveDown(2);

        // Total a pagar
        doc
            .fontSize(subTitleFontSize)
            .fillColor(primaryColor)
            .text('Total a Pagar:', { continued: true })
            .fontSize(titleFontSize)
            .fillColor('black')
            .text(` Q ${factura.total.toFixed(2)}`, { align: 'right' });

        // Información adicional
        doc
            .moveDown(2)
            .fontSize(smallFontSize)
            .fillColor(secondaryColor)
            .text('El plazo de vencimiento de esta factura es de 30 días después de su fecha de emisión.', { align: 'center' })
            .text('Se emitirá orden de corte con 2 facturas pendientes de pago, según Artículo 50 LGE.', { align: 'center' })
            .text('El pago de esta factura quedará anulado si el o los cheques fueran rechazados por el Banco.', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

const generarYEnviarFactura = async (req, res) => {
    try {
        const { idfactura } = req.params;
        const factura = await viewfactura.findOne({ where: { idfactura } });

        if (!factura) {
            return res.status(404).send({ mensaje: "Factura no encontrada" });
        }

        if (!factura.correo) {
            return res.status(400).send({ mensaje: "El cliente no tiene un correo electrónico definido" });
        }

        const directoryPath = path.join(__dirname, '../../facturas');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        const filePath = path.join(directoryPath, `factura_${factura.idfactura}.pdf`);
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Estilos de fuentes y colores
        const titleFontSize = 20;
        const subTitleFontSize = 16;
        const normalFontSize = 12;
        const smallFontSize = 10;
        const primaryColor = '#0033a0';
        const secondaryColor = '#aaaaaa';

        // Encabezado
        doc
            .fillColor(primaryColor)
            .fontSize(titleFontSize)
            .text('RE-IMPRESIÓN DE FACTURA DEL MES', { align: 'center' })
            .moveDown(0.5)
            .fontSize(subTitleFontSize)
            .text('GuatElectric', { align: 'center' })
            .moveDown(0.5)
            .fontSize(normalFontSize)
            .fillColor('black')
            .text('Distribuidora de Electricidad de Guatemala - 1234567-8', { align: 'center' })
            .text('3-52 calle 4a. avenida, zona 4, Salamá, Baja Verapaz', { align: 'center' })
            .text('www.guatelectric.com - atencionalcliente@guatelectric.com', { align: 'center' })
            .text('SALAMÁ, GUATEMALA', { align: 'center' })
            .moveDown(1);

        // Línea separadora
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke()
            .moveDown(1);

        // Información del cliente
        doc
            .fontSize(normalFontSize)
            .fillColor(primaryColor)
            .text(`NIS: ${factura.idmedidor}`, { continued: true })
            .text(` - Serie: ${factura.serie}`, { continued: true })
            .text(` - NIT: ${factura.nit}`)
            .fillColor('black')
            .text(`Nombre: ${factura.nombre} ${factura.apellidos}`)
            .text(`Dirección: ${factura.direccion}`)
            .text(`Fecha de Emisión: ${new Date(factura.fecha).toLocaleDateString()}`)
            .moveDown(1);

        // Detalles de consumo
        doc
            .fontSize(subTitleFontSize)
            .fillColor(primaryColor)
            .text('Detalles de Consumo', { underline: true })
            .moveDown(0.5)
            .fontSize(normalFontSize)
            .fillColor('black')
            .text(`Energía del Mes: ${factura.consumokw} kWh`)
            .text(`Tarifa (Q/kWh): ${factura.cargofijo.toFixed(2)}`)
            .text(`Consumo de Electricidad: Q ${factura.monto.toFixed(2)}`)
            .text(`Tasa de Alumbrado Público: Q ${factura.cuotaalumbrado.toFixed(2)}`)
            .moveDown(1);

        // Gráfico de barras
        const maxConsumption = Math.max(factura.consumo1, factura.consumo2, factura.consumo3, factura.consumo4, factura.consumo5, 1);
        const barWidth = 40;
        const baseY = doc.y + 120;
        const barHeight = (value) => (value / maxConsumption) * 100;

        doc
            .fontSize(subTitleFontSize)
            .fillColor(primaryColor)
            .text('Historial de Consumo', { underline: true })
            .moveDown(0.5);

        ['MAY24', 'ABR24', 'MAR24', 'FEB24', 'ENE24'].forEach((label, index) => {
            doc
                .save()
                .rect(100 + index * 60, baseY, barWidth, -barHeight(factura[`consumo${index + 1}`]))
                .fillColor(primaryColor)
                .fill()
                .restore()
                .fontSize(smallFontSize)
                .fillColor('black')
                .text(`${factura[`consumo${index + 1}`]} kWh`, 100 + index * 60, baseY + 10, { width: barWidth, align: 'center' })
                .text(label, 100 + index * 60, baseY + 25, { width: barWidth, align: 'center' });
        });

        doc.moveDown(2);

        // Total a pagar
        doc
            .fontSize(subTitleFontSize)
            .fillColor(primaryColor)
            .text('Total a Pagar:', { continued: true })
            .fontSize(titleFontSize)
            .fillColor('black')
            .text(` Q ${factura.total.toFixed(2)}`, { align: 'right' });

        // Información adicional
        doc
            .moveDown(2)
            .fontSize(smallFontSize)
            .fillColor(secondaryColor)
            .text('El plazo de vencimiento de esta factura es de 30 días después de su fecha de emisión.', { align: 'center' })
            .text('Se emitirá orden de corte con 2 facturas pendientes de pago, según Artículo 50 LGE.', { align: 'center' })
            .text('El pago de esta factura quedará anulado si el o los cheques fueran rechazados por el Banco.', { align: 'center' });

        doc.end();

        // Espera a que el PDF se haya guardado antes de intentar enviarlo por correo
        writeStream.on('finish', async () => {
            try {
                await enviarFacturaPorCorreo(factura, filePath);
                res.status(200).send({ mensaje: 'Factura generada y enviada por correo electrónico.' });
            } catch (error) {
                console.error('Error al enviar correo:', error);
                res.status(500).send({ mensaje: 'Error al enviar correo', error: error.message });
            }
        });

        writeStream.on('error', (error) => {
            console.error('Error al generar PDF:', error);
            res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
        });

    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).send({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

const enviarFacturaPorCorreo = async (factura, filePath) => {
    if (!fs.existsSync(filePath)) {
        throw new Error('El archivo PDF no existe');
    }

    const mailOptions = {
        from: process.env.OUTLOOK_EMAIL,
        to: factura.correo,
        subject: `Factura del Mes - ${factura.idfactura}`,
        text: `Estimado/a ${factura.nombre}, ${factura.apellidos}, \n\nAdjunto encontrará la factura correspondiente al mes. Por favor, no dude en ponerse en contacto con nosotros si tiene alguna pregunta.\n\nSaludos cordiales,\nGuatElectric`,
        attachments: [
            {
                filename: `factura_${factura.idfactura}.pdf`,
                path: filePath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado correctamente');
};

const mostrarFacturas = async (req, res) => {
    try {
        const facturas = await viewfactura.findAll({
            order: [['fecha', 'DESC']]  // Ordena por la columna 'fecha' en orden descendente
        });
        res.status(200).send({ Facturas: facturas });
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).send({
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    mostrarFacturas, imprimirFactura, generarYEnviarFactura
};
