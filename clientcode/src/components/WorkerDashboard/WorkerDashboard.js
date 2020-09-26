import React from 'react';
import  './WorkerDashboard.css';
import AxiosInstance from '../../helpers/axios'
export default class WorkerDashboard extends React.Component{
constructor(props){
  super(props);
  this.state={
   taskLists:[],
   editTask:false,
   listTask:true,
   currentTask:{}
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
    this.setState({taskLists:result.data.data.getTask})  
  })
  .catch((err)=>{
    console.log('error--',err)
  })
  }
  handleEditChange(event,task){
    console.log('current task',task)
    this.setState({editTask:true,listTask:false,currentTask:task})
  }
  handleChange(event){
    console.log('event',event)
  }

  handleSubmit(event){
  }

render(){

  if(this.state.listTask && !this.state.editTask){
  return(
  <div className="card">  
  <label>  All Tasks</label>
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
      {Object.entries(this.state.taskLists)
      .map(([index, { createdBy, deadline, desc,title,task }]) => (
        <tr key={index}>
            <td>{title}</td>
            <td>{createdBy}</td>
            <td>{new Date(+deadline).toLocaleDateString()}</td>
            {/* <td>{deadline}</td> */}
            <td>{task?.taskStatus||'NA'}</td>
            <td>{task?.approvalStatus}</td>
            <td><button  onClick={(event)=>{this.handleEditChange(event,this.state.taskLists[index])}}>Edit</button></td>
        </tr>
      ))}
        </tbody>          
    </table>    
  </div>
  )
  }
  else if(this.state.editTask && !this.state.listTask){
    return (
      <div className="custom-card">
        <div>
          <h2 style={{"padding-left":"10px"}}>Task Details</h2>
          <div className="form-control">
                <label htmlFor="title">Title: {this.state.currentTask.title}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Assigned By: {this.state.currentTask.assignedTo}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Deadline: {new Date(+this.state.currentTask.deadline).toLocaleDateString()}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Task Status: {this.state.currentTask.task.taskStatus}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Approval Status: {this.state.currentTask.task.approvalStatus}</label>
            </div>
            <div className="form-control">
                <label htmlFor="title">Description: {this.state.currentTask.desc}</label>
            </div>
        </div>
        <div>
          <h2 style={{"padding-left":"10px"}}>Work Progress</h2>
          <div className="form-control">
              <label htmlFor="evaluationRemarks">Work Status</label>
              <select style={{width:"25%",height:"30px"}}>
                <option>In-Progress</option>
                <option>Completed</option>
              </select>             
          </div>
          <div className="form-control">
                <label htmlFor="evaluationRemarks">Work Done</label>
                <textarea name="evaluationRemarks" rows="3" style={{width: "25%"}}                                   
                 onChange={(event)=>this.handleChange(event)}/>             
            </div>
        </div>
        <div className="btn-grp">
          <button>Submit for approval</button>
          <button onClick={()=>{
            this.setState({editTask:false,listTask:true})
          }}>Cancel</button>
        </div>
      </div>
    )
  }
}
}