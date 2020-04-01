import styled from 'styled-components';

/* Breadcrumbs */
export const BreadcrumbList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
    display: flex;
    width: 80%;
    float: left;
`;

export const BreadcrumbItem = styled.li`
    border-radius: 6px;
    background: #f7f7f7;
    padding: 4px 10px;
    float: left;
    border: 2px solid #e86161;
    font-size: 87%;
    white-space: nowrap;
    overflow: hidden;
    max-width: 55px;
    cursor: pointer;
    transition: max-width 0.5s;

    &:hover {
        max-width: 100%;

        color: #000;
    }

    &:hover:not(:last-of-type) {
        padding-right: 15px;
    }

    :last-of-type {
        background: #e86161;
        color: #fff;
        max-width: 100%;
        cursor: default;
    }

    &:not(:first-child) {
        margin-left: -15px;
    }
`;

export const BackButton = styled.div`
    width: 10%;
    float: left;
    padding: 4px 0 0 0 !important;
    font-size: 95% !important;
    text-align: left !important;
    cursor: pointer;
`;

export const Container = styled.div`
    margin: 0 0 10px 0;
    height: 35px;
`;