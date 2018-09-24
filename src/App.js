import React, {Component} from 'react';
// import DataList from './components/DataList';
// import AddResourceModal from './components/AddResourceModal';
// import Graph from 'vis-react';
import {
    Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Card, CardImg,
    CardBody, CardTitle, CardSubtitle, CardText, CardGroup, CardHeader, UncontrolledCollapse, Nav, NavItem, NavLink
} from 'reactstrap';
// import SplitPane from 'react-split-pane';
// import {NotificationContainer} from 'react-notifications';
import {submitGetRequest, url} from './helpers.js';
import './App.css';
import CodeContainer from "./components/CodeContainer";
import StatementGroupCard from "./components/statements/existing/StatementGroupCard";
import Statement from "./components/statements/Statement";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import ResourceDetails from "./pages/ResourceDetails"
import Resources from "./pages/Resources"
import {NotificationContainer} from "react-notifications";

class App extends Component {

    render() {
        return <div className="body">
            <NotificationContainer/>
            <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
                <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">ORKG</a>
                <input className="form-control form-control-dark w-100" type="text" placeholder="Search (not implemented)"
                       aria-label="Search"/>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap">
                            <a className="nav-link" href="#">Sign in (not implemented)</a>
                        </li>
                    </ul>
            </nav>

            <div className="body-content container-fluid">
                <div className="row entityView">
                    <Nav className="bg-light" vertical>
                        <NavItem>
                            <NavLink><Link to="/">Resources</Link></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink><Link to="/addResource">Add resource</Link></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/statements">Statements</NavLink>
                        </NavItem>
                    </Nav>

                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                        <Switch>
                            <Route exact path="/" component={Resources}/>
                            <Route path="/resource/:resourceId" render={({match}) => (
                                <ResourceDetails id={decodeURIComponent(match.params.resourceId)}/>
                            )}/>
                        </Switch>
                    </main>
                </div>
            </div>
        </div>
    }
}

export default App;
