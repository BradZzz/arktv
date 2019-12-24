/* eslint no-console: ["error", { allow: ["error"] }] */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import GoogleLogin from 'react-google-login';
import { push } from 'connected-react-router';

import { updateLogin } from './actions';

export function LoginPage(props) {
  const { onUpdateLogin, redirectLogin, login } = props;

  if (!(Object.entries(login).length === 0 && login.constructor === Object)) {
    redirectLogin('/');
  }

  const responseGoogle = response => {
    try {
      onUpdateLogin(response.profileObj);
    } catch (err) {
      console.error(err);
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
  login: PropTypes.object,
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
