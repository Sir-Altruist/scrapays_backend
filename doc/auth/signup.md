mutation SignUp {
  signUp(
    signUpDto: {
      email: string
      name: string
    }
  ) {
    user {
      id
      email
      name
    }
    message
    code
    status
  }
}