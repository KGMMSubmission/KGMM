import ContentLoader from 'react-content-loader';
import useResearchProblemContributors from './hooks/useResearchProblemContributors';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import ContributorCard from 'components/ContributorCard/ContributorCard';
import PropTypes from 'prop-types';

const ContributorsModal = ({ researchProblemId, openModal, setOpenModal }) => {
    const { contributors, isLoading } = useResearchProblemContributors({
        researchProblemId,
        pageSize: 19
    });

    return (
        <Modal isOpen={openModal} toggle={() => setOpenModal(v => !v)} size="lg">
            <ModalHeader toggle={() => setOpenModal(v => !v)}>
                <Icon icon={faAward} className="text-primary mr-2" />
                Top 30 Contributors
            </ModalHeader>
            <ModalBody>
                <div className="pl-3 pr-3">
                    {!isLoading &&
                        contributors.map((contributor, index) => {
                            return (
                                <div className="pt-2 pb-2" key={`rp${index}`}>
                                    <div className="d-flex">
                                        <div className="pl-4 pr-4 pt-2">{index + 1}.</div>
                                        <div>
                                            <ContributorCard
                                                contributor={{
                                                    ...contributor.user,
                                                    subTitle: contributor.contributions
                                                        ? `${contributor.contributions} contribution${contributor.contributions > 1 ? 's' : ''}`
                                                        : ''
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {contributors.length - 1 !== index && <hr className="mb-0 mt-3" />}
                                </div>
                            );
                        })}
                    {!isLoading && contributors?.length === 0 && (
                        <div className="mt-4 mb-4">
                            No contributors yet.
                            <i> be the first contributor!</i>.
                        </div>
                    )}
                    {isLoading && (
                        <div className="mt-4 mb-4">
                            <ContentLoader height={130} width={200} foregroundColor="#d9d9d9" backgroundColor="#ecebeb">
                                <rect x="30" y="5" rx="3" ry="3" width="150" height="6" />
                                <rect x="30" y="15" rx="3" ry="3" width="100" height="5" />
                                <rect x="30" y="35" rx="3" ry="3" width="150" height="6" />
                                <rect x="30" y="45" rx="3" ry="3" width="150" height="5" />
                                <rect x="30" y="65" rx="3" ry="3" width="100" height="6" />
                                <rect x="30" y="75" rx="3" ry="3" width="150" height="5" />
                                <rect x="14" y="0" rx="3" ry="3" width="3" height="100" />
                            </ContentLoader>
                        </div>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
};

ContributorsModal.propTypes = {
    researchProblemId: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
    initialSort: PropTypes.string,
    initialIncludeSubFields: PropTypes.bool
};

export default ContributorsModal;
