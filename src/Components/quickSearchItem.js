import React from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

class QuickSearchItem extends React.Component {
    handleNavigate = (mealId) => {
        const location_id = sessionStorage.getItem('locationId');
        if(location_id){
            this.props.history.push(`/filter?mealtype=${mealId}&location=${location_id}`);
        }
        else{
            this.props.history.push(`/filter?mealtype=${mealId}`);
        }
    }
    render() {
        const {name,content,image,mealtype_id} = this.props.quickseacrhitemdata
        return (

            <div className="foodImage-div col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleNavigate(mealtype_id)}>
                <img className="image" src={image} height="150px" width="150px" alt="mealtype" />
                <div className="food-description">
                    <h2>{name}</h2>
                    <p className="para">{content} </p>
                </div>
            </div>
        )
    }
}

export default withRouter(QuickSearchItem);