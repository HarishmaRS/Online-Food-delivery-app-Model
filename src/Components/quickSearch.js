import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Style/quickSearch.css";
import QuickSearchItem from "./quickSearchItem";
class QuickSearch extends React.Component {
    render() {
        const { quicksearch } = this.props;
        const sortedQuickSearch = quicksearch.sort((a, b) => a.mealtype_id - b.mealtype_id);
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="Qsearch-heading">Quick Searches</div>
                        <div className="Qsearch-subheading">Discover restaurants by type of meal</div>
                    </div>
                </div>
                <div className="container foodImageContainer">
                    <div className="row">
                        {sortedQuickSearch.map((item) => {
                            return <QuickSearchItem quickseacrhitemdata={item}
                                // key={index}
                                // image={item.image}
                                // name={item.name}
                                // description={item.content}
                            />
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default QuickSearch;
