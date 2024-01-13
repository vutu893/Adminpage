import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { fetchAllUsers } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import ModalDeleteUser from './ModalDeleteUser';
import _ from 'lodash'
import {debounce} from 'lodash'
import { CSVLink } from "react-csv";
import Papa from 'papaparse'
import {toast} from "react-toastify"

const TableUsers = (props) => {
    const [listUsers, setListUsers] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false)
    const [isShowModalEdit, setIsShowModalEdit] = useState(false)
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)

    const [dataUserEdit, setDataUserEdit] = useState({})
    const [dataUserDelete, setDataUserDelete] = useState({})
    const [sortBy, setSortBy] = useState("asc")
    const [sortField, setSortField] = useState('first name')

    const [dataExport, setDataExport] = useState([])

    const handleClose = () => {
        setIsShowModalAddNew(false)
        setIsShowModalEdit(false)
        setIsShowModalDelete(false)
    }

    useEffect(() => {
        //call API
        getUsers(1)
    },[])
    
    const getUsers = async (page) => {
        let res = await fetchAllUsers(page)

        if(res && res.data) {
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPages(res.total_pages)
        }
    }
    const handlePageClick = (event) => {
        //read react-pagination
        getUsers(+event.selected + 1)
    }

    const handleUpdateUser = (user) => {
        setListUsers([user, ...listUsers])
    }

    const handleEditUser = (user) => {
        setDataUserEdit(user)
        setIsShowModalEdit(true)
        // console.log(user)
    }
    const handleDeleteUser = (user) => {
        setDataUserDelete(user)
        setIsShowModalDelete(true)
        console.log(user)
    }
// edit user
    const handleEditUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers)
        
        let index = listUsers.findIndex(item => item.id === user.id)
        cloneListUsers[index].first_name = user.first_name
        setListUsers(cloneListUsers)
    }
// delete user
    const handleDeleteUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers)

        cloneListUsers = cloneListUsers.filter(item => item.id !== user.id)
        setListUsers(cloneListUsers)
    }
//sort list user
    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy)
        setSortField(sortField)

        let cloneListUsers = _.cloneDeep(listUsers)
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy])
        setListUsers(cloneListUsers)       
    }
//debounce : sau 2 giay moi handle ham handleSearch
    const handleSearch = debounce((event) => {
        let term = event.target.value
        if(term) {
            let cloneListUsers = _.cloneDeep(listUsers)
            cloneListUsers = cloneListUsers.filter(item => item.email.includes(term))

            setListUsers(cloneListUsers)
            
        } else {
            getUsers(1)
        }
    },300)

//event va done la cac tham so cua thu vien
    const getUsersExport = (event, done) => {
        let result = []
        if (listUsers && listUsers.length > 0 ) {
            result.push(['Id', 'Email','First Name', 'Last Name'])
            listUsers.map((item, index) => {
                let arr = []
                arr[0] = item.id
                arr[1] = item.email
                arr[2] = item.first_name
                arr[3] = item.last_name
                result.push(arr)
            })

            setDataExport(result)
            done()
        }
    }
