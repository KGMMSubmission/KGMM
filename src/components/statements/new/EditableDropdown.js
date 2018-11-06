import React, {Component} from 'react';
import {submitGetRequest} from '../../../network';

export default class EditableDropdown extends Component {
    state = {
        selectedItemId: null,
        dropdownMenuJsx: null,
    };

    constructor(props) {
        super(props);

        this.state.value = this.props.value || '';
    }

    // TODO: add timer, so that the request is not sent on every keystroke.
    handleChange = (event) => {
        const maxValues = 10;
        const value = event.target.value;

        if (this.state.selectedItemId) {
            this.props.onItemSelected(null);
        }
        this.setState({
            value: value,
            selectedItemId: null,
        });

        if (value && value.length >= 0) {
            submitGetRequest(this.props.requestUrl + '?q=' + encodeURIComponent(value), (responseJson) => {
                    if (responseJson.length > 0) {
                        const menuItemsJsx = responseJson.map(
                            (item) => <button id={item.id} key={item.id} className="dropdown-item"
                                    onClick={this.handleItemClick}>{item.label}</button>).slice(0, maxValues);
                        this.setState({
                            dropdownMenuJsx: <div className="dropdown-menu">{menuItemsJsx}</div>,
                        });
                    } else {
                        this.hideDropdownMenu();
                    }
                }, (err) => {
                    console.error(err);
                });
        } else {
            this.hideDropdownMenu();
        }

        this.props.onInput && this.props.onInput(event);
    };

    handleItemClick = (event) => {
        this.setState({
            value: event.target.innerText,
            selectedItemId: event.target.id,
        });
        this.hideDropdownMenu();
        this.props.onItemSelected(event.target.id);
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            const value = event.target.value.trim();
            this.props.onEnterPressed && this.props.onEnterPressed(value);
        }
    };

    hideDropdownMenu = () => {
        this.setState({dropdownMenuJsx: null});
    };

    render() {
        const inputStyle = {height: "21.8px", overflow: "hidden", resize: "none"};
        return <div className="dropdown valueView">
            <input placeholder={this.props.placeholder} className="dropdown-toggle valueView-input" style={inputStyle}
                    value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
            {this.state.dropdownMenuJsx}
        </div>;
    }
}
