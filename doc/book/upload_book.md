mutation {
  createBook(createInput: {
    name: string,
    description: string
  }) {
    book {
      id,
      name,
      description
    }
  }
}