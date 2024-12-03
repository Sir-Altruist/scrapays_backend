mutation {
  updateBook(id: 2, updateInput: {
    description: string
  }) { 
   message,
    status,
    code
  }
}