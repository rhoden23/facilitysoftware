import React from 'react';
import Modal from '../Shared/Modal';
import { formatCurrency } from '../../helpers/helpers';

const ViewInvoiceModal = ({ invoice, payments, onClose, currentFacility }) => {
    const validPayments = (Array.isArray(payments) ? payments : [])
        .filter(p => p.invoiceId === invoice.id)
        .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

    const totalAmount = parseFloat(invoice?.totalAmount || 0);
    const totalPaid = validPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const balanceDue = totalAmount - totalPaid;

    const handlePrint = () => {
        const printContent = document.getElementById('printable-invoice');
        if (!printContent) return;

        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(`<html><head><title>Invoice</title><script src="https://cdn.tailwindcss.com"></script><style>@media print { body { -webkit-print-color-adjust: exact; } button { display: none; } }</style></head><body>`);
        WinPrint.document.write(printContent.innerHTML);
        WinPrint.document.write('</body></html>');
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
    };

    const handleDownloadPDF = () => {
        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;

        if (typeof jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
            console.error("jsPDF or html2canvas is not loaded.");
            alert("Could not generate PDF. Please try again in a moment.");
            return;
        }

        const input = document.getElementById('printable-invoice');
        if (!input) {
            console.error("Printable invoice element not found.");
            return;
        }

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;

            const ratio = imgWidth / pdfWidth;
            const scaledHeight = imgHeight / ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(scaledHeight, pdfHeight));
            pdf.save(`invoice-${invoice?.residentName}-${invoice?.issueDate}.pdf`);
        });
    };

    return (
        <Modal onClose={onClose} title={`Invoice for ${invoice?.residentName || 'N/A'}`}>
            <div id="printable-invoice" className="space-y-4 p-4">
                <div className="flex justify-between text-sm">
                    <div><strong>Issue Date:</strong> {invoice?.issueDate ? new Date(invoice.issueDate + 'T00:00:00').toLocaleDateString() : 'N/A'}</div>
                    <div><strong>Due Date:</strong> {invoice?.dueDate ? new Date(invoice.dueDate + 'T00:00:00').toLocaleDateString() : 'N/A'}</div>
                </div>

                <h4 className="font-semibold text-gray-700 mt-4">Invoice Items</h4>
                <table className="w-full text-left mt-2 border-collapse">
                    <thead className="bg-gray-100">
                        <tr className="border-b">
                            <th className="p-2 border">Description</th>
                            <th className="p-2 text-right border">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(invoice?.items) ? invoice.items : []).map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2 border">{item.description}</td>
                                <td className="p-2 text-right border">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td className="p-2 text-right border">Total:</td>
                            <td className="p-2 text-right border">{formatCurrency(totalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>

                <h4 className="font-semibold text-gray-700 mt-4">Payment History</h4>
                {validPayments.length > 0 ? (
                    <table className="w-full text-left mt-2 border-collapse">
                        <thead className="bg-gray-100">
                            <tr className="border-b">
                                <th className="p-2 border">Date Paid</th>
                                <th className="p-2 border">Method</th>
                                <th className="p-2 text-right border">Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validPayments.map((p, index) => (
                                <tr key={p.id || index} className="border-b">
                                    <td className="p-2 border">{p.date ? new Date(p.date + 'T00:00:00').toLocaleDateString() : (p.timestamp ? new Date(p.timestamp.seconds * 1000).toLocaleDateString() : 'N/A')}</td>
                                    <td className="p-2 border">{p.method}</td>
                                    <td className="p-2 text-right border">{formatCurrency(p.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-sm text-gray-500">No payments recorded for this invoice.</p>
                )}

                <div className="mt-4 pt-4 border-t space-y-1 text-right font-medium">
                    <p>Total Invoice: <span className="w-28 inline-block">{formatCurrency(totalAmount)}</span></p>
                    <p>Total Paid: <span className="w-28 inline-block text-green-600">{formatCurrency(totalPaid)}</span></p>
                    <p className="font-bold text-lg">Balance Due: <span className="w-28 inline-block">{formatCurrency(balanceDue)}</span></p>
                </div>

                <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                    <p className="font-bold">{currentFacility?.name || 'Your Facility Name'}</p>
                    <p>{currentFacility?.address || '123 Facility Address'}</p>
                    <p>{currentFacility?.phone || '(555) 555-5555'}</p>
                </div>
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t gap-2">
                <button onClick={handlePrint} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Print</button>
                <button onClick={handleDownloadPDF} className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Download PDF</button>
            </div>
        </Modal>
    );
};

export default ViewInvoiceModal;
