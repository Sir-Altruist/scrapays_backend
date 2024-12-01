```
mutation {
  updateBook(id: 2, updateInput: {
    description: "Fundamentals of Javascript Programming For Stage 2"
  }) { 
    __typename
    
    ...on Book {
      id,
      name, 
      description
    }
    
    ... on NotFoundError {
      status,
      message
      code
    }
    ... on ValidationError {
      status,
      message,
      code
    }
  }
}
```