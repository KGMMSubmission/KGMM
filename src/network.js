export const url = process.env.REACT_APP_SERVER_URL;
export const resourcesUrl = url + 'resources/';
export const predicatesUrl = url + 'predicates/';
export const statementsUrl = url + 'statements/';
export const crossrefUrl = process.env.REACT_APP_CROSSREF_URL;

/**
 * Sends simple GET request to the URL.
 */
export function submitGetRequest(url, onSuccess, onError) {
    fetch(url, { method: 'GET' })
            .then((response) => {
                console.log('Response type: ' + response.type);
                if (!response.ok) {
                    throw new Error('Error response. (' + response.status + ') ' + response.statusText);
                } else {
                    return response.json();
                }
            })
            .then(onSuccess)
            .catch(onError);
}

function submitPostRequest(url, headers, data, onSuccess, onError) {
    fetch(url, { method: 'POST',  headers: headers, body: JSON.stringify(data) })
            .then((response) => {
                console.log('Response type: ' + response.type);
                if (!response.ok) {
                    throw new Error('Error response. (' + response.status + ') ' + response.statusText);
                } else {
                    return response.json();
                }
            })
            .then(onSuccess)
            .catch(onError);
}

export function updateResource(id, label, onSuccess, onError) {
    submitPostRequest(resourcesUrl, {'Content-Type': 'application/json'}, {id: id, label: label}, onSuccess, onError);
}

export function createResource(label, onSuccess, onError) {
    submitPostRequest(resourcesUrl, {'Content-Type': 'application/json'}, {label: label}, onSuccess, onError);
}

export function createResourceStatement(subjectId, predicateId, objectId, onSuccess, onError) {
    submitPostRequest(statementsUrl + subjectId + '/' + predicateId + '/' + objectId + '/',
            {'Content-Type': 'application/json'}, {}, onSuccess, onError);
}

export function createLiteralStatement(subjectId, predicateId, property, onSuccess, onError) {
    submitPostRequest(statementsUrl + subjectId + '/' + predicateId + '/',
            {'Content-Type': 'application/json'}, { 'value' : property, 'type' : 'literal' }, onSuccess, onError);
}

export function getPredicate(id, onSuccess, onError) {
    submitGetRequest(predicatesUrl + encodeURIComponent(id) + '/', onSuccess, onError);
}

export function getResource(id, onSuccess, onError) {
    submitGetRequest(resourcesUrl + encodeURIComponent(id) + '/', onSuccess, onError);
}

export function getPredicatesByLabel(label, onSuccess, onError) {
    submitGetRequest(predicatesUrl + '?q=' + encodeURIComponent(label), onSuccess, onError)
}