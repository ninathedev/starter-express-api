# GABank
server for GA's bank

# http requests
## All GET requests
### /
returns homepage
### /scripts/<script>.js
returns js file 
### /money
returns everyone's id and their money
### /accounts
returns everyone's id, pin, and their names
### /------/admin
(the dashes are censors) returns admin page
### /dashboard
returns dashboard (requires params)
### /404
returns 404 page
### /500
returns 500 page
## All POST requests
### /login
checks if given id and pin are correct
### /mysql
uses given sql query to the mysql db
## All PUT requests
### /indsal
gives the given id a salary (if positive) or tax (if negative); otherwise error (if 0)
### /tax
makes everyone pay a given amount (if positive) or give everyone a salary (if negative); otherwise error (if 0)