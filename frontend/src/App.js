import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import Questions from './Questions/Questions';
import { Route, withRouter } from 'react-router-dom';
import Question from './Question/Question';
import Callback from './Callback';
import NewQuestion from './NewQuestion/NewQuestion';
import SecuredRoute from './SecuredRoute/SecuredRoute';
import auth0Client from './Auth';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    }
  }

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') {
      this.setState({ checkingSession: false });
      return;
    };
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error === 'login_required') return;
      console.log(err.error);
    }
    this.setState({ checkingSession: false });
  }

  render() {
    return (
      <div>
        <NavBar />
        <Route exact path='/' component={Questions} />
        <Route exact path='/question/:questionId' component={Question} />
        <Route exact path='/callback' component={Callback} />
        <SecuredRoute path='/new-question'
          component={NewQuestion}
          checkingSession={this.state.checkingSession} />
      </div>
    );
  }
}

/* Close app inside the withRouter function to check what route
is being called (this.props.location.pathname). Without withRouter,
there is no access to the location object. */
export default withRouter(App);
