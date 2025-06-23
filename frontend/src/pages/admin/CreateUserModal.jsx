import React from 'react';
import AdminCreateUser from './AdminCreateUser';

const CreateUserModal = ({ show, onClose, onSuccess }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>
        <AdminCreateUser onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </div>
  );
};

export default CreateUserModal;