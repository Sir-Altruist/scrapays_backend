```
mutation {
  sendOtp(otpDto: {
    email: string
  }) {
    message
    status
  }
}
```