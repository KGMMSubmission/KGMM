import React, { Component } from 'react';
import { Form, FormGroup, Label } from 'reactstrap';
import Tooltip from '../../Utils/Tooltip';
import ResearchProblemInput from './ResearchProblemInput';
import AddTemplateButton from './TemplateWizard/AddTemplateButton';
import TemplateWizard from './TemplateWizard/TemplateWizard';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { StyledHorizontalContribution } from './styled';
import { connect } from 'react-redux';
import { getStatementsByObjectAndPredicate } from 'network';
import { updateResearchProblems, openTour } from 'actions/addPaper';
import PropTypes from 'prop-types';

class Contribution extends Component {
    state = {
        showVideoDialog: false,
        templates: [],
        isTemplatesLoading: false,
        isTemplatesFailesLoading: false
    };

    componentDidMount() {
        this.loadContirbutionTemplates();
    }

    /**
     * Fetch the templates of a resource
     *
     * @param {String} resourceId Resource Id
     * @param {String} predicateId Predicate Id
     */
    getTemplatesOfResourceId = (resourceId, predicateId) => {
        return getStatementsByObjectAndPredicate({ objectId: resourceId, predicateId: predicateId }).then(statements => {
            // Filter statement with subjects of type Contribution Template
            return statements
                .filter(statement => statement.subject.classes.includes(process.env.REACT_APP_CLASSES_CONTRIBUTION_TEMPLATE))
                .map(st => ({ id: st.subject.id, label: st.subject.label, source: resourceId })); // return the template Object
        });
    };

    handleResearchProblemsChange = (problemsArray, a) => {
        problemsArray = problemsArray ? problemsArray : [];
        this.props.updateResearchProblems({
            problemsArray,
            contributionId: this.props.id
        });
        if (a.action === 'select-option') {
            this.setState({ isTemplatesLoading: true, isTemplatesFailesLoading: false });
            this.getTemplatesOfResourceId(a.option.id, process.env.REACT_APP_TEMPLATE_OF_RESEARCH_PROBLEM).then(templates => {
                this.setState(prevState => ({
                    templates: [...prevState.templates, ...templates],
                    isTemplatesLoading: false,
                    isTemplatesFailesLoading: false
                }));
            });
        } else if (a.action === 'remove-value') {
            this.setState({ isTemplatesLoading: true, isTemplatesFailesLoading: false });
            this.setState(prevState => ({
                isTemplatesLoading: false,
                isTemplatesFailesLoading: false,
                templates: prevState.templates.filter(template => template.source !== a.removedValue.id)
            }));
        }
    };

    handleLearnMore = step => {
        this.props.openTour(step);
    };

    loadContirbutionTemplates = () => {
        this.setState({ isTemplatesLoading: true, isTemplatesFailesLoading: false });
        // Load templates of the research field and the research problems
        Promise.all([
            this.getTemplatesOfResourceId(this.props.selectedResearchField, process.env.REACT_APP_TEMPLATE_OF_RESEARCH_FIELD),
            ...this.props.researchProblems
                .filter(rp => rp.id !== rp.label)
                .map(rp => this.getTemplatesOfResourceId(rp.id, process.env.REACT_APP_TEMPLATE_OF_RESEARCH_PROBLEM))
        ]).then(templates => {
            this.setState({
                templates: templates.flat(),
                isTemplatesLoading: false,
                isTemplatesFailesLoading: false
            });
        });
    };

    render() {
        const uniqueTemplates = [];
        this.state.templates.forEach(obj => {
            if (!uniqueTemplates.some(o => o.id === obj.id)) {
                uniqueTemplates.push({ ...obj });
            }
        });

        return (
            <StyledHorizontalContribution>
                <Form>
                    <FormGroup>
                        <Label>
                            <Tooltip
                                message={
                                    <span>
                                        Specify the research problems that this contribution addresses.{' '}
                                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.handleLearnMore(0)}>
                                            Learn more
                                        </span>
                                    </span>
                                }
                            >
                                Research problems
                            </Tooltip>
                        </Label>
                        <ResearchProblemInput handler={this.handleResearchProblemsChange} value={this.props.researchProblems} />
                    </FormGroup>
                    <FormGroup>
                        <Label className="mb-0">
                            <Tooltip
                                message={
                                    <span>
                                        Provide details about this contribution by making statements.{' '}
                                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.handleLearnMore(2)}>
                                            Learn more
                                        </span>
                                    </span>
                                }
                            >
                                Data
                            </Tooltip>
                        </Label>
                        <TemplateWizard
                            enableEdit={true}
                            openExistingResourcesInDialog={true}
                            syncBackend={false}
                            initialResourceId={this.props.resourceId}
                            templatesFound={uniqueTemplates.length > 0 ? true : false}
                        />
                        {!this.state.isTemplatesLoading && uniqueTemplates.length > 0 && (
                            <>
                                <Label className={'mt-4'}>
                                    <Tooltip message={`Select a template to use it in your contribution data`}>Add template</Tooltip>
                                </Label>
                                <div className={'mt-2'}>
                                    {this.state.isTemplatesLoading && (
                                        <>
                                            <Icon icon={faSpinner} spin /> Loading contribution templates.
                                        </>
                                    )}
                                    {!this.state.isTemplatesLoading && uniqueTemplates.length === 0 && <>No contribution template found.</>}
                                    {!this.state.isTemplatesLoading && uniqueTemplates.length > 0 && (
                                        <>
                                            {uniqueTemplates.map(t => (
                                                <AddTemplateButton
                                                    key={`t${t.id}`}
                                                    id={t.id}
                                                    label={t.label}
                                                    selectedResource={this.props.resourceId}
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </FormGroup>
                </Form>
            </StyledHorizontalContribution>
        );
    }
}

Contribution.propTypes = {
    id: PropTypes.string.isRequired,
    updateResearchProblems: PropTypes.func.isRequired,
    researchProblems: PropTypes.array.isRequired,
    selectedResearchField: PropTypes.string.isRequired,
    openTour: PropTypes.func.isRequired,
    resourceId: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
    return {
        resourceId: state.addPaper.contributions.byId[ownProps.id] ? state.addPaper.contributions.byId[ownProps.id].resourceId : null,
        researchProblems: state.addPaper.contributions.byId[ownProps.id] ? state.addPaper.contributions.byId[ownProps.id].researchProblems : [],
        selectedResearchField: state.addPaper.selectedResearchField
    };
};

const mapDispatchToProps = dispatch => ({
    updateResearchProblems: data => dispatch(updateResearchProblems(data)),
    openTour: data => dispatch(openTour(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contribution);
