import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Style/filter.css";
import queryString from "query-string";
import axios from "axios";
class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            mealtype_id: undefined,
            location_id: undefined,
            cuisine_id: [],
            lcost: undefined,
            hcost: undefined,
            sort: 1,
            page: 1,
            pageCount : []
        }

    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { mealtype, location } = qs;
        const filterObj = {
            mealtype_id: Number(mealtype),
            location_id: location,
        };

        axios({
            method: "POST",
            url: 'http://localhost:8080/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurants: res.data.restaurants,pageCount: res.data.pageCount, mealtype_id: mealtype, location_id: location })
            })
            .catch(err => { console.log(err) });

        axios({
            method: 'GET',
            url: 'http://localhost:8080/locations',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ locations: response.data.Locations })
            })
            .catch(err => { console.log(err) })
    }

    handleLocationChange = (event) => {
        const location_id = event.target.value;
        const { mealtype_id, cuisine_id, lcost, hcost, sort, page } = this.state;
        const filterObj = {
            mealtype_id: mealtype_id,
            location_id: location_id === '0' ? undefined : location_id,
            cuisine_id: cuisine_id.length === 0 ? undefined : cuisine_id,
            lcost: lcost,
            hcost: hcost,
            sort: sort,
            page: page
        };

        axios({
            method: "POST",
            url: 'http://localhost:8080/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurants: res.data.restaurants,pageCount: res.data.pageCount,  location_id })
            })
            .catch(err => { console.log(err) })
    }
    handleCostChange = (lcost, hcost) => {
        const { mealtype_id, location_id, cuisine_id, sort, page } = this.state;
        const filterObj = {
            mealtype_id: Number(mealtype_id),
            lcost:lcost,
            hcost:hcost,
            sort,
            page,
            location_id,
            cuisine_id: cuisine_id.length === 0 ? undefined : cuisine_id
        };
        axios({
            method: "POST",
            url: 'http://localhost:8080/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurants: res.data.restaurants,pageCount: res.data.pageCount,  lcost, hcost })
            })
            .catch(err => { console.log(err) })
    }
    handleSortChange = (sort) => {
        const { mealtype_id, location_id, cuisine_id, lcost, hcost } = this.state;
        const filterObj = {
            mealtype_id: Number(mealtype_id),
            lcost,
            hcost,
            sort,
            page : 1,
            location_id,
            cuisine_id: cuisine_id.length === 0 ? undefined : cuisine_id
        };
        axios({
            method: "POST",
            url: 'http://localhost:8080/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurants: res.data.restaurants,pageCount: res.data.pageCount,  sort, page: 1 })
            })
            .catch(err => { console.log(err) })
    }
    
    handleCuisineChange = (cuisine) => {

        const { mealtype_id, cuisine_id, location_id, lcost, hcost, sort, page } = this.state;
        const index = cuisine_id.slice();
        if (index.indexOf(cuisine) === -1) {
            index.push(cuisine)
        }
        else {
            index.splice(index.indexOf(cuisine), 1);
        }
        const filterObj = {
            mealtype_id: Number(mealtype_id),
            location_id: location_id,
            cuisine_id: index.length > 0 ? index : undefined,
            lcost: lcost,
            hcost: hcost,
            sort: sort,
            page
        };

        axios({
            method: "POST",
            url: 'http://localhost:8080/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurants: res.data.restaurants,pageCount: res.data.pageCount,  cuisine_id: index })
            })
            .catch(err => { console.log(err) })
    }
    handlePageChange = (pageNumber) => {
        const {mealtype_id, cuisine_id, location_id, lcost, hcost, sort} = this.state
        const filterObj = {
            mealtype_id: Number(mealtype_id),
            location_id: location_id,
            cuisine_id: cuisine_id.length === 0 ? undefined : cuisine_id,
            lcost: lcost,
            hcost: hcost,
            sort: sort,
            page : pageNumber
        }
        axios({
            method:'POST',
            url:'http://localhost:8080/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
        .then(res => {
            this.setState({restaurants: res.data.restaurants, pageCount: res.data.pageCount, page: pageNumber})
        })
        .catch(err => console.log(err));
    }
    handleRestaurantNavigate= (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }
    render() {
        const { restaurants, locations,pageCount,page } = this.state;
        const firstPage = page === 1;
        const lastPage = page === pageCount.length;
        return (
            <div className="container" style={{ marginBottom: "20px" }}>
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
                            <input type="checkbox" className="cuisineOption" onChange={() => this.handleCuisineChange(1)} /><label>North Indian</label><br />
                            <input type="checkbox" className="cuisineOption" onChange={() => this.handleCuisineChange(2)} /><label>South Indian</label><br />
                            <input type="checkbox" className="cuisineOption" onChange={() => this.handleCuisineChange(3)} /><label>Chinese</label><br />
                            <input type="checkbox" className="cuisineOption" onChange={() => this.handleCuisineChange(4)} /><label>Fast Food</label><br />
                            <input type="checkbox" className="cuisineOption" onChange={() => this.handleCuisineChange(5)} /><label>Street Food</label><br />
                            <div className="filter-subheading">Cost for two</div>
                            <input type="radio" name="cost" className="cuisineOption" onChange={() => this.handleCostChange(1, 500)} /><label>less than &#8377;500</label><br />
                            <input type="radio" name="cost" className="cuisineOption" onChange={() => this.handleCostChange(500, 1000)} /><label>&#8377;500 to &#8377;1000</label><br />
                            <input type="radio" name="cost" className="cuisineOption" onChange={() => this.handleCostChange(1000, 1500)} /><label>&#8377;1000 to &#8377;1500</label><br />
                            <input type="radio" name="cost" className="cuisineOption" onChange={() => this.handleCostChange(1500, 2000)} /><label>&#8377;1500 &#8377;2000</label><br />
                            <input type="radio" name="cost" className="cuisineOption" onChange={() => this.handleCostChange(2000, 50000)} /><label>&#8377;2000+</label><br />
                            <div className="filter-subheading">Sort</div>
                            <input type="radio" name="sort" className="cuisineOption" onChange={() => this.handleSortChange(1)} /><label>Price low to high</label><br />
                            <input type="radio" name="sort" className="cuisineOption" onChange={() => this.handleSortChange(-1)} /><label>Price high to low</label><br />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 col-lg-9">
                        {restaurants.length > 0 ? restaurants.map(item => {
                            return <div className="details-panel" onClick={()=> this.handleRestaurantNavigate(item._id)}>
                                <div className="row upperSection">
                                    <div className="col-xs-12 col-sm-4 col-lg-2">
                                        <img src={`${item.thumb}`} className="detailsImage" alt="kfc" />
                                    </div>
                                    <div className="col-xs-12 col-sm-8 col-lg-10">
                                        <div className="detailsHeading">{item.name}</div>
                                        <div className="detailsSubHeading">{item.locality}</div>
                                        <div className="detailsAddress">{item.address}</div>
                                    </div><hr className="details-hrLine" />
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
                        }) : <div className="no-record">No Records Found...</div>}
                        {restaurants.length > 0 ?
                            <div className="pagination">
                                <button className="pagination-button" onClick={() => !firstPage && this.handlePageChange(page - 1)}>&laquo;</button>
                                {pageCount.map(pageNo => {
                                return <button key={pageNo} className={`pagination-button ${pageNo === page ? 'active' : ''}`} onClick={() => this.handlePageChange(pageNo)}>{pageNo}</button>
                                })}
                                <button className="pagination-button" onClick={() => !lastPage && this.handlePageChange(page + 1)}>&raquo;</button>
                            </div> : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;