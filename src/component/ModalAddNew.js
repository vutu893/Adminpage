import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postCreateUser } from '../services/UserService';
import { toast } from 'react-toastify';

const ModalAddNew = (props) => {
    
    const {show, handleClose, handleUpdateUser} = props
    const [name, setName] = useState('')
    const [job, setJob] = useState('')

    const handleSaveUser = async () => {
        let res = await postCreateUser(name, job)

        console.log('>>>> check res: ', res)
        if(res && res.id) {
            handleClose()
            setName('')
            setJob('')
            toast.success('Create user success')
            handleUpdateUser({first_name: name,id: res.id})
        } else {

        }
    }
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Adding new user</Modal.Title>
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
                        <label >Job</label>
                        <input  type="text"
                                className="form-control"    
                                value={job}             
                                onChange={(event) => {setJob(event.target.value)}}
                        />
                    </div>
                </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveUser}>
              Add 
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}

export default ModalAddNew