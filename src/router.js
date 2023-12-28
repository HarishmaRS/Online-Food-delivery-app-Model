import React from "react";
import { Route, BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import Header from "./Components/header";
import Home from "./Components/home";
import Filter from "./Components/filter";
import Details from "./Components/details";
class Router extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Route path="*" component={Header}></Route>
                <Route exact path="/" component={Home}></Route>
                <Route path="/filter" component={Filter}></Route>
                <Route path="/details" component={Details}></Route>
            </BrowserRouter>
        )
    }
}

export default Router;