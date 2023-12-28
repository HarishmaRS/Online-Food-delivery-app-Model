import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "../Style/filter.css";
import queryString from "query-string";
import axios from "axios";
class Filter extends React.Component {
    constructor(){
        super();
        this.state = {
            mealtypes : [],
            locations : [],
            restuarant: [],
            currentPage: 1,          
            itemsPerPage: 2,  
        }

    }
    componentDidMount = async () => {
        // Get the values from query string which is coming from homepage.
        const qs = queryString.parse(this.props.location.search);
        const location = qs.location;
        const mealtype = Number(qs.mealtype);
        const mealtype_name = qs.mealtype_name;

        this.setState({ option: mealtype_name });
        // Declare the locations and mealtypes value in payload.
        const inputObj = {
            location_id: location,
            mealtype_id: mealtype
        }

        // Making api call to fetch the restaurant data based on payload.
        const restuarant = await axios({
            method: 'POST',
            url: 'http://localhost:8900/filter',
            headers: { 'Content-Type': 'application/json' },
            data: inputObj
        })
        // once get the value then update the state variable.
        this.setState({ restuarant: restuarant.data, mealtype_id: mealtype, location_id: location });

        // Making api call for locations data to showing drop-downs filters.
        const locationDD = await axios({
            method: 'GET',
            url: 'http://localhost:8900/locations',
            headers: { 'Content-Type': 'application/json' }
        });
        // Update the location variable in state.
        this.setState({ locations: locationDD.data });
    }
    // componentDidMount(){
    //    const qs = queryString.parse(this.props.location.search);
    //    const {mealtype,location} = qs;
    //     const filterObj = {
    //         mealtype_id : mealtype,
    //         location_id : location

    //     };

    //    axios({
    //         method : "POST",
    //         url : 'http://localhost:8900/filter',
    //         headers : {'Content-Type' : 'application/json'},
    //         data : filterObj
    //    })
    //    .then(res => {
    //     this.setState({mealtypes : res.data.mealtypes})
    //    })
    //    .catch(err => {console.log(err)});

    //    axios({
    //     method: 'GET',
    //     url: 'http://localhost:8900/locations',
    //     headers: {'Content-Type': 'application/json'}
    // })
    // .then(response => {
    //     this.setState({locations: response.data.locations})
    // })
    // .catch(err => {console.log(err)})
    // }
    handleLocationChange = async (event) => {
        // Getting the location id from drop-down.
        const location_id = event.target.value;
        const { sort, mealtype_id, lcost, hcost, cuisine_id } = this.state;

        // Loading the all values in payload.
        const inputObj = {
            sort: sort,
            mealtype_id: mealtype_id,
            location_id: location_id === "Select Locations" ? undefined : location_id,
            lcost: lcost,
            hcost: hcost,
            // if cuisine_id is empty array, this function willn't work so set the value as undefined.
            cuisine_id: cuisine_id && cuisine_id.length > 0 ? cuisine_id : undefined
        }
        // Making the api call to get location based restaurant data.
        const restuarant = await axios({
            method: 'POST',
            url: 'http://localhost:8900/filter',
            headers: { 'Content-Type': 'application/json' },
            data: inputObj
        });
        // Once get the data, then update restaurant, location id and page number in 1.
        this.setState({ restuarant: restuarant.data, location_id, currentPage: 1 });
    }
    // handleLocationChange = (event) => {
    //     const location_id = event.target.value;
    //     const {mealtype_id} =this.state;
    //     const filterObj = {
    //         mealtype_id : mealtype_id,
    //         location_id : location_id,
    //     };

