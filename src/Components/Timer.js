import React from 'react';

class Timer extends React.Component {
    render() {
     return (
      <div >
       <h1 style={{ fontSize: 55, marginLeft:'3%', marginTop:'20px'}}>
       {this.props.minutes} : {this.props.seconds}
       </h1>
          </div>
        );
      }
    }
 export default Timer;