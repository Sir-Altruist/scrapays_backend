mutation {
  signIn(signInDto: {
    email: string,
    code: string
  }) {
    token,
    message,
    status,
    code
  }
}