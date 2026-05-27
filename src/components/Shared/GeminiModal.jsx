
import React from 'react';
import { Sparkles } from 'lucide-react';
import Modal from './Modal';

const GeminiModal = ({ title, content, isLoading, onClose }) => (
    <Modal onClose={onClose} title={title}>
        {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" />
                <p className="mt-4 text-gray-600">Generating response...</p>
            </div>
        ) : (
            <>
                {/* Ensure prose styles apply, handle whitespace, limit height */}
                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 max-h-[60vh] overflow-y-auto whitespace-pre-wrap p-2 bg-gray-50 rounded-md border">{content}</div>
                <div className="flex justify-end pt-4 mt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                </div>
            </>
        )}
    </Modal>
);

export default GeminiModal;
