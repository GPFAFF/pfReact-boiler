import React from 'react';
import PropTypes from 'prop-types';

const App = (props) => {
  const { header } = props;
  return (
    <h1>pfReact Boiler</h1>
  );
};

App.propTypes = {
  header: PropTypes.string,
};

export default App;
