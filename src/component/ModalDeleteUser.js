
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../services/UserService';
import {toast} from 'react-toastify'

function ModalDeleteUser(props) {
    const {show, handleClose, dataUserDelete, handleDeleteUserFromModal} = props

    const confirmDelete = async () => {
        let res = await deleteUser(dataUserDelete.id)
        if(res && res.statusCode === 204){
            toast.success('Delete user success')
            handleDeleteUserFromModal(dataUserDelete)
        }else {
            toast.error('Delete user error')
        }
        handleClose()
    }
    return (
        <>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Confirm action delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure to delete this user ?
                <h5>email : {dataUserDelete.email}</h5>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick = {() => {confirmDelete()}}>Delete</Button>
            </Modal.Footer>
        </Modal>
        </>
  );
}

export default ModalDeleteUser;