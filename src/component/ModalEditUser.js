import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { putUpdateUser } from '../services/UserService';
import {toast} from 'react-toastify'

const ModalEditUser = (props) => {
    
    const {show, handleClose, dataUserEdit, handleEditUserFromModal} = props
    const [name, setName] = useState('')
    const [job, setJob] = useState('')

    const handleEditUser = async () => {
        let res = await putUpdateUser(name, job)

        if(res) {
            handleEditUserFromModal({
                first_name: name,
                id: dataUserEdit.id
            })
            handleClose()
            toast.success('Change user success')
        }
       
    }
    
    useEffect(() => {
        if(show) {
            setName(dataUserEdit.first_name)
        }
    },[dataUserEdit])

    return (
      <>
        <Modal show={show} onHide={() => {handleClose()}}>
          <Modal.Header closeButton>
            <Modal.Title>Edit a user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <form>
                    <div className="form-group mb-3">
                        <label >Name</label>
                        <input  type="text"
                                className="form-control"
                                value={name}
                                onChange={(event) => {setName(event.target.value)}}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label  >Job</label>
                        <input  type="text"
                                className="form-control"    
                                value={job}             
                                onChange={(event) => {setJob(event.target.value)}}
                        />
                    </div>
                </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              handleClose()
            }}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              handleEditUser()
            }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}

export default ModalEditUser