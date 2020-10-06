
import React from 'react';
import  './Signup.css';
import axiosInstance from '../../helpers/axios';
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      email: null,
      password: null,
      role:'',
      errors: {
        fullName: '',
        email: '',
        password: '',
      }
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'fullName': 
        errors.fullName = 
          value.length <= 0
            ? 'Full Name is required!'
            : '';
        break;
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password': 
        errors.password = 
          value.length < 8
            ? 'Password must be at least 8 characters long!'
            : '';
        break;
      default:
        break;
    }

    this.setState({errors, [name]: value});
  }

  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   if(validateForm(this.state.errors)) {
  //     console.info('Valid Form')
  //   }else{
  //     console.error('Invalid Form')
  //   }
  // }
  createUser(event){
    event.preventDefault();
    console.log('inside')
    const {fullName,password,role,email}=this.state
    console.log('name',fullName,'pwd',password,'role',role,'em',email)
    axiosInstance()
    .post("http://localhost:5000/graphql",
    {
     
        query: `            
              mutation($email:String,$password:String,$name:String,$role:String){
                createUser(email:$email,password:$password,name:$name,role:$role){
                  name,email
                }
            }
        `,
        variables:{
          email:this.state.email,
          password:this.state.password,
          role:this.state.role,
          name:this.state.fullName
        }
    }).then((result)=>{
     console.log('signup resu',result)
    })
   .catch((err)=>{
     console.log('signup err',err)
   })
  }

  render() {
    const {errors} = this.state;
    return (
      <div className="wrapper">
        <div className='form-wrapper'>
          <h2>Create Account</h2>
          <form  noValidate>
            <div className="fullName">
              <label htmlFor="fullName">Full Name</label>
              <input type='text' name='fullName' onChange={this.handleChange} noValidate />
              {errors.fullName.length > 0 && 
                <span className='error'>{errors.fullName}</span>}
            </div>
            <div className='email'>
              <label htmlFor="email">Email</label>
              <input type='email' name='email' onChange={this.handleChange} noValidate />
              {errors.email.length > 0 && 
                <span className='error'>{errors.email}</span>}
            </div>
            <div className='password'>
              <label htmlFor="password">Password</label>
              <input type='password' name='password' onChange={this.handleChange} noValidate />
              {errors.password.length > 0 && 
                <span className='error'>{errors.password}</span>}
            </div>          
            <div className="role">
                <label htmlFor="role">Role</label>
                <select className="role-select" onChange={(event)=>{
                  event.preventDefault();
                  console.log('evenr',event.target.value)
                  const {name,value}= event.target
                    this.setState({role:value})
                }} >
                  <option name="select" value="null"></option>
                  <option name="manager" value="manager">Manager</option>
                  <option name="worker" value="worker">Worker</option>
                </select>             
              </div>

            <div className='submit'>
              <button onClick={(event)=>{
                this.createUser(event)
              }
              }>Sign up</button>
              <div className='signup'>
                <label className='cursor' onClick={()=>{
                  this.props.history.push('/login')
                }
                  
                }>Login</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
