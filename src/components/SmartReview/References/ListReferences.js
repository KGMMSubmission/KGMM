import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Cite from 'citation-js';
import { Alert } from 'reactstrap';

const ListReferences = () => {
    const usedReferences = useSelector(state => state.smartReview.usedReferences);
    const isEditing = useSelector(state => state.smartReview.isEditing);
    const [bibliography, setBibliography] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const parseBibtex = async () => {
            const bibtex = Object.values(usedReferences)
                .map(section =>
                    Object.values(section).length > 0
                        ? Object.values(section)
                              .filter(reference => reference)
                              .map(reference => reference?.literal?.label)
                        : []
                )
                .join('');

            if (!bibtex) {
                // remove existing references
                if (bibliography) {
                    setBibliography(null);
                }
                return;
            }

            try {
                // by passing the full bibtex to citation-js, we get sorting and formatting of references for free
                const parsedCitation = await Cite.async(bibtex);
                const _bibliography = parsedCitation.format('bibliography', {
                    format: 'html',
                    template: 'apa',
                    lang: 'en-US',
                    prepend: () => '<li>',
                    append: () => '</li>'
                });

                setBibliography(_bibliography);
            } catch (e) {
                console.log(e);
                setError(true);
            }
        };
        parseBibtex();
    }, [bibliography, usedReferences]);

    return (
        <>
            {!error && <ul dangerouslySetInnerHTML={{ __html: bibliography }} style={{ fontSize: '90%' }} className="pl-3" />}
            {error && isEditing && <Alert color="danger">BibTeX parsing error, please check the BibTeX entries</Alert>}
        </>
    );
};

export default ListReferences;
