import React from 'react';
import logo from "../assets/images/camera-logo.png";
import '../styles/App.css';
import { Icon } from 'antd'

export class Header extends React.Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Record Your Beautiful Memories</h1>
                {
                    this.props.isLoggedIn ?
                        <a onClick={this.props.handleLogout} className="logout">
                            <Icon type="logout"/>{' '}Logout
                        </a> : null
                }

            </header>
        );
    }
}