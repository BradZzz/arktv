/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import HomePage from 'containers/HomePage/Loadable';
import ViewerPage from 'containers/ViewerPage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

import GlobalStyle from '../../global-styles';
import { makeSelectLoginInfo } from '../LoginPage/selectors';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

function App(props) {
  const { location, login } = props;

  console.log('App', props);

  const PrivateRoute = ({ component: Component, ...rest }) => {
    const no = (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    );

    const yes = <Component {...props} />;

    return (
      <Route
        {...rest}
        render={props =>
          Object.entries(login).length === 0 && login.constructor === Object
            ? { no }
            : { yes }
        }
      />
    );
  };

  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <div style={{ padding: '2em' }}>
        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute path="/viewer" component={ViewerPage} />
          <PrivateRoute path="/features" component={FeaturePage} />
          <Route path="/login" component={() => <LoginPage login={login} />} />
          <Route path="" component={NotFoundPage} />
        </Switch>
      </div>
      {Object.entries(login).length === 0 && login.constructor === Object ? (
        <></>
      ) : (
        <Footer />
      )}
      <GlobalStyle />
    </AppWrapper>
  );
}

App.propTypes = {
  login: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLoginInfo(),
});

export function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(App);
