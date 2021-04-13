import react, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation  from './components/Navigation/Navigation';
import Signin  from './components/signin/signin';
import Register from './components/Register/Register';
import ImageLinkForm  from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo  from './components/Logo/Logo';
import Rank  from './components/Rank/Rank';
import Clarifai from 'clarifai';
import './App.css';

//Clarifai---------------------------------------------------------------------------------------------------------------------------
const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
//Initial_State---------------------------------------------------------------------------------------------------------------------------  
const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignin: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''    
    }
}
//---------------------------------------------------------------------------------------------------------------------------
class App extends Component {
  
//State_Props---------------------------------------------------------------------------------------------------------------------------  
  constructor() {
    super();
    this.state = initialState
  }
//Load_User---------------------------------------------------------------------------------------------------------------------------
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


//CalculateFaceLocation---------------------------------------------------------------------------------------------------------------------------
  calculateFaceLocation = (data) => {
    const clarifaiData = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image =document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    //console.log(width,height);
    return {
      leftCol: clarifaiData.left_col * width,
      topRow: clarifaiData.top_row * height,
      rightCol: width - (clarifaiData.right_col *width),
      bottomRow: height - (clarifaiData.bottom_row * height)
    }    
  }
  displayFaceBox = (box) => {
    //console.log(box);
    this.setState({box: box})
  }
  onInputchange = (event) => {
    //console.log(event.target.value);
    this.setState({input: event.target.value});
  }

//OnButtonsubmit---------------------------------------------------------------------------------------------------------------------------
  onButtonsubmit = () => {
    //console.log('click');
    this.setState({imageUrl: this.state.input});
      fetch('https://stormy-gorge-48196.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
            fetch('https://stormy-gorge-48196.herokuapp.com/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count}))
              })
              .catch(console.log)
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        //do domething
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        .catch(err => console.log(err));
        //there was an error
  }  
  
//OnRouteChange---------------------------------------------------------------------------------------------------------------------------
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({initialState})
    }else if (route === 'home') {
      this.setState({isSignin: true})
    }
    this.setState({route: route});
  }

//Render---------------------------------------------------------------------------------------------------------------------------
  render() {
    return(
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignin={this.state.isSignin} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
          ? <div>
              <Logo />       
              <Rank  name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputchange={this.onInputchange} onButtonsubmit={this.onButtonsubmit} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          : (
              this.state.route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}
export default App;