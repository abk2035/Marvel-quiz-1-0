import React, { useRef ,useEffect ,useState, Fragment} from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Landing = ()=>{
    const refWolverine = useRef(null);
    const [btn,setBtn]= useState(false);

    useEffect(()=>{
      refWolverine.current.classList.add('startingImg');
      setTimeout(()=>{
          refWolverine.current.classList.remove('startingImg');
          setBtn(true);  
        },1000);
    },[])

    const setLeftImg = ()=>{ 
        refWolverine.current.classList.add('leftImg');
    }

    const setRightImg = ()=>{
        refWolverine.current.classList.add('rightImg');
    }

    const clearImg = ()=>{
        if(refWolverine.current.classList.contains('leftImg')) {refWolverine.current.classList.remove('leftImg')}
        if(refWolverine.current.classList.contains('rightImg')){refWolverine.current.classList.remove('rightImg')}
    }
// les boutons connexion et...
    const displayBtn = btn&&(
        <Fragment>
              <div onMouseOver={setLeftImg} onMouseOut={clearImg} className='leftBox'>
                 <Link to='/SignUp' className='btn-welcome'>Insription</Link>
             </div>
             <div onMouseOver={setRightImg} onMouseOut={clearImg}  className='rightBox'>
                 <Link to='/Login' className='btn-welcome'>Connexion</Link>
             </div>
        </Fragment>
    );
// fin des bouttons

    return(
        <main ref={refWolverine} className='welcomePage'>
           {displayBtn}
        </main>
    )
}

export default Landing;