    //    axios({
    //         method : "POST",
    //         url : 'http://localhost:8900/filter',
    //         headers : {'Content-Type' : 'application/json'},
    //         data : filterObj
    //    })
    //    .then(res => {
    //     this.setState({mealtypes : res.data.mealtypes})
    //    })
    //    .catch(err => {console.log(err)})
    // }
    render() {
        const{restuarant, mealtypes,locations,currentPage, itemsPerPage } = this.state;
        const lastIndex = currentPage * itemsPerPage
        const firstIndex = lastIndex - itemsPerPage
        const currentRestaurant = restuarant.slice(firstIndex, lastIndex)
        let result = currentRestaurant && currentRestaurant.length > 0 ? currentRestaurant.map(item => {
            return <div class="details-panel" onClick={() => this.handleViewRestaurant(item._id)}>
                <div class="row upperSection">
                    <div className="col-xs-12 col-sm-4 col-lg-2">
                        <img src={item.thumb} className="detailsImage" />
                    </div>
                    <div className="col-xs-12 col-sm-8 col-lg-10">
                        <h4 class="detailsHeading">{item.name}</h4>
                        <h4 class="detailsSubHeading">{item.locality}</h4>
                        <h5 class="detailsAddress">{item.address}</h5>
                    </div>
                </div>
                <hr className="details-hrLine" />


                <div class="row lowerSection">
                    <div className="col-2">
                        <h5 class="cuisines">CUISINES:</h5>
                        <h5 class="cost-for-two">COST FOR TWO:</h5>
                    </div>
                    <div className="col-10">
                        <h5 class="bakery">{item.cuisine_id.map(CuisineItem => CuisineItem.name).join(" , ")}</h5>
                        <h5 class="rupees">{item.cost}</h5>
                    </div>
                </div>


            </div>

        }) : <div className="no-records">No Records found</div>

        // console.log(mealtypes);
        return (
            <div className="container" style={{marginBottom:"20px"}}>
                <div className="row filterpage-heading">Restaurants in Mumbai</div>
                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-3">
                        <div className="filter-panel">
                            <div className="filter-text">Filter</div>
                            <div className="filter-subheading">Select Location</div>
                            <select className="location-box" onChange={this.handleLocationChange}>
                            <option key={0} value="0">select</option>
                            {locations.map((item) => {
                                return <option key={item.location_id} value={item.location_id}>{`${item.name},${item.city_name}`}</option>
                            })}
                                
                            </select>
                            <div className="filter-subheading">Cuisine</div>
                            <input type="checkbox" className="cuisineOption" /><label>North Indian</label><br />
                            <input type="checkbox" className="cuisineOption" /><label>South Indian</label><br />
                            <input type="checkbox" className="cuisineOption" /><label>Chinese</label><br />
                            <input type="checkbox" className="cuisineOption" /><label>Fast Food</label><br />
                            <input type="checkbox" className="cuisineOption" /><label>Street Food</label><br />
                            <div className="filter-subheading">Cost for two</div>
                            <input type="radio" name="cost" className="cuisineOption" /><label>less than &#8377;500</label><br />
                            <input type="radio" name="cost" className="cuisineOption" /><label>&#8377;500 to &#8377;1000</label><br />
                            <input type="radio" name="cost" className="cuisineOption" /><label>&#8377;1000 to &#8377;1500</label><br />
                            <input type="radio" name="cost" className="cuisineOption" /><label>&#8377;1500 &#8377;2000</label><br />
                            <input type="radio" name="cost" className="cuisineOption" /><label>&#8377;2000+</label><br />
                            <div className="filter-subheading">Sort</div>
                            <input type="radio" name="sort" className="cuisineOption" /><label>Price low to high</label><br />
                            <input type="radio" name="sort" className="cuisineOption" /><label>Price high to low</label><br />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 col-lg-9">
                    <div>
                            {result}
                        </div>
                        {/* {mealtypes.length > 0 ? mealtypes.map(item => {
                            return <div className="details-panel">
                            <div className="row upperSection">
                                <div className="col-xs-12 col-sm-4 col-lg-2">
                                    <img src="./assets/dinner.jpg" className="detailsImage" alt="kfc" />
                                </div>
                                <div className="col-xs-12 col-sm-8 col-lg-10">
                                    <div className="detailsHeading">{item.name}</div>
                                    <div className="detailsSubHeading">{item.locality}</div>
                                    <div className="detailsAddress">{item.address}</div>
                                </div><hr className="details-hrLine"/>
                            </div>
                            <div className="row lowerSection">
                                <div className="col-2">
                                    <div className="detailsCuisine">Cuisine:</div>
                                    <div className="detailsCuisine">Cost for two:</div>
                                </div>
                                <div className="col-10">
                                    <div className="detailsCuisineValue">{item.cuisine_id.map(cuisineitem => `${cuisineitem.name}; `)}</div>
                                    <div className="detailsCuisineValue">&#8377;{item.cost}</div>
                                </div>
                            </div>
                        </div>
                        }) : <div className="no-record">No Records Found...</div>} */}
                        {mealtypes.length > 0 ?
                        <div className="pagination">
                            <button className="pagination-button">&laquo;</button>
                            <button className="pagination-button">1</button>
                            <button className="pagination-button">2</button>
                            <button className="pagination-button">3</button>
                            <button className="pagination-button">4</button>
                            <button className="pagination-button">5</button>
                            <button className="pagination-button">&raquo;</button>
                        </div> : null }
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;
