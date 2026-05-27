import React, { useState } from 'react';
import Modal from '../components/Shared/Modal';
import FormInput from '../components/Shared/FormInput';
import { Copy, Send } from 'lucide-react';
import { formatCurrency } from '../helpers/helpers';

const SendInvoiceModal = ({ invoice, resident, onClose, onUpdateStatus }) => {
    const [email, setEmail] = useState(resident?.familyEmail || '');
    const [isCopied, setIsCopied] = useState(false);

    const subject = `Invoice from Golden Years RCFE for ${invoice?.residentName || 'Resident'}`;
    const body = `Dear Family of ${invoice?.residentName || 'Resident'},

Please find the details for your recent invoice below.

Invoice Date: ${invoice?.issueDate ? new Date(invoice.issueDate + 'T00:00:00').toLocaleDateString() : 'N/A'}
Due Date: ${invoice?.dueDate ? new Date(invoice.dueDate + 'T00:00:00').toLocaleDateString() : 'N/A'}

Items:
${(Array.isArray(invoice?.items) ? invoice.items : []).map(item => `- ${item.description}: ${formatCurrency(item.amount)}`).join('\n')}

Total Amount: ${formatCurrency(invoice?.totalAmount || 0)}

Please contact us if you have any questions.

Thank you,
 Management`;

    const handleCopyToClipboard = () => {
        const fullEmail = `Subject: ${subject}\n\n${body}`;
        const textArea = document.createElement("textarea");
        textArea.value = fullEmail;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy'); // Use execCommand for broader compatibility
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset button text
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optionally show an error message to the user
        }
        document.body.removeChild(textArea);
    };

    const handleMarkAsSent = () => {
        if (invoice?.id) {
            onUpdateStatus(invoice.id, 'Sent');
            onClose();
        } else {
            console.error("Cannot mark as sent, invoice ID is missing.");
            // Show error to user?
        }
    };

    return (
        <Modal onClose={onClose} title={`Send Invoice to ${invoice?.residentName || 'Resident'}'s Family`}>
            <div className="space-y-4">
                <FormInput id="email" label="Recipient Email (For Reference)" type="email" value={email} onChange={e => setEmail(e.target.value)} required={false} />
                <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md">
                    <p><strong>Action Required:</strong> Please copy the content below and paste it into your preferred email client to send.</p>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <div className="p-2 bg-gray-100 rounded-md border text-sm">{subject}</div>
                    <label className="block text-sm font-medium text-gray-700">Body</label>
                    <textarea readOnly value={body} className="w-full h-40 p-2 bg-gray-100 rounded-md border text-sm" />
                </div>
                <div className="flex justify-end pt-4 border-t gap-2">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleCopyToClipboard} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"><Copy className="w-4 h-4 mr-2" /> {isCopied ? 'Copied!' : 'Copy Text'}</button>
                    <button onClick={handleMarkAsSent} className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex items-center"><Send className="w-4 h-4 mr-2" />Mark as Sent</button>
                </div>
            </div>
        </Modal>
    );
};

export default SendInvoiceModal;
