module.exports=`
          type User {
            _id:ID
           email:String
           name:String
           password:String
           isValidUser:Boolean
           role:String
           jwtToken:String
          }
          input UserInput {
           email:String!
           name:String!
           password:String!         
          }
          input taskInput{
            title:String
            assignedTo:ID
            desc:String
            assignedBy:ID
            deadline:String
            createdBy:String
            task:taskRecordInput
          }
          type taskrecord{
            approvalStatus:String
            taskStatus:String
            work:String
            evaluationRemarks:String
          }
          input taskRecordInput{
            approvalStatus:String
            taskStatus:String
            work:String
            evaluationRemarks:String
          }
          type task {   
            _id:ID!
            mappedName:String
            title:String      
            deadline:String
            createdBy:String
            desc:String
            assignedTo:ID
            task:taskrecord
            assignedBy:ID
          }
          type RootQuery {
              getUser(email:String,password:String):[User]
              getTask: [task!]!
              fetchWorkerList:[User]
              getWorkerTask(id:String):[task]
              getManagerTask(id:String):[task]
          }
          type RootMutation {
              createUser(email:String,password:String,name:String,role:String): User
              createTask(input:taskInput):task 
              managerTaskApproval(input:taskRecordInput,taskId:String):Boolean
              workerTaskUpload(input:taskRecordInput,taskId:String):Boolean
          }
          schema {
              query: RootQuery
              mutation: RootMutation
          }
      `
