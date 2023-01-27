# Project 1 - Reimbursement Ticket System

## Starting app
*   Run npm install
*   Run node index.js to start the server (configured to run on PORT 3000)

## auth-routes.js handles authorization/authentication endpoints
### GET /
#### Request - access home page
#### Success - reached home page 
Status: 200 OK\
Body:
```
Welcome to the home page.
```

### POST /signup
#### Request - register for a new account
Body:
```
{
    "username": <USERNAME>,
    "password": <PASSWORD>
}
```
#### Success - username doesn't exist, password provided => user made
Status: 201 Created\
Body:
```
{
    "message": "Successfully registered. Please go to login page."
}
```
#### Error - username already exists
Status: 400 Bad Request\
Body:
```
{
    "message": "That username already exists. Please choose another."
}
```

### POST /login
#### Request - log in to an existing account
Body:
```
{
    "username": <USERNAME>,
    "password": <PASSWORD>
}
```
#### Success - username exists, password matches => token made
Status: 200 OK\
Body:
```
{
    "message": "Successfully authenticated",
    "token": <token>
}
```
#### Error - username doesn't exist
Status: 400 Bad Request\
Body:
```
{
    "message": "User with username <username> does not exist"
}
```
#### Error - password doesn't match
Status: 400 Bad Request\
Body:
```
{
    "message": "Invalid password"
}
```

## ticket-routes.js handles submitting/approving reimbursement tickets
### POST /tickets
#### Request - submit new reimbursement ticket
Body:
```
{
    "amount": amount,
    "description": "description"
}
```
Header:  
Authorization: "Bearer <token>"

#### Success - token verified + role=employee
Status: 201 Created\
Body:
```
{
    "message": "Successfully added ticket."
}
```
#### Error - token valid, but reimbursement amount given is <=0 or >10,000
Status: 400 Bad Request\
Body:
```
{
    "message": "You need to provide a valid amount."
}
```
#### Error - token valid, but reimbursement description length is equal to 0
Status: 400 Bad Request\
Body:
```
{
    "message": "You need to provide a description."
}
```
#### Error - token valid, but reimbursement type given is not travel, lodging, food or other
Status: 400 Bad Request\
Body:
```
{
    "message": "You need to provide a valid type of reimbursement (travel, lodging, food or other)."
}
```
#### Error - token valid, but for a manager, not employee
Status: 401 Unauthorized
```
{
    "message": "You aren't a regular employee. You are a <manager>."
}
```
#### Error - invalid JWT (JsonWebTokenError)
Status: 400 Bad Request\
Body:
```
{
    "message": "Invalid JWT"
}
```
#### Error - no JWT
Status: 500 internal server error\
Body:
```
{
    "message": "no JWT"
}
```
#### Error - other
Status: 500 internal server error\
Body:
```
{
    "message": <error description>
}
```

