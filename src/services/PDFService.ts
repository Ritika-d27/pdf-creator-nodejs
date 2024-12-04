import * as fs from 'fs';

export default class PDFGenerator {
    private content: string = '';

    // Add HTML-like content
    addContent(htmlContent: string): this {
        const processedContent = this.processHTMLContent(htmlContent);
        this.content += processedContent + '\n';
        return this;
    }

    // Basic HTML-like content processing
    private processHTMLContent(html: string): string {
        return html
            .replace(/<a href="(.*?)">(.*?)<\/a>/g, 'Link: $2 ($1)')
            .replace(/<h1>(.*?)<\/h1>/g, '>>> $1 <<<')
            .replace(/<h2>(.*?)<\/h2>/g, '>> $1 <<')
            .replace(/<p>(.*?)<\/p>/g, '$1')
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<em>(.*?)<\/em>/g, '*$1*')
            .replace(/<u>(.*?)<\/u>/g, '_$1_')
            .replace(/<img src="(.*?)" alt="(.*?)" \/>/g, '[Image: $2 at $1]')
            .replace(/<[^>]*>/g, ''); // Remove any remaining tags
    }

    // Generate PDF content
    generate(filePath: string): void {
        const pdfContent = this.createPDFContent(this.content);
        fs.writeFileSync(filePath, pdfContent);
        console.log(`PDF generated at ${filePath}`);
    }

    // Create basic PDF structure
    private createPDFContent(content: string): Buffer {
        const header = '%PDF-1.4\n';
        const body = this.createPDFBody(content);
        const trailer = this.createPDFTrailer();

        return Buffer.from(header + body + trailer, 'utf-8');
    }

    // Create PDF body with text content
    private createPDFBody(content: string): string {
        const escapedContent = this.escapeSpecialChars(content);
        return '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n' +
            '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n' +
            '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n' +
            '4 0 obj\n<< /Length ' + (escapedContent.length + 44) + ' >>\nstream\n' +
            `BT /F1 24 Tf 100 700 Td (${escapedContent}) Tj ET\n` +
            'endstream\nendobj\n' +
            '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
    }

    // Create PDF trailer
    private createPDFTrailer(): string {
        return 'xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000100 00000 n \n0000000173 00000 n \n0000000221 00000 n \n' +
            'trailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n278\n%%EOF';
    }

    // Escape special PDF characters
    private escapeSpecialChars(text: string): string {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/\n/g, '\\n');
    }
}

// Example usage
async function example() {
    const pdfGenerator = new PDFGenerator();

    pdfGenerator
        .addContent('<div style="color: red;">This is a sample text with HTML tags.</div>')
        .addContent('<h1>Welcome to My PDF</h1>')
        .addContent('<p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p>')
        .addContent('<a href="https://example.com">Visit Example</a>')
        .addContent('<img src="https://example.com/image.jpg" alt="Sample Image" />')
        .generate('./output.pdf');
}

// Run the example
example();
