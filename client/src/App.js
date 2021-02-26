import React, { Component } from "react";
import { Router, Switch, Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import Home from './pages/Home';
import Create from './pages/Create';
import UserDetails from './pages/UserDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import Update from './pages/Update';
import GuardedRoute from './components/GuardedRoute'
import {isAuthenticated, isAdmin} from './utils/User'

import "./App.css";

class App extends Component {
  state = {
    isAuthenticated : isAuthenticated(),
    isAdmin : isAdmin()
  }

  render() {    
    return (
      <div className="App">

        <Navigation />
        <Switch>
          <GuardedRoute exact path='/' component={Home} 
            permission = {this.state.isAuthenticated} defaultRoute="/user/login" />
          <GuardedRoute exact path='/user/details' component={UserDetails} 
            permission = {this.state.isAuthenticated}  defaultRoute="/user/login" />
          <GuardedRoute exact path='/create' component={Create} 
            permission = {this.state.isAdmin}  defaultRoute="/" />
          <GuardedRoute exact path='/update/:votingTopic' component={Update} 
            permission = {this.state.isAdmin}  defaultRoute="/" />
          <GuardedRoute exact path='/user/register' component={Register} 
            permission = {!this.state.isAuthenticated}  defaultRoute="/" />
          <GuardedRoute exact path='/user/login' component={Login} 
            permission = {!this.state.isAuthenticated}  defaultRoute="/" />
        </Switch>

      </div>
    );
  }
}

export default App;


// class App extends Component {

//   requireLogin = (to,from,next) => {
//     if(to.meta.auth){
//       if(true){
//         next();
//       }
//       next.redirect("/user/login");
//     }
//     else{
//       next();
//     }
//   }

//   render() {    
//     return (
//       <div className="App">

//         <Navigation />
//         <GuardProvider guards={[this.requireLogin]}>
//           <Switch>
//             <GuardedRoute exact path='/' component={Home}/>
//             <GuardedRoute exact path='/user/details' component={UserDetails}/>
//             <GuardedRoute exact path='/user/register' component={Register}/>
//             <GuardedRoute exact path='/user/login' component={Login}/>
//             <GuardedRoute exact path='/create' component={Create}/>
//             <GuardedRoute exact path='/update/:id' render={(props) => <Update {...props} />} />

//         </Switch>

//         </GuardProvider>
        
//       </div>
//     );
//   }
// }