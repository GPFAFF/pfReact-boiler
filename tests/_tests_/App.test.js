import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import App from '../../src/components/App';

it('renders correctly', () => {
  const tree = renderer
    .create(<App header='pfReact Boiler' />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('App', () => {
  test('should match snapshot', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('h1').text()).toBe('pfReact Boiler');
  });
});
