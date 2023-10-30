import gql from '@apollo/client';

export const GET_ME = gql`
{
    me {
      _id
      email
      username
      bookCount
      savedBooks {
        bookId
        authors
        link
        title
        image
        description
      }
    }
  }
`;