import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";

const LoginContainer = styled.div`
    align-items: center;
    background-color: lightgrey;
    display: flex;
    justify-content: center;
    height: 100vh;
`;

const FormStyled = styled.form`
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 15px;
`;

const LinkStyled = styled(Link)`
    align-self: center;
`;

const FieldsetStyled = styled.fieldset`
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
`;

export const Login = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name, 
                password
            })
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            }

            throw new Error('Test error');
        })
        .then((data) => {
            onSuccess(data);
            setIsLoading(false);
        })
        .catch((e) => {
            setError(String(e));
            setIsLoading(false);
        })
    }

    return (
        <LoginContainer>
            <FormStyled onSubmit={handleLogin}>
                <h1>Expenses tracker</h1>
                <FieldsetStyled disabled={isLoading}>
                    <Input 
                        placeholder="Name" 
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <Input 
                        placeholder="Password" 
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {error && <div>{error}</div>}
                    <Button>Login</Button>
                </FieldsetStyled>
                <LinkStyled to="/register">Register</LinkStyled>
            </FormStyled>
        </LoginContainer>
    );
}