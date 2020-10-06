import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import CreateUser from './components/User/CreateUser';
// import HomePage from './components/HomePage/Home'
import SignUp from './components/Signup/Signup'
import Login from './components/Login/Login'
import WorkerDashboard from './components/WorkerDashboard/WorkerDashboard'
import ManagerDashboard from './components/ManagerDashboard/ManagerDashboard';

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
);
const Routes = () => (
  <Switch>
    <Route path="/" exact component={WorkerDashboard} />
    <Route path="/SignUp" exact component={SignUp} />
    <Route path="/Workerdashboard" exact component={WorkerDashboard} />
    <Route path="/Managerdashboard" exact component={ManagerDashboard} />
    <Route path="/login" exact component={Login} />
    <Route component={NoMatch} />
</Switch>
);

export default Routes;