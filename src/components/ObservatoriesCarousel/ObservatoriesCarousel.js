import { useState } from 'react';
import { Carousel, CarouselItem, CarouselIndicators, Card, CardBody, CardFooter, CardTitle, CardSubtitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import ROUTES from 'constants/routes';
import Dotdotdot from 'react-dotdotdot';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faFile, faCubes } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import styled from 'styled-components';
import Gravatar from 'react-gravatar';
import { reverse } from 'named-urls';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';

const CarouselContainer = styled.div`
    width: 100%;

    & li {
        width: 10px !important;
        height: 10px !important;
        border-radius: 100% !important;
        background-color: ${props => props.theme.orkgPrimaryColor} !important;
    }
`;

const ObservatoryCardStyled = styled.div`
    cursor: initial;
    .orgLogo {
        border: 1px;
        padding: 2px;
    }

    .observatoryName {
        font-weight: bold;
    }
    &:hover {
        .observatoryName {
            text-decoration: underline;
        }
    }
`;

const CarouselIndicatorsStyled = styled(CarouselIndicators)`
    && {
        margin: 0;
    }

    background: ${props => props.theme.ultraLightBlue};
`;

const StyledGravatar = styled(Gravatar)`
    border: 2px solid ${props => props.theme.darkblue};
    cursor: pointer;
    &:hover {
        border: 2px solid ${props => props.theme.primaryColor};
    }
`;

const CardFooterStyled = styled(CardFooter)`
    && {
        background: ${props => props.theme.ultraLightBlue};
    }
`;

function ObservatoriesCarousel(props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) {
            return;
        }
        const nextIndex = activeIndex === props.observatories.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) {
            return;
        }
        const nextIndex = activeIndex === 0 ? props.observatories.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = newIndex => {
        setActiveIndex(newIndex);
    };

    const slides = () => {
        return props.observatories.map(observatory => {
            return (
                <CarouselItem
                    onExiting={() => setAnimating(true)}
                    onExited={() => setAnimating(false)}
                    className=" pb-1 mb-4"
                    key={`fp${observatory.id}`}
                >
                    <ObservatoryCardStyled className="">
                        {!observatory.logo && (
                            <Card style={{ border: 0 }}>
                                <Link to={reverse(ROUTES.OBSERVATORY, { id: observatory.id })} style={{ textDecoration: 'none' }}>
                                    <CardBody className="pt-0 mb-0">
                                        <CardTitle tag="h5">{observatory.name}</CardTitle>
                                        <CardSubtitle tag="h6" style={{ height: '20px' }} className="mb-1 text-muted">
                                            <Dotdotdot clamp={2}>{observatory.description}</Dotdotdot>
                                        </CardSubtitle>
                                    </CardBody>
                                </Link>
                                <Link
                                    className="text-center mt-3 mb-3 d-flex"
                                    to={reverse(ROUTES.OBSERVATORY, { id: observatory.id })}
                                    style={{ textDecoration: 'none', height: '80px', width: '100%', overflow: 'hidden' }}
                                >
                                    {observatory.orgs.slice(0, 2).map((
                                        o // show only two logos
                                    ) => (
                                        <div key={`imageLogo${o.id}`} className="flex-grow-1">
                                            <img className="orgLogo" height="60px" src={o.logo} alt={`${o.name} logo`} />
                                        </div>
                                    ))}
                                </Link>
                                <CardFooterStyled className="text-muted">
                                    <small>
                                        <Icon icon={faCubes} className="mr-1" /> {observatory.comparisons} comparisons
                                        <Icon icon={faFile} className="mr-1 ml-2" />
                                        {observatory.resources} papers
                                    </small>
                                    <div className="float-right" style={{ height: '25px' }}>
                                        {observatory.contributors.slice(0, 5).map(contributor => (
                                            <Tippy key={`contributor${contributor.id}`} content={contributor.display_name}>
                                                <Link className="ml-1" to={reverse(ROUTES.USER_PROFILE, { userId: contributor.id })}>
                                                    <StyledGravatar className="rounded-circle" md5={contributor.gravatar_id} size={24} />
                                                </Link>
                                            </Tippy>
                                        ))}
                                    </div>
                                </CardFooterStyled>
                            </Card>
                        )}
                    </ObservatoryCardStyled>
                </CarouselItem>
            );
        });
    };

    return (
        <CarouselContainer>
            {!props.isLoading ? (
                props.observatories.length ? (
                    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
                        {slides()}

                        <CarouselIndicatorsStyled items={props.observatories} activeIndex={activeIndex} onClickHandler={goToIndex} />
                    </Carousel>
                ) : (
                    <div className="pt-4 pb-4 pl-4 pr-4">
                        No observatories yet!
                        <br />
                        <small className="text-muted">
                            How observatories are managed?{' '}
                            <a
                                href="https://gitlab.com/TIBHannover/orkg/orkg-frontend/-/wikis/Observatories"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ORKG wiki
                            </a>
                        </small>
                    </div>
                )
            ) : (
                <div style={{ height: '130px' }} className="pt-4 pb-1 pl-4 pr-4">
                    <ContentLoader
                        width={300}
                        height={50}
                        viewBox="0 0 300 50"
                        speed={2}
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                        title={false}
                    >
                        <rect x="1" y="0" rx="4" ry="4" width="300" height="20" />
                        <rect x="1" y="25" rx="3" ry="3" width="250" height="20" />
                    </ContentLoader>
                </div>
            )}
        </CarouselContainer>
    );
}

ObservatoriesCarousel.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    observatories: PropTypes.array.isRequired
};

export default ObservatoriesCarousel;