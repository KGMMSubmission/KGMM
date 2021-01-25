import { useState, useEffect } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import useResizeObserver from 'use-resize-observer';
import PropTypes from 'prop-types';

const PreviewCarouselComponent = props => {
    const [showArrowLeft, setShowArrowLeft] = useState(false);
    const [showArrowRight, setShowArrowRight] = useState(false);
    // can't use 'useMeasure' from 'react-use' because it doesn't allow setting a custom ref,
    // once merged: https://github.com/streamich/react-use/pull/1516, probably we can use that instead of use-resize-observer
    const { width: scrollContainerBodyWidth } = useResizeObserver({ ref: props.innerRef });
    const childWidth = 215;

    const executeUpdates = () => {
        const item = props.innerRef.current;
        const areaWidth = item.scrollWidth;
        const clientWidth = item.clientWidth;
        const left = item.scrollLeft;
        const leftMax = item.scrollLeftMax;
        const needUpdate = clientWidth < areaWidth;
        if (needUpdate || (showArrowLeft || showArrowRight)) {
            handleLeftArrowShow(left);
            handleRightArrowShow(left, leftMax);
        }
    };

    const handleRightArrowShow = (left, max) => {
        setShowArrowRight(left === max ? false : true);
    };

    const handleLeftArrowShow = val => {
        setShowArrowLeft(val > 0 ? true : false);
    };

    const handleScrollLeft = () => {
        const item = props.innerRef.current;
        item.scrollTo({
            top: 0,
            left: item.scrollLeft - childWidth,
            behavior: 'smooth'
        });
    };
    const handleScrollRight = () => {
        const item = props.innerRef.current;
        item.scrollTo({
            top: 0,
            left: item.scrollLeft + childWidth,
            behavior: 'smooth'
        });
    };

    const executeWheelEvent = event => {
        event.preventDefault();
        if (event.deltaY > 0) {
            handleScrollLeft();
        } else {
            handleScrollRight();
        }
    };

    // just a wrapper function for better code reading
    const resizeEvent = () => {
        executeUpdates();
    };

    useEffect(() => {
        const el = props.innerRef.current;
        if (el) {
            el.executeUpdates = executeUpdates;
            // add resize event
            window.addEventListener('resize', resizeEvent);
            // add scroll event
            el.addEventListener('wheel', executeWheelEvent);
            return function cleanupListener() {
                window.removeEventListener('resize', resizeEvent);
                el.removeEventListener('wheel', executeWheelEvent);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        executeUpdates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollContainerBodyWidth]);

    return (
        <div style={{ paddingTop: '10px', height: '200px' }}>
            <h2 className="h5 mb-2 mt-2">Visualizations</h2>
            <div ref={props.innerRef} id="PreviewCarouselContainer" style={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
                {props.children}
            </div>
            <div style={{ display: 'block', height: '35px' }}>
                {showArrowLeft && (
                    <button
                        style={{ background: 'none', border: 'none', marginTop: '5px', position: 'relative', float: 'left', cursor: 'pointer' }}
                        onClick={() => {
                            handleScrollLeft();
                        }}
                    >
                        <Icon icon={faArrowCircleLeft} className="text-primary" style={{ fontSize: 25 }} />
                    </button>
                )}
                {showArrowRight && (
                    <button
                        style={{ background: 'none', border: 'none', marginTop: '5px', position: 'relative', float: 'right', cursor: 'pointer' }}
                        onClick={() => {
                            handleScrollRight();
                        }}
                    >
                        <Icon icon={faArrowCircleRight} className="text-primary " style={{ fontSize: 25 }} />
                    </button>
                )}
            </div>
        </div>
    );
};

PreviewCarouselComponent.propTypes = {
    children: PropTypes.any,
    innerRef: PropTypes.any
};

export default PreviewCarouselComponent;
