# To do

## In models folder: connectionRequest.js

- fromUserId
- toUserId
- status - ignore, interested, accepted, rejected (Use enum{values:, message:})
- can have timestamps. make all required true
- have dynamic route for status and toUserId (/request/send/:status/:toUserId)
- check for allowedStatus - ignored and interested only
- check if already request is present or not. and for vice-versa users too. Use $or
- check if toUserId present in db or not
- don't send request to theirself. use schema.pre in model
