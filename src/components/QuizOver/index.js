import React, { Fragment, useEffect ,useState} from "react";
import {GiTreehouse, GiTrophyCup} from 'react-icons/gi';
import Loader from "../Loader";
import Modal from "../Modal";
import axios from "axios"; 

const QuizOver=React.forwardRef((props,ref) => {

    const {
      levelNames,
      score,
      maxQuestions,
      quizLevel,
      percent,
      loadLevelQuestions
    } = props;

    const API_PUBLIC_KEY= process.env.REACT_APP_MARVEL_API_KEY;
    console.log(API_PUBLIC_KEY);
    const hash = '9489cf22051f1fa5f1b03e30e4afee5a';

    const [asked,setAsked]= useState([]);
    const [openModal,setopenModal]=useState(false)
    const [characterInfos,setCharacterInfos]=useState([])
    const [loading,setLoading]=useState(true)

    const showModal=(id)=>{
      setopenModal(true);

        if(localStorage.getItem(id)){
          setCharacterInfos(JSON.parse(localStorage.getItem(id)))
          setLoading(false) 
        }else{
        axios.get('https://gateway.marvel.com/v1/public/characters/'+id+'?ts=1&apikey='+API_PUBLIC_KEY+'&hash='+hash)
             .then(response=>{
               console.log(response)
               setCharacterInfos(response.data)
               setLoading(false) 
               localStorage.setItem(id, JSON.stringify(response.data))

              if(!localStorage.getItem('marvelStorageDate')){
                localStorage.setItem('marvelStorageDate', Date.now());
              }

                })

             .catch(err => console.log(err))
         }
     } 

    const hideModal=()=>{
      setopenModal(false);
      setLoading(true)
    }

    const checkDataAge= date => {

      const today= Date.now()
      const timeDifference= today - date
      const dayDifference = timeDifference/(1000*3600*24);

      if(dayDifference >= 15){
       localStorage.clear()
       localStorage.setItem('marvelStorageDate', Date.now());
      }
      
    }

    const capitalizeFirstLetter= string => {
       return string.charAt(0).toUpperCase()+string.slice(1);
    }

    useEffect(()=>{
        setAsked (ref.current)

        if(localStorage.getItem('marvelStorageDate')){
         const date=localStorage.getItem('marvelStorageDate')
          checkDataAge(date);

        }
    },[ref])

    
    const averageGrade= maxQuestions/2;
    if(score < averageGrade){
      //setTimeout(()=> loadLevelQuestions(0),3000);
      setTimeout(()=> loadLevelQuestions(quizLevel),5000);
    }

    const questionAnswer = score >= averageGrade ?
      (
          asked.map(question =>{
          return(
            <tr key={question.id}>
                <td>{question.question}</td>
                <td>{question.answer}</td>
                <td>
                    <button 
                    className="btnInfo"
                    onClick={()=>showModal(question.heroId)}
                    >
                     Infos
                    </button>
                </td>
            </tr>
          )
        })
      )
    :
      (
         
        <tr>
            <td colSpan="3">
               <Loader
                 styling={{textAlign: "center",color: "red"}}
                 loadingMsg={"Pas de réponses !"}
               />
            </td>
        </tr>
     )

     

    const decision = score >= averageGrade ?
       (
         <Fragment>
          <div className="stepsBtnContainer">
             { quizLevel < levelNames.length ?
                (
                <Fragment>
                 <p className="successMsg">
                   <GiTrophyCup size="50px"/>
                   Bravo, passez au niveau suivant  !
                 </p>
                 <button className="btnResult success"
                 onClick={()=>loadLevelQuestions(quizLevel)}
                 >
                   Niveau Suivant
                 </button>
                </Fragment>
               )
               :
               (
                <Fragment>
                 <p className="successMsg">Bravo, Vous etes un expert !</p>
                 <button className="btnResult gameOver"
                 onClick={()=>loadLevelQuestions(0)}
                 >Accueil</button>
               </Fragment>
               )
            
             }  
        </div>
         <div className="percentage">
              <div className="progressPercent"> Reussite: {percent}%</div>
              <div className="progresssPercent">{'Note: '+ score + '/' + maxQuestions }</div>
         </div>
      </Fragment>
     )
     :
     (
           <Fragment>
               <div className="stepsBtnContainer">
                 <p className="failureMsg">Vous avez echoué  !</p>
               </div>
              <div className="percentage">
                <div className="progressPercent"> Reussite: {percent}%</div>
                <div className="progresssPercent">{'Note: '+ score + '/' + maxQuestions } </div>
              </div>
           </Fragment>
     ) 

const resultInModal= !loading 
          ? (<Fragment>
                <div className="modalHeader">
                    <h2>{characterInfos.data.results[0].name}</h2>
                </div>
                <div className="modalBody">
                    <div className="comicImage">
                      <img src={characterInfos.data.results[0].thumbnail.path+'.'+characterInfos.data.results[0].thumbnail.extension}
                       alt={characterInfos.data.results[0].name}
                       />
                      { characterInfos.attributionText }
                    </div>
                    <div className="comicDetails">
                       <h3>Description</h3>
                       {
                         characterInfos.data.results[0].description?
                         <p>{characterInfos.data.results[0].description}</p>
                         :<p>Description indisponible...</p>
                       }
                       <h3>Plus d'infos</h3>
                       {
                         characterInfos.data.results[0].urls&&characterInfos.data.results[0].urls.map((url,index)=>{
                           return (
                             <a key={index}
                                href={url.url}
                                rel="noopener noreferrer"
                                target="_blank"
                             >
                               {capitalizeFirstLetter(url.type)}
                            </a>
                           )
                         })
                       }
                    </div>
                </div>
                <div className="modalFooter">
                     <button className="modalBtn"onClick={hideModal}>Fermer</button>
                </div>
             </Fragment>)
          :(
             <Fragment>
                <div className="modalHeader">
                    <h2>Reponse de Marvel...</h2>
                </div>
                <div className="modalBody">
                     <Loader/>
                </div>
             </Fragment>
          )
   

    return(
       <Fragment>
        
        {decision}
        
         <hr />
         <p>les reponses aux questions posées</p>

         <div className='answerContainer'>
             <table className="answers">
                 <thead>
                     <tr>
                         <th>Question</th>
                         <th>Reponses</th>
                         <th>Infos</th>
                     </tr>
                 </thead>
                 <tbody>
                     {questionAnswer}
                 </tbody>
             </table>
         </div>
        <Modal showModal={openModal} >
              {resultInModal}
        </Modal>
      </Fragment>
    
     
    )
}) 

//pour recharger seulement les composants ayant eut une modification
export default React.memo(QuizOver);