import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, Button } from '@aws-amplify/ui-react';
import Job from './components/screens/Job';
import '@aws-amplify/ui-react/styles.css';
import config from './aws-exports';
Amplify.configure(config);

function App({ signOut }) {
  return (
    <div className="App">
      <h1>
        Trade for a Tradie
        <Button style={{ float: 'right' }} onClick={signOut}>
          Sign Out
        </Button>
      </h1>

      <Job />
    </div>
  );
}

export default withAuthenticator(App);
