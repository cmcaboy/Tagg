import gql from 'graphql-tag'

export  gql`
query {
    user @client {
        id
    }
}`