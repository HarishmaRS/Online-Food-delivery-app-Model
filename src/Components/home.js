import React from "react";
import axios from 'axios';

import Wallpaper from "./wallpaper";
import QuickSearch from "./quickSearch";
// import Filter from "./filter";
// import Details from "./details";
// import Header from "./header"
class Home extends React.Component{
    constructor(){
         super();
         this.state = {
            locations : [],
            meals : []
         }
    }
    componentDidMount() {
        sessionStorage.clear();
        axios({
            method: 'GET',
            url: 'http://localhost:8080/locations',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
            this.setState({locations: response.data.Locations})
        })
        .catch(err => {console.log(err);})

        axios({
            method: 'GET',
            url: 'http://localhost:8080/meals',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
            this.setState({meals: response.data.MealTypes})
        })
        .catch(err => {console.log(err);})
    }
    render(){
        const {locations,meals} = this.state;
        return(
            <div>
                {/* <Header/> */}
                <Wallpaper locationData={locations}/>
                <QuickSearch quicksearch={meals}/>
                {/* <Filter/> */}
                {/* <Details/> */}
            </div>
        )
    }
}


export default Home;