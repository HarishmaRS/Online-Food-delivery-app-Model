import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import queryString from "query-string";
import axios from "axios";
import ReactModal from "react-modal";
// import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import "../Style/details.css";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: "-50%",
        // padding: '50px',
        width: '50%',
        height: '90%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: '1px solid brown',
        overflowY : 'scroll'
    },
};
class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: {},
            restId: undefined,
            menuitems: [],
            // updatedmenu: [],
            menuModalIsOpen: false,
            subTotal: 0
        }
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search)
        const { restaurant } = qs;
        // console.log(qs);

        axios({
            method: "GET",
            url: `http://localhost:8080/restaurants/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({ restaurants: res.data.Restaurants, restId: restaurant })
            })
            .catch(err => console.log(err))
    }
    handleModal = (state, value) => {
        const { restId } = this.state;

        axios({
            method: "GET",
            url: `http://localhost:8080/menuitem/${restId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({ menuitems: res.data[0].menu_items, [state]: value })
            })
            .catch(err => console.log(err))
    }
    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuitems]
        const item = items[index];
        if (operationType === 'add') {
            item.qty += 1;
        }
        else if(operationType === 'subtract') {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
            return total += item.qty * item.price
        })
        this.setState({ menuitems: items, subTotal:total})
    }
    render() {
        const { restaurants, menuModalIsOpen, menuitems, subTotal } = this.state;
        // console.log(updatedmenu);
        return (
            <React.Fragment>
                <Carousel showThumbs={false}>
                    <div>
                        <img src="./assets/backgroundimage.png" className="carousel-image" alt="carousel" />
                    </div>
                    <div>
                        <img src="./assets/backgroundimage.png" className="carousel-image" alt="carousel" />
                    </div>
                    <div>
                        <img src="./assets/backgroundimage.png" className="carousel-image" alt="carousel" />
                    </div>
                </Carousel>

                <div>
                    <div className="detailspage-heading">{restaurants.name}</div>
                    <Button variant="danger" className="placeOrder-button" onClick={() => this.handleModal('menuModalIsOpen', true)}>Place Online Order</Button>
                </div>
                <ReactModal
                    isOpen={menuModalIsOpen}
                    style={customStyles}
                    ariaHideApp={false}>
                    <div className="menuModal">
                        <span className="menuRestaurantName">{restaurants.name}</span>
                        <button className="closeModal"onClick={() => this.handleModal('menuModalIsOpen', false)}>x</button>
                        <h4>subTotal : {subTotal}</h4>
                        <button className="paynowButton">Pay Now</button>
                        {menuitems.map((menu, index) => {
                            return <div className="row menurow">

                                <div className="menuName">{menu.name}</div>
                                <div className="menuPrice">&#8377;{menu.price}</div>
                                <div className="menuDescription">{menu.description}</div>

                                <div>
                                    <img className="menuImage" src={`${menu.image_url}`} alt="menuImage" >
                                    </img>
                                    {menu.qty === 0 ? <div>
                                        <button className="addButton" onClick={() => this.addItems(index, 'add')}>Add</button>
                                    </div> :
                                        <div className="addQuantitydiv">
                                            <button className="addQtyButton" onClick={() => this.addItems(index, 'subtract')}>-</button>
                                            <span className="qtyNumber">{menu.qty}</span>
                                            <button className="addQtyButton" onClick={() => this.addItems(index, 'add')}>+</button>
                                        </div>
                                    }
                                </div>
                                <hr className="hrline"></hr>
                            </div>

                        })}
                    </div>
                </ReactModal>
                <div style={{ marginBottom: "100px" }}>
                    <Tabs>
                        <TabList style={{ color: "red" }}>
                            <Tab>Overview</Tab>
                            <Tab>Contact</Tab>
                        </TabList>

                        <TabPanel>
                            <h5 className="tabpanel-heading">About  this Place</h5>
                            <h5 className="tabpanel-heading">Cuisine</h5>
                            <ul>{restaurants.cuisine_id ? restaurants.cuisine_id.map(item =>
                                <li className="tabpanel-content"> {item.name}</li>) : null}</ul>
                            <h5 className="tabpanel-heading">Average Cost</h5>
                            <p className="tabpanel-content">&#8377;{restaurants.cost} for two people(approx)</p>
                        </TabPanel>
                        <TabPanel>
                            <h5 className="tabpanel-heading">Phone Number</h5>
                            <p className="tabpanel-content" >{restaurants.contact_number}</p>
                            <h5 className="tabpanel-heading">{restaurants.name}</h5>
                            <p className="tabpanel-content">{restaurants.address}</p>
                        </TabPanel>
                    </Tabs>
                </div>
            </React.Fragment>
        )
    }
}

export default Details;