```
{
  deleteBook(id :4){
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