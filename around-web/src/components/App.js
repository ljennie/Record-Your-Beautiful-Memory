import React, { Component } from 'react';
import { Header } from './Header';
import { Main } from './Main';
import {TOKEN_KEY} from '../constants';

import picture1 from "../assets/images/pic1.jpeg";
import picture2 from "../assets/images/pic2.jpeg";
import picture3 from "../assets/images/pic3.jpeg";
import picture4 from "../assets/images/pic4.jpeg";

import '../styles/App.css';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';



class App extends Component {

    state = {
        isLoggedIn: Boolean(localStorage.getItem('TOKEN_KEY'))
    }

    handleLogin = (token) => {
        localStorage.setItem('TOKEN_KEY', token);
        this.setState({isLoggedIn: true});
    }

    handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        this.setState({isLoggedIn: false});
    }

    getPicture = () => {
        if (!this.state.isLoggedIn) {
            return (
                <Carousel showArrows={true}>
                    <div>
                        <img src={picture1} />
                    </div>
                    <div>
                        <img src={picture2} />
                    </div>
                    <div>
                        <img src={picture3} />
                    </div>
                    <div>
                        <img src={picture4} />
                    </div>
                </Carousel>
            );
        }

    }

    render() {

        return (
          <div className="App">
            <Header isLoggedIn={this.state.isLoggedIn} handleLogout={this.handleLogout}/>
            <div>{this.getPicture()}</div>
            <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin}/>
          </div>
        );
    }
}

export default App;
