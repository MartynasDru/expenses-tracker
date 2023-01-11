import styled from 'styled-components';

const InputStyled = styled.input`
    border: 1px solid lightgray;
    border-radius: 10px;
    font-size: 16px;
    padding: 10px 20px;

    &:disabled {
        opacity: 0.5;
    }
`;

export const Input = ({ ...props }) => {
    return <InputStyled {...props} />
}