import React from 'react';

/**
 * A reusable confirmation modal component
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {string} props.title - Title of the modal
 * @param {string} props.message - Message/content to display
 * @param {string} props.confirmText - Text for the confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for the cancel button (default: "Cancel")
 * @param {function} props.onConfirm - Callback when user confirms
 * @param {function} props.onCancel - Callback when user cancels
 * @param {string} props.confirmButtonClass - Custom class for confirm button
 */
export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-md px-4 py-2 font-medium text-white ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
