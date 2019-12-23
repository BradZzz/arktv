/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import GoogleLogin from 'react-google-login';
import { push } from 'connected-react-router';

import messages from './messages';
import reducer from './reducer';
import { updateLogin } from './actions';

const key = 'login';

export function LoginPage(props) {
  const { onUpdateLogin, redirectLogin, login } = props;

  if (!(Object.entries(login).length === 0 && login.constructor === Object)) {
    redirectLogin('/');
  }

  const responseGoogle = response => {
    console.log('responseGoogle', response);
    try {
      console.log('responseGoogle.profileObj', response.profileObj);
      onUpdateLogin(response.profileObj);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <GoogleLogin
        clientId="1095795417803-8qaafo9b88j3kt61csjsi9mnkrjf037o.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
        scope="profile email https://www.googleapis.com/auth/cloud-platform"
      />
    </div>
  );
}

LoginPage.propTypes = {
  onUpdateLogin: PropTypes.func,
  redirectLogin: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({});

export function mapDispatchToProps(dispatch) {
  return {
    onUpdateLogin: creds => dispatch(updateLogin(creds)),
    redirectLogin: path => dispatch(push(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(LoginPage);
