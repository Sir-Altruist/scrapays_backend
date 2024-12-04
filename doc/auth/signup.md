```
mutation SignUp {
  signUp(
    signUpDto: {
      email: string
      name: string,
    }
  ) {
    user {
      id
      email
      username
    }
    message
    code
    status
  }
}
```