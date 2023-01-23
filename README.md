# PROJECT 1 REIMBURSEMENTS SYSTEM

## 2 Routes Files:

### auth-routes.js handles authorization/authentication
* POST /login - trying to log in to an existing account:
    * username exists, password matches => token made
    * username doesn't exist - error
    * password doesn't match - error

* POST /signup - trying to sign up for a new account
    * username exists => error
    * username doesn't exist => signed up




