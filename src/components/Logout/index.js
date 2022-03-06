import React ,{ useState, useEffect, useContext} from "react";
import { FirebaseContext } from "../Firebase";
import ReactTooltip from "react-tooltip";

const Logout= ()=>{
    const [checked, setCheked] = useState(false) ;
   
    const firebase = useContext(FirebaseContext);

    useEffect(()=>{
        if(checked){
            console.log('Deconnexion')
            firebase.signoutUser();
        }
    },[checked]);

const handleChange = event=>{
    setCheked(event.target.checked);
}
    return (
        <div className='logoutContainer'>
          <label className='switch'>
              <input type="checkbox" onChange={handleChange}
               checked= { checked }
                />
              <span className=" slider round" data-tip="Deconnexion"></span>
          </label>
          <ReactTooltip 
            place="left"
            effect="solid"
          />
        </div>
    )
}

export default Logout;