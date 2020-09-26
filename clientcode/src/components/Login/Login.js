
import React from 'react';
import axios from 'axios';
import  './Login.css';
import axiosInstance from '../../helpers/axios'
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      email: null,
      password: null,
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
    console.log('taget val',event.target.value,'name',event.target.name)

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

  handleSubmit = async (event) => {
    event.preventDefault();
    if(validateForm(this.state.errors)) {
      console.info('Valid Form email',this.state.email,'pwd',this.state.password)

    axiosInstance()
    .post("http://localhost:8080/graphql",
    {
        query: `            
              query($email:String,$password:String){
                getUser(email:$email,password:$password){
                  password,email,isValidUser
                }
            }
            
        `,
        variables:{
          email:this.state.email,
          password:this.state.password
        }
    }).then((result)=>{
      console.log('result axios',result)
      let loginResponse=result.data.data.getUser[0]
      console.log('login response',loginResponse)
      if(loginResponse.isValidUser)
        this.props.history.push('/workerdashboard')
      else
        alert('Invalid Credentials')
    })
    }else{
      console.error('Invalid Form')
    }
    
  //   axios({
  //     method: 'get',
  //     url: 'http://localhost:8080/login',
  //     // data: formData,
  //     headers: { 'user_code': 'shobana@gmail.com','password':'admin123'}
  // })
  // .then(function (response) {
  //   console.log('response from Login BE',response)
  // })
  // .catch(function (response) {
  //     //handle error
  //     console.log('error resppp',response)
  // });
  // axios({
  //   url:'http://localhost:8080/graphql',
  //   method: 'get',
  //   // 'Content-Type': 'application / json',
  // //   headers: new Headers({
  // //     'Content-Type': 'application/json',
  // //     'Accept': 'application/json',
  // // }),
  // data: JSON.stringify({query}),
  //   // data: {
     
  //   // query:`query {
  //   //   events{
  //   //   name,_id,password,email
  //   //   }}`
  //   // }

  // }).then((result) => {
  //   console.log(result.data)
  // })
  // .catch((err)=>{
  //   console.log('axios GET err',err)
  // })
  }
test=(event)=>{
  event.preventDefault();
  axiosInstance()
  .get("login/test",
  {
    headers:{
    user_code:'shobana@gmail.com',
    password:'admin123'}
  })
  .then((res) => {
    console.log('response ',res)
   
  })
  .catch((err)=>{
    console.log('error--',err)
  })
}
  render() {
    const {errors} = this.state;
    return (
      <div className="wrapper">
        <div className='form-wrapper'>
          <h2>Login</h2>
          <form  noValidate>            
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
            <div className='submit'>
              <button onClick={this.handleSubmit}>Login</button>
            </div>
            <div className='signup'>
            <label className='cursor'>Signup</label>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