//hanle import csv
    const handleImportCSV = (event) => {
        if(event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0]

            if(file.type !== 'text/csv') {
                toast.error('Only accept csv file!!!')
                return;
            }

            Papa.parse(file, {
                // header: true,
                complete: function(results) {
                    let rawCSV = results.data
                    console.log('>>>> check rawCSV: ', rawCSV)
                    if (rawCSV.length > 0 ) {
                        if(rawCSV[0] && rawCSV[0].length === 3) {
                            if(rawCSV[0][0] !== 'Email' || rawCSV[0][1] !== 'First Name' || rawCSV[0][2] !== 'Last Name'){
                                toast.error('File CSV is not exactly!!!')
                            } else {
                                let result = []

                               rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 3) {
                                        let obj = {}
                                        obj.email= item[0]
                                        obj.first_name = item[1]
                                        obj.last_name = item[2]
                                        
                                        result.push(obj)
                                    }
                                })
                                setListUsers(result)
                            }
                        }else {
                            toast.error('Wrong format CSV file!!!!')
                        }
                    } else {
                        toast.error('Not found file your CSV')
                    }
                }
            });
        }

    }
    return (
        <>
            <div className='my-3 add-new'>
                <span><b>List Users</b></span> 
                <div className='group-btns mt-4'>
                    <label htmlFor='import' className='btn btn-warning'>
                        <i className="fa-solid fa-file-arrow-up"></i>Import
                    </label>
                    <input  id='import'
                            type='file'
                            hidden
                            onChange={(event) => {handleImportCSV(event)}}
                    ></input>
                    <CSVLink
                        data={dataExport}
                        filename={"users.csv"}
                        className="btn btn-primary"
                        asyncOnClick = {true}
                        onClick={(event, done) => getUsersExport(event, done)}
                    > <i className="fa-solid fa-file-arrow-down"></i>Export</CSVLink>

                    <button className='btn btn-success' onClick={() => setIsShowModalAddNew(true)}>
                        <i className="fa-solid fa-circle-plus px-1"></i>
                        Add new
                    </button>
                </div>
            </div> 
            <div className='col-4 my-3'>
                <input  className='form-control'
                        placeholder='Search user by email'
                        // value={keyWord}
                        onChange={(event) => {handleSearch(event)}}
                />
            </div>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>
                        <div className='sort-header'>
                            <span>ID</span>
                            <span>
                                <i 
                                    onClick={() => {handleSort('esc', 'id')}}
                                    className="fa-solid fa-sort-up"
                                ></i>
                                <i  
                                    onClick={() => {handleSort('desc', 'id')}}
                                    className="fa-solid fa-sort-down"
                                ></i>
                            </span>
                        </div> 
                    </th>
                    <th>Email</th>
                    <th>
                        <div className='sort-header'>
                            <span> First Name</span>
                            <span>
                                <i 
                                    onClick={() => {handleSort('esc', 'first_name')}}
                                    className="fa-solid fa-sort-up"
                                ></i>
                                <i  
                                    onClick={() => {handleSort('desc', 'first_name')}}
                                    className="fa-solid fa-sort-down"
                                ></i>
                            </span>
                        </div>
                    </th>
                    <th>
                    <div className='sort-header'>
                            <span> Last Name</span>
                            <span>
                                <i 
                                    onClick={() => {handleSort('esc', 'last_name')}}
                                    className="fa-solid fa-sort-up"
                                ></i>
                                <i  
                                    onClick={() => {handleSort('desc', 'last_name')}}
                                    className="fa-solid fa-sort-down"
                                ></i>
                            </span>
                        </div>
                    </th>
                    
                </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 &&
                        listUsers.map((item,index) => {
                            return (
                                <tr key={`users-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>
                                        <button
                                             className='btn btn-warning mx-3'
                                             onClick={() => {handleEditUser(item)}}
                                        >Edit</button>
                                        <button className='btn btn-danger'
                                                onClick={() => {handleDeleteUser(item)}}
                                        >Delete</button>
                                    </td>
                                </tr>    
                            )
                        })
                    }  
                </tbody>
            </Table>
            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />

            <ModalAddNew 
                show = {isShowModalAddNew}
                handleClose = {handleClose}
                handleUpdateUser ={handleUpdateUser}
            />

            <ModalEditUser 
                show = {isShowModalEdit}
                handleClose = {handleClose}
                dataUserEdit = {dataUserEdit}
                handleEditUserFromModal = {handleEditUserFromModal}
            />
            <ModalDeleteUser 
                show = {isShowModalDelete}
                handleClose = {handleClose}
                dataUserDelete = {dataUserDelete}
                handleDeleteUserFromModal = {handleDeleteUserFromModal}
            />
        </>
    )
}

export default TableUsers