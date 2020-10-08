# taskmanager
**Manager**
  - Able to login/signup with email and password
  - Able to post/edit the tasks, set estimated date to complete the full task
  - Able to view the task submitted by the user and approve/reject the task
  -  Able to view the tasks done/assigned/pending on using a date filter
**Worker**
  - Able to login with email and password
  - Able to view the tasks posted by any manager
  - Should do the task and submit the task details for review
  - Able to view the completed task history
# Run
```
lerna bootstrap # Install all dependencies
lerna run start  # run it locally 
```
By default it will run in http://localhost:3000
# TechStacks
  - FrontEnd: ReactJS
  - BackEnd: NodeJS, GraphQL
  - Database: MongoDB
  - Monorepo: LernaJS
  - API authentication: JWT token
  
# Disclamer
This is a learning project, it is not intended for production at all
