import React from 'react';
import  './ManagerDashboard.css';
import AxiosInstance from '../../helpers/axios'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default class ManagerDashboard extends React.Component{
constructor(props){
  super(props);
  this.state={
    existingTasks:[],
    isShowTaskRecord:true,
    endDate:'',
    title:'',
    assignedTo:'',
    desc:'',
    assignedBy:'',
    deadline:'',
    createdBy:'',
    showApproval:false,
    taskToBeEdited:{},
    approvalRemarks:''
  }
}
componentDidMount(){
AxiosInstance()
  .post("http://localhost:8080/graphql",
  {
      query: `
          {
            getTask {
              createdBy,desc,title,deadline,task {
                approvalStatus
                taskStatus
                work                
              }
            
            }
          }
      `
  })  
  .then((result) => {
    console.log('response ',result)   
    let tasksData=result.data.data.getTask
    this.setState({existingTasks:tasksData})
  })
  .catch((err)=>{
    console.log('error--',err)
  })

  }

addTask(){
  console.log('add task')
  this.setState({isShowTaskRecord:false})
// this.people = result.data.data.people;
// console.log('result axios',result.data.data.getTask)
  }
  handleDateChange(date){
    console.log('date--',date)
    this.setState({endDate:date})
  }

  handleChange(event){
    event.preventDefault();
    console.log('event target',event.target.name,'value',event.target.value)
    const {name,value}=event.target
    this.setState({[name]: value})
  }
  handleSubmit(event){
    event.preventDefault();
    AxiosInstance()
    .post("http://localhost:8080/graphql",
    {     
      query: `                      
            mutation($title:String,$desc:String,$assignedBy:String,              
              $assignedTo:String,$deadline:String,$createdBy:String,
              $task:taskRecordInput){
              createTask(input:{title:$title,
              desc:$desc,assignedBy:$assignedBy,              
              assignedTo:$assignedTo,deadline:$deadline,createdBy:$createdBy,
              task:$task}) {title}
            }          
      `,
      variables:{
        title:this.state.title,
        assignedTo:this.state.assignedTo,
        desc:this.state.desc,
        assignedBy:this.state.assignedBy,
        deadline:this.state.endDate,
        createdBy:this.state.createdBy,
        task:{
          approvalStatus:"in-prog",
          taskStatus:"not comp",
          work:"dsdsd"
        }
      }
  })  
  .then((result) => {
    console.log('response ',result.data)   
    // let tasksData=result.data.data.getTask
    // this.setState({existingTasks:tasksData})
  })
  .catch((err)=>{
    console.log('error--',err)
  })
    console.log('submit evnt',event)

  }
  handleremarkChange(event){

  }
  handleEditChange(event,task){
      event.preventDefault()
      console.log('editt task',task,'event',event)
      
      this.setState({showApproval:true,isShowTaskRecord:false,taskToBeEdited:task})
  }

  taskEvaluation(){

  }

render(){
  if(this.state.isShowTaskRecord && !this.state.showApproval){
  return (
  <div className="card">  
  <button onClick={()=>this.addTask()}>Add Task</button>
    <table className="table-position">
      <thead>
      <tr>
        <th>Title</th>
        <th>Assigned By</th>
        <th>Deadline</th>
        <th>Working Status</th>
        <th>Approval Status</th>
        <th>View/Edit</th>
      </tr>
      </thead>
      <tbody>
      {Object.entries(this.state.existingTasks)
      .map(([index, { createdBy, deadline, desc,title,task }]) => (
        <tr key={index}>
            <td>{title}</td>
            <td>{createdBy}</td>
            <td>{new Date(+deadline).toLocaleDateString()}</td>
            {/* <td>{deadline}</td> */}
            <td>{task?.taskStatus||'NA'}</td>
            <td>{task?.approvalStatus}</td>
            <td><button onClick={(event)=>{this.handleEditChange(event,this.state.existingTasks[index])}}>Edit</button></td>
        </tr>
      ))}
        </tbody>          
    </table>    
    

  </div>
  )
 }
 else if(!this.state.isShowTaskRecord && !this.state.showApproval){
  return (
  <div className="card">
    Create Task 
    <form  noValidate>            
      <div className='form-control'>
        <label htmlFor="title">Title</label>
        <input type='text'
         name='title' onChange={(event)=>this.handleChange(event)} noValidate />
        {/* {errors.email.length > 0 && 
        <span className='error'>{errors.email}</span>} */}
      </div>
      <div className='form-control'>
        <label htmlFor="deadline">Task end date</label>
        <DatePicker
        selected={this.state.endDate}
        onChange={(date)=>this.handleDateChange(date)}
      />

        {/* <input type='text' name='deadline' onChange={this.handleChange} noValidate />         */}
      </div>
      <div className='form-control'>
        <label htmlFor="assignedTo">Assigned to</label>
        <input type='text' name='assingedTo' onChange={(event)=>this.handleChange(event)} noValidate />         
      </div>    
        <div className='form-control'>
        <label htmlFor="desc">Description</label>
        <input type='text' name='desc' onChange={(event)=>this.handleChange(event)} noValidate />
         {/* {errors.password.length > 0 && 
        <span className='error'>{errors.password}</span>} */}
      </div>
      <div className='submit'>
      <button className="" onClick={(event)=>this.handleSubmit(event)}>Save</button>
      <button className="" onClick={()=>{
          this.setState({isShowTaskRecord:true})
          }}>Back</button>

      </div>      
    </form>
        

  </div>
)                  
  }
  else if(this.state.showApproval && !this.state.isShowTaskRecord){
   return(
    <div className="approval-card">        
        <h2 className="align-label"> Work Evaluation</h2> 
            <div className="form-control">
                <label htmlFor="title">Title: {this.state.taskToBeEdited.title}</label>
                {/* <label></label> */}
            </div>
            <div className="form-control">
                <label htmlFor="title">Assigned To: {this.state.taskToBeEdited.assignedTo}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Deadline: {new Date(+this.state.taskToBeEdited.deadline).toLocaleDateString()}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Work done: "TO be added"
                {/* {this.state.taskToBeEdited.endDate} */}
                </label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Task Status: {this.state.taskToBeEdited.task.taskStatus}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Approval Status: {this.state.taskToBeEdited.task.approvalStatus}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Description: {this.state.taskToBeEdited.desc}</label>
            </div>
            <div className="form-control">
                <label htmlFor="evaluationRemarks">Remarks</label>
                <textarea name="evaluationRemarks" rows="3" style={{width: "25%"}}                                   
                 onChange={(event)=>
                this.setState({approvalRemarks:event.target.value})}
                ></textarea>                
            </div>
            <div className="btn-grp">
                <button onClick={()=>this.taskEvaluation()}>Approve</button>
                <button onClick={()=>this.taskEvaluation()}>Reject </button>
                <button onClick={()=>this.setState({showApproval:false,isShowTaskRecord:true})}>Back</button>
            </div>
    </div>

   )
  }
}
}