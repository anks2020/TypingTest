import React from 'react';

function Timer(props){
     return (
      <div >
       <h1 style={{ fontSize: 55,  marginTop:'15px', color:props.color}}>
       {props.minutes} : {props.seconds}
       </h1>
          </div>
        );
      }
    
 export default Timer;
