// ErrorDialog.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorDialog = ({ show, errorMessage }) => {
    return (
        <Modal show={show} >
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorMessage}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorDialog;