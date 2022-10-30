import { gql } from '@apollo/client'

export const GET_REPOSITORIES = gql`
    query {
        repositories {
            edges {
                node {
                    id
                    ownerName
                    name
                    fullName
                    description
                    language
                    stargazersCount
                    forksCount
                    reviewCount
                    ratingAverage
                    ownerAvatarUrl
                    url
                }
            }
        }
    }
`;

export const RETRIEVE_USER = gql`
    query {
        me {
            id
            username
        }
    }
`;

export const GET_REVIEWS = gql`
    query getReview($id: ID!) {
        repository(id: $id) {
            ownerName
            name
            reviews {
                edges {
                    node {
                        id
                        text
                        rating
                        createdAt
                        user {
                            username
                        }
                    }
                }
            }
        }
    }
`;