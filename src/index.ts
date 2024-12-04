import path from 'path';
import PDFGenerator from './services/PDFService';

const filePath = path.join(__dirname, '..', 'pdfFiles', 'something.pdf');
new PDFGenerator();