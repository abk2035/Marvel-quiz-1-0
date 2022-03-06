import React,{useEffect , useState} from "react";
import Stepper from 'react-stepper-horizontal'
const Levels = ({levelNames,quizLevel})=>{

   const[levels,setLevels]=useState([])

   useEffect(()=>{
            const quizSteps=levelNames.map(level=>({title:level.toUpperCase()}));
            setLevels(quizSteps);
   },[levelNames])


    return(
        <div className="levelsContainer" style={{backgroundColor: 'transparent'}}>
              <Stepper 
              steps={ levels }
               activeStep={ quizLevel }
               circleTop={0}
               activeTitleColor={'#d31017'}
               activeColor={'#d31017'}
               completeTitleColor={'#C0C0C0'}
               defaultTitleColor={'#c0c0c0'}
               completeColor={'#c0c0c0'}
               completeBarColor={'#c0c0c0'}
               barStyle={'dashed'}
               size={47}
               circleFontSize={20}
                />
       </div>
    )
    
}

export default React.memo(Levels);