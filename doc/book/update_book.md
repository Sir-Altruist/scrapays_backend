```
mutation {
  updateBook(id: $id, updateInput: {
    description: string
  }) { 
   message,
    status,
    code
  }
}
```