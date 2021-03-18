import { useState } from 'react';
import { DropdownMenu, DropdownItem, FormGroup, Label, Input, UncontrolledButtonDropdown, DropdownToggle } from 'reactstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { SmallButton } from 'components/styled';
import Tippy from '@tippyjs/react';
import { stringifySort } from 'utils';
import PropTypes from 'prop-types';

const ProblemsDropdownFilter = ({ sort, isLoading, includeSubFields, setSort, setIncludeSubFields }) => {
    const [tippy, setTippy] = useState({});
    return (
        <>
            {sort === 'top' && (
                <UncontrolledButtonDropdown>
                    <DropdownToggle caret className="pl-3 pr-3" size="sm" color="lightblue">
                        {stringifySort(sort)}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem disabled={isLoading} onClick={() => setSort('newest')}>
                            Newest first
                        </DropdownItem>
                        <DropdownItem disabled={isLoading} onClick={() => setSort('oldest')}>
                            Oldest first
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            )}
            {sort !== 'top' && (
                <Tippy
                    interactive={true}
                    trigger="click"
                    placement="bottom-end"
                    onCreate={instance => setTippy(instance)}
                    content={
                        <div className="p-2">
                            <FormGroup>
                                <Label for="sortPapers">Sort</Label>
                                <Input
                                    value={sort}
                                    onChange={e => {
                                        tippy.hide();
                                        setSort(e.target.value);
                                    }}
                                    bsSize="sm"
                                    type="select"
                                    name="sort"
                                    id="sortPapers"
                                    disabled={isLoading}
                                >
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                </Input>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        onChange={e => {
                                            tippy.hide();
                                            setIncludeSubFields(e.target.checked);
                                        }}
                                        checked={includeSubFields}
                                        type="checkbox"
                                        style={{ marginTop: '0.1rem' }}
                                        disabled={isLoading}
                                    />
                                    Include subfields
                                </Label>
                            </FormGroup>
                        </div>
                    }
                >
                    <span>
                        <SmallButton color="lightblue" className="flex-shrink-0 pl-3 pr-3" style={{ marginLeft: 'auto' }} size="sm">
                            {stringifySort(sort)} <Icon icon={faChevronDown} />
                        </SmallButton>
                    </span>
                </Tippy>
            )}
        </>
    );
};

ProblemsDropdownFilter.propTypes = {
    sort: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    includeSubFields: PropTypes.bool.isRequired,
    setSort: PropTypes.func.isRequired,
    setIncludeSubFields: PropTypes.func.isRequired
};

export default ProblemsDropdownFilter;
