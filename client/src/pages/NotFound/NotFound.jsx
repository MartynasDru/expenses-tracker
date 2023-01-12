import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundStyled = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
`;

export const NotFound = () => {
    return (
        <NotFoundStyled>
            <h1>Page not found</h1>
            <Link to="/">Go to Home page</Link>
        </NotFoundStyled>
    );
}