mutation {
  signUp(signUpDto: {
    email: "value",
    name: "value"
  }) {
			__typename
      ... on JSONApiResponse {
            status
            message,
        		successCode: code 
        		user {
              __typename
              ... on User {
                id,
                name,
                email
              }
            }
        }
    ... on ValidationError {
      status,
      message,
      code
    }
    
     ... on ServerError {
      status,
      message
      details
    }
  }
}
  
