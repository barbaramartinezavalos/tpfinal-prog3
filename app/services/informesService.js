import { createObjectCsvWriter } from 'csv-writer';
import { createCanvas } from 'canvas'
import puppeteer, { Browser } from "puppeteer";
import handlebars from 'handlebars';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class InformeService {
    createPieChart = (data) => {
        const colors = [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF"
        ];

        const width = 500;
        const height = 200;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const total = data.reduce((sum, value) => sum + value.cantidadU, 0);
        let startAngle = -Math.PI / 2;
        const chartRadius = 100;

        data.forEach((slice, index) => {
            const sliceAngle = (slice.cantidadU / total) * (2 * Math.PI); 
            ctx.beginPath(); 
            ctx.moveTo(chartRadius, height / 2);
            ctx.arc(chartRadius, height / 2, chartRadius, startAngle, startAngle + sliceAngle); 
            startAngle += sliceAngle; 
            ctx.closePath(); 
            ctx.fillStyle = colors[index]; 
            ctx.fill();

            const legendX = 230; 
            const legendY = 30 + index * 30; 
            ctx.fillStyle = colors[index]; 
            ctx.fillRect(legendX, legendY, 20, 20); 
            
            ctx.fillStyle = 'black'; 
            ctx.font = '16px Trebuchet MS'; 
            ctx.fillText(slice.nombre, legendX + 30, legendY + 16);
        });
        
        return canvas.toBuffer('image/png');
    };

    generatePieChartBase64 = (data) => {
        const buffer = this.createPieChart(data);
        return buffer.toString('base64');
    };

    informeOficinasPdf = async (datosReporte) => {
        try {
            const chartData = datosReporte.detalle
            const chartBase64 = this.generatePieChartBase64(chartData);

            const filePath = path.join(__dirname, '../pages/handlebars/informeOficinas.hbs');
            const htmlTemplate = fs.readFileSync(filePath, 'utf8');

            const template = handlebars.compile(htmlTemplate);
            const htmlFinal = template({ ...datosReporte, chart: chartBase64 });

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setContent(htmlFinal, { waitUntil: 'load' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '10px', bottom: '10px', left: '50px', right: '50px' }
            });

            await browser.close();

            return pdfBuffer;
        } catch (error) {
            console.error('Error generando el PDF:', error);
            throw error;
        }
    }; 
    
    informeReclamosCsv = async (datosReporte) => {
        const ruta = path.join(__dirname, '../pages/reclamos.csv'); 

        const csvWriter = createObjectCsvWriter({
            path: ruta, 
            header: [
                {id: 'reclamo', title: 'RECLAMO'},
                {id: 'tipo', title: 'TIPO'},
                {id: 'estado', title: 'ESTADO'},
                {id: 'fechaCreado', title: 'FECHA CREADO'},
                {id: 'cliente', title: 'CLIENTE'},
            ],
            encoding:'utf-8' 
        });

        await csvWriter.writeRecords(datosReporte);

        return ruta;
    }
 
    informeReclamosPdf = async (datosReporte) => {
        try{
            const filePath = path.join(__dirname, '../pages/handlebars/informe.hbs');
            const htmlTemplate = fs.readFileSync(filePath, 'utf8');

            const template = handlebars.compile(htmlTemplate);
            const htmlFinal = template(datosReporte);

            const browser = await puppeteer.launch();

            const page = await browser.newPage();

            await page.setContent(htmlFinal, {waitUntil: 'load'});

            const pdfBuffer = await page.pdf({
                format:'A4',
                printBackground: true,
                margin: {top: '10px', bottom: '10px', left: '50px', right: '50px' }
            });

            await browser.close();

            return pdfBuffer;

        }catch(error){
            console.error('Error generando el PDF:', error);
            throw error;
        }
    }
}