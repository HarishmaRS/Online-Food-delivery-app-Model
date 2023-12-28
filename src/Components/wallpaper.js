import React from "react";
import axios from 'axios';
import { withRouter } from "react-router-dom";
import "../Style/wallpaper.css";
class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            restaurantByLocation :[],
            inputText: '',
            suggestions: []
        }
    }
    componentDidMount = () => {
         axios({
            method : 'GET',
            url : 'http://localhost:8080/restaurants',
            headers : {'Content-Type' : 'application/json'}
        })
        .then(res => this.setState({restaurants : res.data.Restaurants}))
        .catch(err => console.log(err));
    }
    handleLocation = (id) => {
        const locationId = id.target.value;
        // console.log(locationId);
        sessionStorage.setItem("locationId", locationId);
       axios({
            method: "GET",
            url: `http://localhost:8080/restaurant/${locationId}`,
            headers: { "Content-Type": "application/json" }
        })
            .then(res => this.setState({ restaurantByLocation : res.data.Restaurants }))
            .catch(err => console.log(err))
            
    }

    handleSearch = (event) => {
        let inputSearch = event.target.value;
        // console.log(inputSearch);
        this.setState({ inputText: inputSearch });
        const { restaurants, restaurantByLocation } = this.state;
        if(restaurantByLocation.length === 0){
            const suggestionsList = inputSearch.length > 0 ? restaurants.filter(item => item.name.toLowerCase().includes(inputSearch.toLowerCase())):[]
        this.setState({ suggestions: suggestionsList});
        }
        else {
            const filteredrestaurants = inputSearch.length > 0 ? restaurantByLocation.filter(item => item.name.toLowerCase().includes(inputSearch.toLowerCase())):[]
            this.setState({suggestions : filteredrestaurants})
        }

    }
    showSuggestion = () => {
        const { suggestions, inputText } = this.state;
        if (suggestions.length === 0 && inputText === undefined) {
            return null;
        }
        else if (suggestions.length > 0 && inputText === '') {
            return null;
        }
        else if (suggestions.length === 0 && inputText) {
            return <ul className="ul">
                <li>No search Results found</li>
            </ul>
        }
        else {
            return <ul className="ul">
                {
                    suggestions.map((item, index) => (<li className="restaurantList" key={index} onClick={() => this.selectingRestaurant(item)}>{`${item.name} - ${item.locality},${item.city_name}`}</li>))
                }
            </ul>
        }
    }

    selectingRestaurant = (restaurant) =>{
       this.props.history.push(`/details?restaurant=${restaurant._id}`);
    }
    render() {
        const { locationData } = this.props;
        // const { suggestions, inputText, restaurants,restaurantByLocation } = this.state;
        // console.log(suggestions);
        // console.log(inputText);
        // console.log(restaurants);
        // console.log(restaurantByLocation);
        return (
            <div>
                <img src="./assets/backgroundimage.png" width="100%" height="550px" alt="backgroundimage" />
                <div className="Top-section">
                    <div className="logo">e!</div>
                    <div className="heading">Find the best restaurants, cafes, and bars</div>
                    <div className="inputBox">
                        <select className="locationBox" onChange={this.handleLocation} placeholder="select cities">
                            <option key={0} value="0">select</option>
                            {locationData.map((item) => {
                                return <option key={item.location_id} value={item.location_id}>{`${item.name},${item.city_name}`}</option>
                            })}

                        </select>
                        <span  className="searchDiv">
                            <input type="search" className="searchbox" onChange={this.handleSearch} placeholder="search for restaurants" />
                            {this.showSuggestion()}
                        </span >
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(Wallpaper);