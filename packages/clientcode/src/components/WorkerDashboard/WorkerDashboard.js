import React from 'react';
import './WorkerDashboard.css';
import AxiosInstance from '../../helpers/axios'
export default class WorkerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskLists: [],
      editTask: false,
      taskStatus: '',
      listTask: true,
      currentTask: {},
      work: ''
    }
  }
  componentDidMount() {
    this.fetchTaskLists()
  }
  handleEditChange(event, task) {
    this.setState({ editTask: true, listTask: false, currentTask: task })
  }

  submitTask() {
    // console.log('task id--',this.state.currentTask._id,'task status',this.state.taskStatus)
    AxiosInstance()
      .post("http://localhost:5000/graphql",
        {
          query: `          
        mutation($id:String,$taskStatus:String,
        $work:String){
        workerTaskUpload(input:{taskStatus:$taskStatus,
        work:$work},
        taskId:$id) 
      }          
    `,
          variables: {
            id: this.state.currentTask._id,
            taskStatus: this.state.taskStatus,
            work: this.state.work,
          }
        })
      .then((result) => {
        this.setState({ editTask: false, listTask: true })
        this.fetchTaskLists();
      })
      .catch((err) => {
        console.log('error--', err)
      })
  }
  //   this.fetchTaskLists()
  // }
  fetchTaskLists() {
    AxiosInstance()
      .post("http://localhost:5000/graphql",
        {
          query: `          
              query($workerid:String) {
                getWorkerTask(id:$workerid){
                  _id,mappedName,assignedBy,desc,title,deadline,task {
                    approvalStatus
                    taskStatus
                    work                
                  }
                }                          
            }
        `,
          variables: {
            workerid: localStorage.getItem('ID')
          }
        })
      .then((result) => {
        console.log('tasklist response----------> ', result.data.data.getWorkerTask)
        this.setState({ taskLists: result.data.data.getWorkerTask })
      })
      .catch((err) => {
        console.log('error--', err)
      })
  }
  render() {
    if (this.state.listTask && !this.state.editTask) {
      return (
        <div className="card">
          <label style={{ display: 'block', paddingTop: "20px" }}>  All Tasks</label>
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
              {this.state.taskLists.length > 0 ? Object.entries(this.state.taskLists)
                .map(([index, { mappedName, deadline, desc, title, task }]) => (
                  <tr key={index}>
                    <td>{title}</td>
                    <td>{mappedName}</td>
                    <td>{new Date(+deadline).toLocaleDateString()}</td>
                    {/* <td>{deadline}</td> */}
                    <td>{task?.taskStatus || 'Not Started'}</td>
                    <td>{task?.approvalStatus || 'Pending'}</td>
                    <td><button onClick={(event) => { this.handleEditChange(event, this.state.taskLists[index]) }}>Edit</button></td>
                  </tr>
                )) : ''}
            </tbody>
          </table>
          {this.state.taskLists?.length == 0 ? <div style={{ textAlign: "center", margin: "2%" }}><span>No tasks assigned</span></div> : ''}

        </div>
      )
    }
    else if (this.state.editTask && !this.state.listTask) {
      return (
        <div className="custom-card">
          <div>
            <h2 style={{ "paddingLeft": "10px" }}>Task Details</h2>
            <div className="form-control">
              <label htmlFor="title">Title: {this.state.currentTask.title}</label>
            </div>
            <div className="form-control">
              <label htmlFor="title">Assigned By: {this.state.currentTask.mappedName}</label>
            </div>
            <div className="form-control">
              <label htmlFor="title">Deadline: {new Date(+this.state.currentTask.deadline).toLocaleDateString()}</label>
            </div>
            {/* <div className="form-control">
              <label htmlFor="title">Task Status: {this.state.currentTask.task.taskStatus}</label>
            </div> */}
            <div className="form-control">
              <label htmlFor="title">Approval Status: {this.state.currentTask.task.approvalStatus}</label>
            </div>
            <div className="form-control">
              <label htmlFor="title">Description: {this.state.currentTask.desc}</label>
            </div>
          </div>
          <div>
            <h2 style={{ "padding-left": "10px" }}>Work Progress</h2>
            <div className="form-control">
              <label htmlFor="evaluationRemarks">Work Status</label>
              <select style={{ width: "25%", height: "30px" }} onChange={
                (event) => {
                  event.preventDefault();
                  this.setState({ taskStatus: event.target.value })
                }
              }>
                <option name="select" value="null"></option>
                <option value="In-progress">In-Progress</option>
                <option valaue="completed">Completed</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="evaluationRemarks">Work Done</label>
              <textarea name="evaluationRemarks" rows="3" style={{ width: "25%" }}
                onChange={(event) => {
                  event.preventDefault();
                  this.setState({ work: event.target.value })
                }} />
            </div>
          </div>
          <div className="btn-grp">
            <button onClick={() => this.submitTask()}>Submit for approval</button>
            <button onClick={() => {
              this.setState({ editTask: false, listTask: true })
            }}>Cancel</button>
            {/* <button onClick={()=>{
console.log('edit sttae',this.state.editTask,'list,',this.state.listTask,'assk',this.state.taskLists)
            }}>Test</button> */}
          </div>
        </div>
      )
    }
  }
}





