import React, { useState ,useEffect ,useContext} from "react";
import { Link } from 'react-router-dom';
import { FirebaseContext } from "../Firebase";

const Login = (props)=>{

    const firebase= useContext(FirebaseContext);

      const[email,setEmail]=useState('')
      const[password,setPassword]=useState('')
      const[btn,setBtn]=useState(false)
      const[error,setError]=useState('')

      useEffect(()=>{
         if(password.length > 5 && email !== ""){
             setBtn(true)
             console.log(password +'\n'+email)
         }else if(btn){
             setBtn(false)
         }
      },[password,email,btn])

    const handleSubmit= e =>{
        e.preventDefault();
        firebase.loginUser(email,password)
        .then(user=>{
            setPassword('')
            setEmail('')
            props.history.push('/Welcome')
        })
        .catch(error=>{
            setPassword('')
            setEmail('')
            setError(error);
            console.log(error)
        })
    }

    

    return(
        <div className='signUpLoginBox'>
           <div className='slContainer'>
               <div className ='formBoxLeftLogin'>
               </div>
               <div className ='formBoxRight'>
                   <div className='formContent'>

                       {error !== '' && <span>{error.message}</span>}

                      <h2>Connexion</h2>
                      <form onSubmit={handleSubmit}>
                           
                           <div className='inputBox'>
                               <input onChange={e=> setEmail(e.target.value)} value={email} type='email' autoComplete='off' required></input>
                               <label htmlFor='email'>Email</label>
                           </div>

                           <div className='inputBox'>
                               <input onChange={e=> setPassword(e.target.value)} value={password} type='password'  autoComplete='off' required ></input>
                               <label htmlFor='password'>Mot de passe</label>
                           </div>

                            {btn ? <button>Connexion</button>:<button disabled >Connexion</button>}

                       </form>
                       <div className='linkContainer'>
                           <Link className='simpleLink' to='/SignUp'>nouveau sur Marvel Quiz? inscrivez-vous.</Link>
                           <br/>
                           <Link className='simpleLink' to='/ForgetPassword'>mot de passe oublie ? Recuperez-le ici</Link>
                       </div>
                   </div>

               </div>
           </div>
        </div>
    )
}

export default Login;