import React from "react";

const Modal= ({ showModal,children })=>{
    return(
      
        showModal &&(
            <div className="modalBackground" >
                <div classname="modalContainer">
                  { children }
                </div>
            </div>
        )
      
    )
}

export default Modal;