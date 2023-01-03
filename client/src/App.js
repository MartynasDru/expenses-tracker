import logo from './logo.svg';
import styled from 'styled-components';
import './App.css';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

function App() {
  return (
    <div>
      <Title>Expenses tracker</Title>
    </div>
  );
}

export default App;
