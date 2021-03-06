import React, { Fragment, useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../Firebase";
import Logout from "../Logout";
import Quiz from "../Quiz";
import Loader from "../Loader";

const Welcome = ( props)=>{
    const [userSession, setUserSession]=useState(null);
    const [userData,setUserData]= useState({});

    const firebase= useContext(FirebaseContext);

    useEffect( ()=>{
       let listener = firebase.auth.onAuthStateChanged( user =>{
             user ? setUserSession(user) : props.history.push('/');
            }
        ) 

        if(userSession!==null){
            firebase.user(userSession.uid)
                    .get()
                    .then(doc =>{
                              if(doc && doc.exists){
                                    const myData = doc.data()
                                    setUserData(myData)
                                    console.log(userData)
                                    }
                                 })
                    .catch(error =>{
                                    console.log(error);
                                 }
                        )
                 }
        
        return ()=>{
            listener();
        }

    } ,[userSession])

    return userSession=== null
    ? ( <Fragment>
        <Loader
             styling={{textAlign: "center",color: "#FFF"}}
             loadingMsg={"Authentification..."}
         />
        </Fragment>
     ) 
    :(
        <div className='quiz-bg'>
             <div className='container'>
                <Logout />
                <Quiz userData={userData}/>
             </div>
        </div>
    )
};

export default Welcome;