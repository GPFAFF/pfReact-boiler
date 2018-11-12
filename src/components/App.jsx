import React from 'react';
import PropTypes from 'prop-types';

const App = (props) => {
  const { header } = props;
  return (
    <h1>{header}</h1>
  );
};

App.propTypes = {
  header: PropTypes.string,
};

App.defaultProps = {
  header: 'React Boiler',
};

export default App;
