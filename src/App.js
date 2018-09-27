import React, { Component } from 'react';
import './App.css';
import Navigation from '../src/Components/Navigation/Navigation';
import Signin from '../src/Components/Signin/Signin';
import Register from '../src/Components/Register/Register';
import FaceRecognition from '../src/Components/FaceRecognition/FaceRecognition';
import Logo from '../src/Components/Logo/Logo';
import ImageLinkForm from '../src/Components/ImageLinkForm/ImageLinkForm';
import Rank from '../src/Components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';




const app = new Clarifai.App({
  apiKey: '6501cc51a4ba428c92fb8167a24ac804'
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
      }
    }
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn : false,
    }
  }


  

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(clarifaiFace);
    // console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottonRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }


  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }


  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state; 
    return (
      <div className="App">

        <Particles className='Particles' params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

        {route === 'home' 
            ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                <FaceRecognition box={box} imageUrl={imageUrl} />
              </div>
              : (
                route === 'signin'
              )
             ? <Signin onRouteChange={this.onRouteChange}/>
             : <Register onRouteChange={this.onRouteChange}/>
            }
      </div>
    );
  }
}

export default App;
