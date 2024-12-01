```{
  findBook(id: 2){
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
    ... on ServerError {
      status,
      message
      details
    }
  }
}
```