### GET /tickets or /tickets?status=
#### Request - review reimbursement tickets
Header:  
Authorization: "Bearer <token>"
#### Success - token verified + role=employee + /tickets?type=travel, lodging, food or other and there is at least one ticket 
Status: 200 OK\
Body example:
```
[
    {
        "status": "pending",
        "timestamp": 1674719330,
        "amount": 10,
        "username": "user1",
        "description": "arbys",
        "type": "food"
    }
]
```
#### Error - token verified + role=employee but query for type other than travel, lodging, food or other
Status: 401 Unauthorized
```
{
    "message": "<INPUT> is not a valid ticket type."
}
```
#### Error - token verified + role=employee + /tickets?type=travel, lodging, food or other, but has none
Status: 404 Not Found\
Body:
```
{
    "message": "You have no ticket in the <INPUT> type."
}
```
#### Success - token verified + role=employee + /tickets?status=pending, approved or denied and there is at least one ticket
Status: 200 OK\
Body example:
```
[
    {
        "amount": 20,
        "username": "user1",
        "description": "bought stapler",
        "status": "pending",
        "timestamp": 1674704150
    }
]
```
#### Error - token verified + role=employee but query for status other than pending, approved, or denied
Status: 401 Unauthorized
```
{
    "message": "<INPUT> is not a valid ticket status."
}
```
#### Error - token verified + role=employee + /tickets?status=pending, approved or denied, but has none
Status: 404 Not Found\
Body:
```
{
    "message": "You have no ticket in the <INPUT> status."
}
```
#### Success - token verified + role=employee + no query added, just searching for all their tickets
Status: 200 OK\
Body example:
```
[
    {
        "amount": 20,
        "username": "user1",
        "description": "bought stapler",
        "status": "pending",
        "timestamp": 1674647326
    },
    {
        "amount": 10,
        "username": "user1",
        "description": "bought donuts",
        "status": "approved",
        "timestamp": 1674649840
    }
]
```
#### Error - token verified + role=employee + no query added, but they have no tickets
Status: 404 Not Found\
Body:
```
{
    "message": "Tickets for your username <username> do not exist."
}
```
#### Success - token verified + role=manager + /tickets?status=pending, approved, or denied and there is at least one
Status: 200 OK\
Body example:
```
[
    {
        "amount": 20,
        "username": "user1",
        "description": "bought stapler",
        "status": "pending",
        "timestamp": 1674647326
    },
    {
        "amount": 50,
        "username": "user2",
        "description": "bought monitor",
        "status": "pending",
        "timestamp": 1674659340
    }
]
```
#### Error - token verified + role=manager but query for status other than pending, approved, or denied
Status: 401 Unauthorized
```
{
    "message": "<INPUT> is not a valid ticket status."
}
```
#### Error - token verified + role=manager + /tickets?status=pending, approved, or denied but there are none
Status: 404 Not Found\
Body:
```
{
    "message": "There are no tickets with <INPUT> status."
}
```
#### Success - token verified + role=manager + no query added, just searching for all tickets
Status: 200 OK\
Body example:
```
[
    {
        "amount": 20,
        "username": "user1",
        "description": "bought stapler",
        "status": "pending",
        "timestamp": 1674647326
    },
    {
        "amount": 250,
        "username": "user3",
        "description": "bought chair",
        "status": "denied",
        "timestamp": 1674678493
    }
]
```
#### Error - token verified + role=manager + no query added, but there are no tickets
Status: 404 Not Found\
Body:
```
{
    "message": "There are no tickets."
}
```
#### Error - invalid JWT (JsonWebTokenError)
Status: 400 Bad Request\
Body:
```
{
    "message": "Invalid JWT"
}
```
#### Error - no JWT
Status: 500 internal server error\
Body:
```
{
    "message": "no JWT"
}
```
#### Error - other
Status: 500 internal server error\
Body:
```
{
    "message": <error description>
}
```

### PATCH /tickets/:username/:timestamp/status
#### Success - token verified + role=manager + they select a pending ticket and choose approved or denied
Status: 200 OK\
Body:
```
{
    "message": "Successfully updated ticket to <INPUT>."
}
```
#### Error - token verified + role=manager but they select a ticket that has already been approved or denied
Status: 401 Unauthorized\
Body:
```
{
    "message": "You've already dispositioned this ticket with <INPUT> status."
}
```
#### Error - token verified + role=manager and the selected ticket is still pending, but their new status isn't approved or denied
Status: 401 Unauthorized\
Body:
```
{
    "message": "You must either choose "approved" or "denied," <INPUT> is not an option."
}
```
#### Error - token verified + role=manager, but the searched for username or timestamp is wrong
Status: 404 Not Found\
Body:
```
{
    "message": "Ticket does not exist with both user <USERNAME> and timestamp <TIMESTAMP>."
}
```
#### Error - token verified but it's an employee, not a manager
Status: 404 Not Found\
Body:
```
{
    "message": `You are an <employee> and don't have the authority to update ticket status."
}
```
#### Error - invalid JWT (JsonWebTokenError)
Status: 400 Bad Request\
Body:
```
{
    "message": "Invalid JWT"
}
```
#### Error - no JWT
Status: 500 internal server error\
Body:
```
{
    "message": "no JWT"
}
```

## dao-login.js handles "users" table interaction in database
* retrieveUsername
    * GET partition key "username"

* addUser
    * PUT new "username" and "password" in, hardcode "role"="employee"

## dao-tickets.js handles "tickets" table interaction in database
*  addTicket
    * PUT new "username", timestamp, amount, "description" in, hardcode "status"="pending"

*  retrieveAllTickets
    * SCAN "tickets" table for all tickets

*  retrieveTicketsByStatus
    * QUERY "status-timestamp-index" for all tickets with that status sorted by timestamp so it's first-in-first-out like a queue

*  retrieveTicketByUsernameAndTimestamp
    * QUERY for ticket with unique combo of partition key "username" and sort key "timestamp"

*  updateTicketStatusByTimestamp
    * UPDATE "status" of ticket with unique "username" + "timestamp" key combination

*  retrieveTicketsByUsername
    * QUERY for all tickets with specific username by the "username" partition key

*  retrieveTicketsByUsernameandStatus
    * QUERY for all tickets with specific username by the "username" partition key, filtered by status

## notes
* JWT used for authentication
* all request/response headers are "Content-Type: application/json"







