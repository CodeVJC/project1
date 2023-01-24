# PROJECT 1 REIMBURSEMENTS SYSTEM

## 2 Routes Files:

### auth-routes.js handles authorization/authentication
* POST /login - trying to log in to an existing account:
    * username exists, password matches => token made
    * username doesn't exist => 400 error
    * password doesn't match => 400 error

* POST /signup - trying to sign up for a new account:
    * username exists => 400 error
    * username doesn't exist => sign up ok
 
### ticket-routes.js handles submitting/approving reimbursement tickets
* POST /tickets - trying to submit new reimbursement ticket
    * token verified + role=employee => submit 
    * token fails => 3 possible errors:
        ** 400 JsonWebTokenError
        ** 400 TypeError
        ** 500 error
    * token valid, but not employee role => 401

### dao-login.js handles "users" table interaction in database
* retrieveUserByUsername
    * GET partition key "username"

* addUser
    * PUT new "username" and "password" in, hardcode "role"="employee"

### dao-tickets.js handles "tickets" table interaction in database
*  addTicket
    * PUT new "username", timestamp, amount, "description" in, hardcode "status"="pending"






