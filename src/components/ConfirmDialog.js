// ConfirmDialog.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ConfirmDialog = ({ isOpen, onRequestClose, onConfirm, header, content }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirmation Dialog"
            className="modalDialog"
            overlayClassName="overlay"
        >
            <div>
                {header}
                <hr />
                {content}
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="btn btn-confirm">Confirm</button>
                    <button onClick={onRequestClose} className="btn btn-cancel">Cancel</button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
