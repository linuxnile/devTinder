# To do

## Create userRouter

- get /user/requests

  - create user route in the routes folder. Have connectionRequests constant
  - Find all the requests for the logged in user
  - Don't show the ignored one (show only for interested one)
  - build relation between User collection and ConnectionRequest collection (ref, .populate)
  - Ignore populating unnecessary things like email or password or fromId user (create a userSafeData above the routers and can you later in other api too)

- get /user/connections

  - connectionRequests
  - Will have to use $or in the find query (user, status. user, status)
  - Status should be only accepted one as it is connections api
  - Use ref for both user, so we can populate it. (It will prevent the conflit of who sent connection request)
  - Get data of only connected person one. Use map() for connectionRequests. Be cautious loggedIn user can also be the sender
  - Lastly response the (data) constant

- get /user/feed
