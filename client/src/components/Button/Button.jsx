import styled from "styled-components"

const ButtonStyled = styled.button`
    background-color: #24a0ed;
    border: 1px solid lightgray;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    padding: 10px 20px;

    &:disabled {
        opacity: 0.5;
    }
`;

export const Button = (props) => {
    return <ButtonStyled {...props} />
}