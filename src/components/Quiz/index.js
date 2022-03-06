import React, { Fragment } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuizMarvel } from '../quizMarvel';
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import QuizOver from "../QuizOver";
import { FaChevronRight } from "react-icons/fa";

toast.configure();
const initialState={
    quizLevel:0,
    maxQuestions:10,
    storedQuestions:[],
    question:null,
    options: [],
    idQuestion:0,
    btnDisable: true,
    userAnswer:null,
    score:0,
    showWelcomeMsg: false,
    quizEnd: false,
    percent:0
 }
 const levelNames=['debutant','confirme','expert'];

class Quiz extends React.Component{
 
    constructor(props){
        super(props)
         this.state= initialState
         this.storedDataRef= React.createRef(null)
    }
    

    loadingQuestions= (quizz)=>{
        const fetchedArrayQuiz=QuizMarvel[0].quizz[quizz]

        if(fetchedArrayQuiz.length >= this.state.maxQuestions){
                const newArray = fetchedArrayQuiz.map(({answer,...keepRest}) => keepRest);
                console.log(newArray)

                this.storedDataRef.current= fetchedArrayQuiz;

                this.setState({ storedQuestions: newArray })
        }
    }


    componentDidMount(){
       this.loadingQuestions(levelNames[this.state.quizLevel])
    }

    
    componentDidUpdate(prevProps,prevState){
        const{ 
           maxQuestions,
           storedQuestions,
           idQuestion,
           score,
           quizEnd, 
          }=this.state

       if((storedQuestions !== prevState.storedQuestions)&& storedQuestions.length){
            this.setState({
                question: storedQuestions[idQuestion].question,
                options:storedQuestions[idQuestion].options 
            })
       }

      if(quizEnd !== prevState.quizEnd){
        const gradePercent =  this.getPercentage(maxQuestions,score)
        this.gameOver(gradePercent)
        
      }

       if((idQuestion !== prevState.idQuestion)&& storedQuestions.length){
        this.setState({
            question: storedQuestions[idQuestion].question,
            options:storedQuestions[idQuestion].options ,
            userAnswer:null,
            btnDisable:true
        
        })
       }

       if((this.props.userData.pseudo!== prevProps.userData.pseudo) ){
           this.showToastMsg(this.props.userData.pseudo)
       }

    }


submitAnswer= (selectedAnswer)=>{
 this.setState({
         userAnswer: selectedAnswer,
         btnDisable:false
     })
     
}

showToastMsg= pseudo => {
    if(!this.state.showWelcomeMsg){

        this.setState({   showWelcomeMsg:true   })

        toast.warn('Bienvenue '+ pseudo + ', et bonne chance !!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            bodyClassName: 'toastify-color-welcome'
            });
    }
   
}

nextQuestion=()=>{
    if(this.state.idQuestion === this.state.maxQuestions - 1){
           //this.gameOver()
           this.setState({
            quizEnd: true
           })   
    }else{
        this.setState(prevState=>({
            idQuestion: prevState.idQuestion +1
        })
        )
    }

    const goodAnswer= this.storedDataRef.current[this.state.idQuestion].answer
    if(this.state.userAnswer=== goodAnswer){
              this.setState(prevState=>({
                  score:prevState.score +1 
              }))

       toast.success('Bravo +1 ', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable:false,
                bodyClassName: 'toastify-color-welcome'
                });
    }else{
        toast.error('Rate 0', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            bodyClassName: 'toastify-color-welcome'
            });
    }
}

getPercentage = (maxQuest,ourScore)=>(ourScore/maxQuest)*100;

gameOver= percent =>{
   if(percent >= 50){
    this.setState({
        quizLevel: this.state.quizLevel +1,
        percent:percent
    })
   }else{
    this.setState({
        percent:percent
    })
   }
   
}

loadLevelQuestions  = (param) =>{
    this.setState({...initialState,quizLevel:param})
    this.loadingQuestions(levelNames[param])
}

    render(){
       // const{pseudo}=this.props.userData
      const{ 
       quizLevel,
       maxQuestions,
       question,
       options,
       idQuestion,
       btnDisable,
       userAnswer,
       score,
       quizEnd, 
       percent
      }=this.state

         const displayOption = options.map((option,indexe)=>{ 
             const selected= 'answerOptions'+' '+ (option === userAnswer ? "selected":null)
            return(
                <p key={indexe} className={selected}
                onClick={()=> this.submitAnswer(option)}
                >
                  <FaChevronRight />  {option}
                </p>
            )
          })

        return  quizEnd ?  ( 
            <QuizOver 
                   ref={this.storedDataRef}
                   levelNames={levelNames}
                   score={score}
                   maxQuestions={maxQuestions}
                   quizLevel={quizLevel}
                   percent={percent}
                   loadLevelQuestions={this.loadLevelQuestions}
            />
         )
       : (
        <Fragment>
            {/*<h2>pseudo:{ pseudo }</h2>*/}
             <Levels
             levelNames={levelNames}
             quizLevel={quizLevel}
             />
             <ProgressBar 
             idQuestion={idQuestion}
             maxQuestions={maxQuestions}
             />
             <h2>{question}</h2>

                    {displayOption}                 
            
            <button className ='btnSubmit' 
            disabled={btnDisable}
            onClick={()=>this.nextQuestion()}
            >
             {idQuestion < maxQuestions -1 ? 'Suivant':'Terminer'}
            </button>
        </Fragment>
    )
       
    }  
    
}

export default Quiz;