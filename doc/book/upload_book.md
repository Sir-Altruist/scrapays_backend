```
mutation {
  createBook(createInput: {
    name: "value",
    description: "value"
  }) {
    __typename
        __typename
        ...on Book {
          id,
          name
        }
    
    ... on ValidationError {
      status,
      message,
      code
    }
    
  }
}
```