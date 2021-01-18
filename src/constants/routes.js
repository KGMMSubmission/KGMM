const routes = {
    HOME: '/',
    USER_SETTINGS: '/settings',
    USER_PROFILE: '/u/:userId',
    RESOURCES: '/resources',
    RESOURCE: '/resource/:id',
    ADD_RESOURCE: '/addResource',
    PREDICATES: '/predicates',
    PREDICATE: '/predicate/:id',
    CLASSES: '/classes',
    CLASS: '/class/:id',
    CONTRIBUTION_TEMPLATES: '/templates',
    CONTRIBUTION_TEMPLATE: '/template/:id?',
    ORGANIZATIONS: '/organizations',
    OBSERVATORIES: '/observatories',
    ADD_ORGANIZATION: '/addOrganization',
    ORGANIZATION: '/organizations/:id',
    ADD_OBSERVATORY: '/organizations/:id/addObservatory',
    ORGANIZATION_OBSERVATORIES: '/organizations/:id/observatories',
    OBSERVATORY: '/observatory/:id',
    ADD_PAPER: {
        GENERAL_DATA: '/add-paper'
    },
    VIEW_PAPER: '/paper/:resourceId/:contributionId?',
    CONTRIBUTION: '/contribution/:id',
    COMPARISON_SHORTLINK: '/c/:shortCode',
    COMPARISON: '/comparison/:comparisonId?',
    PAPERS: '/papers',
    COMPARISONS: '/comparisons',
    RESEARCH_PROBLEM: '/problem/:researchProblemId',
    RESEARCH_FIELD: '/field/:researchFieldId',
    VENUE_PAGE: '/venue/:venueId',
    AUTHOR_PAGE: '/author/:authorId',
    LICENSE: '/license',
    DATA_PROTECTION: '/data-protection',
    TERMS_OF_USE: '/terms-of-use',
    SEARCH: '/search/:searchTerm?',
    TPDL: '/tpdl', // legacy
    STATS: '/stats',
    CHANGELOG: '/changelog',
    EXPORT_DATA: '/export-data',
    FEATURED_COMPARISONS: '/featured-comparisons',
    PDF_TEXT_ANNOTATION: '/pdf-text-annotation',
    PDF_ANNOTATION: '/pdf-annotation',
    CSV_IMPORT: '/csv-import',
    SMART_ARTICLE: '/smart-article/:id',
    SMART_ARTICLE_NEW: '/smart-article-new'
};
export default routes;
