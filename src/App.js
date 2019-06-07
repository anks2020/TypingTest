import React,{Component} from 'react';
import './App.css';
import axios from 'axios';
import Timer from './Components/Timer';
class App extends Component {
  constructor(props)
  {
    super(props)
    this.state={
      referenceText:'',
      typedText:'',
      typoIndex:-1,
      correctText:'',
      wordCompleted:false,
      errorStart:-1,
      timer:20,
      wpm:'',
      seconds:'00',
      minutes:'00',
      disabled:true,
      raceComplete:false
    }
  }
  componentDidMount = () =>{
        axios.get('http://www.randomtext.me/api/')
        .then((res)=>{
          let broken=res.data.text_out.split('</p>');
          let reftext = broken.map((t,key)=>{
            if(key===0)
            return(t.slice(3))
            else
            return(t.slice(4))
          })
          
          this.setState({referenceText:reftext.join(' ')});
          setTimeout(this.setTimer,3000);
        })
      }
      keyUp =(value)=>{
        let todo=this.state.referenceText.substr(this.state.correctText.length);
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== todo[i]) {
              if(i===0 || value[i-1]===todo[i-1])
              {
                  this.setState({typoIndex :i, errorStart:i},
                  ()=>{
                    this.raceOn();
                  })
              }
              else
              {
                this.setState({typoIndex :i},
                  ()=>{
                  this.raceOn();
                  })
              }
              
              break;
          }
          this.setState({typoIndex :-1,errorStart:-1},()=>this.raceOn());
        }
      }
      clearText =()=>{
            this.setState({typedText:''})
          }
      raceOn =()=>{
            let todo = this.state.referenceText;
            let newHTML = '<span class="correct">'

      if (this.state.typoIndex === -1) {
        if(this.state.wordCompleted)
        {
          newHTML += this.state.correctText;
          newHTML += '</span>'
          newHTML += todo.substr(this.state.correctText.length)
        }
        else
        {
          if(this.state.typedText.length===0)
          {
                newHTML += this.state.correctText;
                newHTML += '</span>'
                newHTML += todo.substr(this.state.correctText.length)
          }
          else{
                  newHTML += this.state.correctText+this.state.typedText
                  newHTML += '</span>'
                  newHTML += todo.substr(this.state.correctText.length+this.state.typedText.length)
          }
          document.getElementById('referenceText').innerHTML=newHTML;
        }

      }
      else{ //error
        let cx;
        if(this.state.wordCompleted)
        cx=this.state.correctText
        else
        cx=this.state.correctText+this.state.typedText.substring(0,this.state.typoIndex)
        newHTML += cx
        newHTML += '</span>'
        newHTML += '<span class="incorrect">'
        let cw;
        if(this.state.wordCompleted)
        cw=todo.substr(cx.length,this.state.typedText.length)
        else
        cw=todo.substr(cx.length, this.state.typedText.length-(this.state.typoIndex));
        newHTML += cw;
        newHTML += '</span>'
        newHTML += todo.substr(this.state.correctText.length+this.state.typedText.length)
        
      document.getElementById('referenceText').innerHTML=newHTML;
      }
          }
      textChanged=(event)=>{
            let completeText = this.state.correctText; //new
            let todo=this.state.referenceText.substr(this.state.correctText.length);
            if(event.target.length===0)
            {this.setState({typoIndex:-1,wordCompleted:true},()=>this.raceOn()) ; return ;}
            this.setState(
              {
                typedText:event.target.value
              },()=>{
                this.keyUp(this.state.typedText);}
              )

            if(event.target.value.endsWith(" ") && this.state.typoIndex===-1 && event.target.value.charAt(event.target.value.length-2)!==' ') //new
            {
              completeText+=event.target.value;
              if(event.target.value[event.target.value.length-1]===todo[event.target.value.length-1])
              {this.clearText();
              this.setState({correctText:completeText, wordCompleted:true}) //new
              }
            }
            else{
              this.setState({wordCompleted:false})
            }
              
          }
          endTypingSpeed = () =>{
            var wpm = Math.floor(this.state.correctText.split(' ').length/2)
            alert('Time Over')
            this.setState({disabled:true, raceComplete:true, wpm:wpm})
          }
          timerStart=()=>{
            if (this.state.timer === -1) {
              this.endTypingSpeed()
              clearInterval(this.intervalHandle);
              return;
            }
            var mins= Math.floor(this.state.timer/60)
            var minutes = mins<10?"0" +mins:mins
            var secs = this.state.timer%60;
            var seconds= secs < 10? "0" + secs:secs;
            var timer= this.state.timer-1
            this.setState({minutes:minutes, seconds:seconds, timer:timer})
          }
          setTimer =()=>{
            this.setState({disabled:false})
            this.intervalHandle = setInterval(this.timerStart, 1000)
          }
  render(){
  return (
    <div className="App">
      <header className="App-header">
        <p>
         TypeRacer
        </p>
      
      </header>
      <div className="MainDiv">
      {this.state.raceComplete? <h2>Your typing speed is: {this.state.wpm} wpm.</h2>:null}
      <Timer minutes={this.state.minutes} seconds={this.state.seconds}/>
         <div id='referenceText'>{this.state.referenceText} </div>
        <input type="text" 
        id='typed'
        style={{marginTop:'25px'}}
         value={this.state.typedText} 
         disabled={this.state.disabled}
          onKeyup= {(e)=>this.keyUp(e.target.value)}
          onChange={(e)=>this.textChanged(e)}/>
       </div>
       
    </div>
  );
  }
}

export default App;