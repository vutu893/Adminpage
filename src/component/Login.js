import { useContext, useState } from "react"
import {toast} from 'react-toastify'
import { loginAPI } from "../services/UserService"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const Login = () => {
    const {loginContext} = useContext(UserContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // useEffect( () => {
    //     let token  = localStorage.getItem('token')
    //     if(token) {
    //         navigate('/home')
    //     }
    // },[])

    const handleLogin = async () => {

        if(!email || !password) {
            toast.error('Email/Password is required')
            setEmail('')
            setPassword('')
            return;
        }

        let res = await loginAPI(email, password)

        console.log("..... res: ", res)
        if(res && res.token) {
            loginContext(email,res.token)
            navigate('/')
            toast.success('Login success')
        }else {
            //error
            if(res && res.status === 400) {
                toast.error("Email or password not true")
            }
        }
    }
    return (
        <>
            <div className="main">
                <div  className="form" >
                    <h3 className="heading">Đăng nhập</h3>
                
                    <div className="spacer"></div>
                
                    <div className="form-group">
                        <label  className="form-label">Email (eve.holt@reqres.in)</label>
                        <input   
                            type="text"
                            placeholder="VD:eve.holt@reqres.in"
                            className="form-control"
                            value={email}
                            onChange={(event) => {setEmail(event.target.value)}}
                        >   
                        </input>
                        <span className="form-message"></span>
                    </div>
                
                    <div className="form-group">
                        <label  className="form-label">Mật khẩu</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={password}
                            onChange={(event) => {setPassword(event.target.value)}}
                        >
                        </input>
                        <span className="form-message"></span>
                    </div>
                
                    <button
                        className="form-submit"
                        onClick={() => {handleLogin()}}
                     >Đăng nhập</button>
                </div>
            </div>
        </>
    )
}

export default Login