import React, {Component} from 'react';
import NewStatementsSection from '../components/statements/new/NewStatementsSection';
import StatementGroupCard from '../components/statements/existing/StatementGroupCard';
import {getPredicate, getResource, groupBy, resourcesUrl, statementsUrl, submitGetRequest} from '../helpers';
import './ResourceDetails.css';
import {Nav, NavLink} from 'reactstrap';
import EditableHeader from '../components/EditableHeader';

export const descriptionSection = 'description';
export const implementationSection = 'implementation';
export const evaluationSection = 'evaluation';
export const miscSection = 'misc';

export default class ResourceDetails extends Component {

    state = {
        allStatements: null,
        results: null,
        error: null,
        title: null,
        predicateMap: {},
        objectMap: {},
    };

    initialState = this.state;
    componentWillMount() {
        this.findResource();
        this.findAllStatements();
    }

    findResource = () => {
        const that = this;

        submitGetRequest(resourcesUrl + this.props.id + '/',
                (responseJson) => {
                    that.setState({
                        title: responseJson.label,
                    });
                },
                (err) => {
                    console.error(err);
                    that.setState({
                        title: null,
                        error: err.message,
                    });
                });
    };

    findAllStatements = () => {
        const that = this;

        submitGetRequest(statementsUrl,
            (responseJson) => {
                that.setState({
                    allStatements: responseJson,
                    error: null,
                });
            },
            (err) => {
                console.error(err);
                that.setState({
                    allStatements: null,
                    error: err.message,
                });
            });
    };

    updateMissingPredicateLabels = () => {
        // TODO: implement more efficient way to fetch all predicates instead of querying them one by one.
        const that = this;
        this.state.allStatements.forEach((statement) => {
            if (!that.state.predicateMap[statement.predicate]) {
                getPredicate(statement.predicate,
                    (responseJson) => {
                        const predicateMap = that.state.predicateMap;
                        predicateMap[responseJson.id] = responseJson.label;
                        that.forceUpdate();
                    },
                    (err) => {
                        console.error(err);
                    });
            }
        });
    };

    updateMissingObjectLabels = () => {
        // TODO: implement more efficient way to fetch all objects instead of querying them one by one.
        const that = this;
        this.state.allStatements.forEach((statement) => {
            if (!that.state.objectMap[statement.statementId]) {
                switch (statement.object.type) {
                    case 'literal': {
                        that.setStatementText(statement)(statement.object.value);
                        break;
                    }
                    case 'resource': {
                        getResource(statement.object.id,
                                (responseJson) => {
                                    that.setStatementText(statement)(responseJson.label);
                                    that.forceUpdate();
                                },
                                (err) => {
                                    console.error(err);
                                });
                        break;
                    }
                    default: {
                        throw 'Unknown statement object type: ' + statement.object.type + '.';
                    }
                }
            }
        });
    };

    reset = () => {
        this.findAllStatements();
        this.setState(this.initialState);
    };

    getStatementText = (statement) => {
        const that = this;
        return () => {
            return that.state.objectMap[statement.statementId] || statement.object.id;
        }
    };

    setStatementText = (statement) => {
        const that = this;
        return (text) => {
            that.state.objectMap[statement.statementId] = text;
        }
    };

    handleHeaderChange = (event) => {
        this.setState({title: event.value});
    };

    render() {
        const id = this.props.id;
        const resultsPresent = this.state.error || (this.state.allStatements);
        const labelId = "http://www.w3.org/2000/01/rdf-schema#label";
        const abstractId = "http://orkg.tib.eu/ontology/abstract";

        if (this.state.error) {
            return <p><strong>Error:</strong> {this.state.error} </p>;
        }

        if (resultsPresent) {
            this.updateMissingPredicateLabels();
            this.updateMissingObjectLabels();

            const titleText = this.state.title;
            const titleJsx = titleText && <EditableHeader {...this.props} value={titleText}
                    onChange={this.handleHeaderChange}/>

            const abstractText = this.state.allStatements.find(statement => statement.subject === id
                    && statement.predicate === abstractId);
            const abstractJsx = abstractText && <div>{abstractText.object.id}</div>;

            const groupingProperty = "predicate";
            const statements = this.state.allStatements.filter(statement => statement.subject === id
                    && statement.predicate !== labelId && statement.predicate !== abstractId);
            const groupedStatements = groupBy(statements, groupingProperty);
            const statementGroupJsxs = groupedStatements.map(
                statementGroup => {
                    if (statementGroup.length > 0) {
                        const propertyId = statementGroup[0][groupingProperty];
                        return <StatementGroupCard href={'/predicate/' + propertyId} key={propertyId}
                                label={this.state.predicateMap[propertyId] || propertyId}
                                onUpdate={this.reset} statementGroup={statementGroup}
                                getStatementText={this.getStatementText}
                                setStatementText={this.setStatementText}/>
                    } else {
                        return null;
                    }
                }
            );

            const newStatementsSectionJsx = <NewStatementsSection subjectId={id} onUpdate={this.reset}/>;
            // const navigationButtons = <ButtonGroup>
            //     <Button disabled={this.props.sectionName === descriptionSection}
            //             onClick={() => window.location = descriptionSection}>
            //         Address
            //     </Button>
            //     <Button disabled={this.props.sectionName === implementationSection}
            //             onClick={() => window.location = implementationSection}>
            //         Implementation
            //     </Button>
            //     <Button disabled={this.props.sectionName === evaluationSection}
            //             onClick={() => window.location = evaluationSection}>
            //         Evaluation
            //     </Button>
            //     <Button disabled={this.props.sectionName === miscSection}
            //             onClick={() => window.location = miscSection}>
            //         Misc
            //     </Button>
            // </ButtonGroup>;

            // const navigationButtons = <Nav>
            //     <NavItem>
            //         <Button disabled={this.props.sectionName === descriptionSection}
            //                 onClick={() => window.location = descriptionSection}>
            //             Address
            //         </Button>
            //     </NavItem>
            //     <NavItem>
            //         <Button disabled={this.props.sectionName === implementationSection}
            //                 onClick={() => window.location = implementationSection}>
            //             Implementation
            //         </Button>
            //     </NavItem>
            //     <NavItem>
            //         <Button disabled={this.props.sectionName === evaluationSection}
            //                 onClick={() => window.location = evaluationSection}>
            //             Evaluation
            //         </Button>
            //     </NavItem>
            //     <NavItem>
            //         <Button disabled={this.props.sectionName === miscSection}
            //                 onClick={() => window.location = miscSection}>
            //             Misc
            //         </Button>
            //     </NavItem>
            // </Nav>;

            const navigationButtons = <Nav>
                <NavLink href={descriptionSection} disabled={this.props.sectionName === descriptionSection}>
                    Problem description
                </NavLink>
                <NavLink href={implementationSection} disabled={this.props.sectionName === implementationSection}>
                    Implementation
                </NavLink>
                <NavLink href={evaluationSection} disabled={this.props.sectionName === evaluationSection}>
                    Evaluation
                </NavLink>
                <NavLink href={miscSection} disabled={this.props.sectionName === miscSection}>
                    Misc
                </NavLink>
            </Nav>;

            return <div className="entityView-main">
                {[titleJsx, abstractJsx, navigationButtons].concat(statementGroupJsxs).concat([newStatementsSectionJsx])}
            </div>;
        } else {
            return null;
        }
    }
}