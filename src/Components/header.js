import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Style/header.css";
import Modal from "react-modal";
import GoogleLogin from 'react-google-login';
import { loadGapiInsideDOM } from "gapi-script";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: "-50%",
        padding: '50px',
        // width : '40%',
        transform: 'translate(-50%, -50%)',
    },
};
class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            backgroundStyle: "",
            displayStyle: "none",
            LoginModalIsOpen: false,
            isLoggedIn: false,
            loggedInUser: undefined
        }
    }

    componentDidMount() {
        const initialPath = this.props.history.location.pathname;
        this.setHeader(initialPath);
        (async () => {
            await loadGapiInsideDOM();
        })()
    }

    setHeader = (path) => {
        let bg, display;
        if (path === "/") {
            bg = "#790606";
            display = "none";
        }

        else {
            bg = " #f60707"
            display = "inline-block"
        }
        this.setState({ backgroundStyle: bg, displayStyle: display })
    }
    handleLogin = () => {
        this.setState({ LoginModalIsOpen: true })
    }
    handleCancel = () => {
        this.setState({ LoginModalIsOpen: false })
    }
    responseGoogle = (response) => {
        this.setState({ isLoggedIn: true, loggedInUser: response.profileObj.name, LoginModalIsOpen: false })
    }
    handleLogout = () => {
        this.setState({isLoggedIn: false, loggedInUser: undefined})
    }
    render() {
        const { backgroundStyle, displayStyle, LoginModalIsOpen, isLoggedIn, loggedInUser } = this.state;
        return (
            <div className="header-div" style={{ backgroundColor: backgroundStyle }}>
                <div className="header-logo" style={{ display: displayStyle }}>e!</div>
                {!isLoggedIn ?
                    <div className="login-div">
                        <button className="login-btn" onClick={this.handleLogin}>Login</button>
                        <button className="account-btn">Create an account</button>
                    </div>
                    : <div className="login-div">
                        <button className="login-btn">{loggedInUser}</button>
                        <button className="account-btn" onClick={this.handleLogout}>LogOut</button>
                    </div>
                }
                <Modal
                    isOpen={LoginModalIsOpen}
                    style={customStyles}
                    ariaHideApp={false}
                >
                    <div style={{ margin: "10px 0" }}><span className="ModalHeading">Login</span>
                        <button style={{ float: "right", borderRadius: '5px', color: 'red' }} onClick={this.handleCancel}>X</button></div>
                    <input type="text" className="email" placeholder="Emailid" /><br />
                    <input type="password" className="password" placeholder="password" /><br />
                    <button className="ModalLogin">Login</button>
                    <button className="ModalCancel" onClick={this.handleCancel}>cancel</button><br />
                    <button className="facebook"><img src="./assets/facebook.svg" alt="fb" /> Continue with facebook</button><br />
                    <div>
                        <GoogleLogin
                            clientId="1086751050477-suv2h885325ve8g1b3av3ogsgd5gsqtc.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={"single_host_origin"}
                        />
                    </div>
                    {/* <button className="google"><img src="./assets/google.svg" alt="google"/> Continue with GOOGLE</button> */}
                </Modal>
            </div>
        )
    }
}


export default Header;