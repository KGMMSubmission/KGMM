import ObservatoriesCarousel from 'components/ObservatoriesCarousel/ObservatoriesCarousel';
import { Link } from 'react-router-dom';
import ROUTES from 'constants/routes.js';
import useObservatories from './hooks/useObservatories';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';

export default function ObservatoriesBox() {
    const [observatories, isLoading] = useObservatories(false);

    return (
        <div className="box rounded-lg" style={{ overflow: 'hidden' }}>
            <h2
                className="h5"
                style={{
                    marginBottom: 0,
                    padding: '15px'
                }}
            >
                <Tippy content="Observatories organize research contributions in a particular research field and are curated by research organizations active in the respective field.">
                    <span>
                        <Icon icon={faStar} className="text-primary" /> Observatories
                    </span>
                </Tippy>
                <Link to={ROUTES.OBSERVATORIES}>
                    <span style={{ fontSize: '0.9rem', float: 'right', marginTop: 2, marginBottom: 15 }}>More observatories</span>
                </Link>
            </h2>
            <hr className="mx-3 mt-0" />
            <ObservatoriesCarousel observatories={observatories} isLoading={isLoading} />
        </div>
    );
}
