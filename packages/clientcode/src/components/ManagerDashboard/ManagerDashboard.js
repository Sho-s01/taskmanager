import React from 'react';
import './ManagerDashboard.css';
import AxiosInstance from '../../helpers/axios'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default class ManagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      existingTasks: [],
      isShowTaskRecord: true,
      endDate: '',
      title: '',
      assignedTo: '',
      desc: '',
      assignedBy: '',
      deadline: '',
      createdBy: '',
      showApproval: false,
      taskToBeEdited: {},
      approvalRemarks: '',
      workerLists: [],
      filters: {
        assignedTo: '',
        approvalStatus: '',
        filterTitle: ''
      }
    }
  }
  componentDidMount() {
    this.getTaskLists();
    AxiosInstance()
      .post("http://localhost:5000/graphql",
        {
          query: `
          {
            fetchWorkerList {
             _id ,
             name
            }
          }
      `
        })
      .then((result) => {
        console.log('response worker', result)
        let workerData = result.data.data.fetchWorkerList
        this.setState({ workerLists: workerData })
      })
      .catch((err) => {
        console.log('error--', err)
      })
  }
  getTaskLists() {
    AxiosInstance()
      .post("http://localhost:5000/graphql",
        {
          // query: `
          //     {
          //       getTask {
          //         _id,mappedName,createdBy,assignedTo,desc,title,deadline,task {              
          //           approvalStatus
          //           taskStatus
          //           work                
          //         }

          //       }
          //     }
          // `
          query: `query($workerid:String) {
            getManagerTask(id:$workerid){
          _id,mappedName,assignedBy,desc,title,deadline,task {
            approvalStatus
            taskStatus
            work                
          }
        }                          
    }`,
          variables: {
            workerid: localStorage.getItem('ID')
          }
        })
      .then((result) => {
        console.log('task response----> ', result)
        let tasksData = result.data.data.getManagerTask
        this.setState({ existingTasks: tasksData })
      })
      .catch((err) => {
        console.log('error--', err)
      })
  }
  addTask() {
    console.log('add task')
    this.setState({ isShowTaskRecord: false })
  }

  handleDateChange(date) {
    console.log('date--', date)
    this.setState({ endDate: date })
  }

  handleChange(event) {
    event.preventDefault();
    console.log('event target', event.target.name, 'value', event.target.value)
    const { name, value } = event.target
    this.setState({ [name]: value })
  }
  handleSubmit(event) {
    event.preventDefault();
    console.log('assigned to', this.state.assignedTo)
    AxiosInstance()
      .post("http://localhost:5000/graphql",
        {
          query: `                      
            mutation($title:String,$desc:String,$assignedBy:ID,              
              $assignedTo:ID,$deadline:String,$createdBy:String,
              $task:taskRecordInput){
              createTask(input:{title:$title,
              desc:$desc,assignedBy:$assignedBy,              
              assignedTo:$assignedTo,deadline:$deadline,createdBy:$createdBy,
              task:$task}) {title}
            }          
      `,
          variables: {
            title: this.state.title,
            assignedTo: this.state.assignedTo,
            desc: this.state.desc,
            assignedBy: localStorage.getItem('ID'),
            deadline: this.state.endDate,
            createdBy: this.state.createdBy,
            task: {
              approvalStatus: "Pending",
              taskStatus: "Not Started",
            }
          }
        })
      .then((result) => {
        console.log('response ', result.data)
        // let tasksData=result.data.data.getTask
        // this.setState({existingTasks:tasksData})
      })
      .catch((err) => {
        console.log('error--', err)
      })
    console.log('submit evnt', event)

  }

  handleEditChange(event, task) {
    event.preventDefault()
    console.log('editt task', task, 'event', event)
    this.setState({ showApproval: true, isShowTaskRecord: false, taskToBeEdited: task })
  }

  taskEvaluation(event, approvalStatus, taskRecord) {
    event.preventDefault()
    console.log('approval sttaus', approvalStatus, 'remarks', this.state.approvalRemarks)
    AxiosInstance()
      .post("http://localhost:5000/graphql",
        {
          query: `                      
            mutation($id:String,$approvalStatus:String,
              $evaluationRemarks:String){
              managerTaskApproval(input:{approvalStatus:$approvalStatus,
              evaluationRemarks:$evaluationRemarks},
              taskId:$id) 
            }          
      `,
          variables: {
            id: this.state.taskToBeEdited._id,
            approvalStatus: approvalStatus,
            evaluationRemarks: this.state.approvalRemarks,
          }
        })
      .then((result) => {
        console.log('response ', result.data)
        this.getTaskLists()
        // let tasksData=result.data.data.getTask
        // this.setState({existingTasks:tasksData})
      })
      .catch((err) => {
        console.log('error--', err)
      })
  }


  render() {
    if (this.state.isShowTaskRecord && !this.state.showApproval) {
      return (
        <div className="card">
          <button style={{ minWidth: '10%', float: "right", marginBottom: "10px" }} onClick={() => this.addTask()}>Add Task</button>
          <h2>All Tasks</h2>
          <table className="table-position">
            <thead>
              <tr style={{ padding: "10px" }}>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Deadline</th>
                <th>Working Status</th>
                <th>Approval Status</th>
                <th>View/Edit</th>
              </tr>
            </thead>
            <tbody>
              {this.state.existingTasks ? Object.entries(this.state.existingTasks)
                .map(([index, { createdBy, deadline, mappedName, desc, title, task }]) => (
                  <tr key={index}>
                    <td>{title}</td>
                    <td>{mappedName}</td>
                    <td>{new Date(+deadline).toLocaleDateString()}</td>
                    {/* <td>{deadline}</td> */}
                    <td>{task?.taskStatus || 'NA'}</td>
                    <td>{task?.approvalStatus}</td>
                    <td><button onClick={(event) => { this.handleEditChange(event, this.state.existingTasks[index]) }}>Edit</button></td>
                  </tr>
                )) : ''}
            </tbody>
          </table>
          {this.state.existingTasks?.length == 0 ? <span>No tasks assigned</span> : ''}


        </div>
      )
    }
    else if (!this.state.isShowTaskRecord && !this.state.showApproval) {
      return (
        <div className="card">
          <h2 className="align-label"> Create Task</h2>
          <div>
          <form noValidate>
            <div className='form-control'>
              <label htmlFor="title">Title</label>
              <input type='text'
                name='title' onChange={(event) => this.handleChange(event)} noValidate />
              {/* {errors.email.length > 0 && 
        <span className='error'>{errors.email}</span>} */}
            </div>
            <div className='form-control'>
              <label htmlFor="deadline">Task end date</label>
              <DatePicker
                selected={this.state.endDate}
                onChange={(date) => this.handleDateChange(date)}
              />

              {/* <input type='text' name='deadline' onChange={this.handleChange} noValidate />         */}
            </div>
            <div className='form-control'>
              <label htmlFor="assignedTo">Assigned to</label>
              <select onChange={(event) => {
                event.preventDefault();
                console.log('evenr', event.target.value)
                const { value } = event.target
                this.setState({ assignedTo: value })
              }} >
                {/* <option name="select" value="null"></option>
                  <option name="manager" value="manager">Manager</option>
                  <option name="worker" value="worker">Worker</option> */}
                {this.state.workerLists
                  .map((worker) => (
                    <option key={worker._id} value={worker._id}>{worker.name}</option>))}
              </select>
            </div>
            {/* <input type='text' name='assingedTo' onChange={(event)=>this.handleChange(event)} noValidate />          */}

            {/* </div>     */}
            <div className='form-control'>
              <label htmlFor="desc">Description</label>
              <input type='text' name='desc' onChange={(event) => this.handleChange(event)} noValidate />
              {/* {errors.password.length > 0 && 
        <span className='error'>{errors.password}</span>} */}
            </div>
            <div className='submit'>
              <button className="" onClick={(event) => this.handleSubmit(event)}>Save</button>
              <button className="" onClick={() => {
                this.setState({ isShowTaskRecord: true })
              }}>Back</button>

            </div>
          </form>

</div>
        </div>
      )
    }
    else if (this.state.showApproval && !this.state.isShowTaskRecord) {
      return (
        <div className="approval-card">
          <h2 className="align-label"> Work Evaluation</h2>
          <div className="form-control">
            <label htmlFor="title">Title: {this.state.taskToBeEdited.title}</label>
            {/* <label></label> */}
          </div>
          <div className="form-control">
            <label htmlFor="title">Assigned To: {this.state.taskToBeEdited.mappedName}</label>
          </div>
          <div className="form-control">
            <label htmlFor="title">Deadline: {new Date(+this.state.taskToBeEdited.deadline).toLocaleDateString()}</label>
          </div>
          <div className="form-control">
            <label htmlFor="title">Work done:
                {this.state.taskToBeEdited.task.work}
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
            <textarea name="evaluationRemarks" rows="3" style={{ width: "25%" }}
              onChange={(event) =>
                this.setState({ approvalRemarks: event.target.value })}
            ></textarea>
          </div>
          {/* <div>kl{this.state.approvalRemarks?false:true}</div> */}
          <div className="btn-grp">
            <button disabled={true} onClick={(event) => this.taskEvaluation(event, 'approved')}>Approve</button>
            <button disabled={this.state.approvalRemarks ? false : true} onClick={(event) => this.taskEvaluation(event, 'rejected')}>Reject </button>
            <button onClick={(event) => this.setState({ showApproval: false, isShowTaskRecord: true })}>Back</button>
          </div>
        </div>

      )
    }
  }
}