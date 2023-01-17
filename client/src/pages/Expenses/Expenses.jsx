import { useContext, useEffect, useState } from "react";
import styled from 'styled-components';
import { Button } from "../../components/Button/Button";
import { Form } from "../../components/Form/Form";
import { Input } from "../../components/Input/Input";
import { UserContext } from '../../contexts/UserContextWrapper';
import { LOCAL_STORAGE_JWT_TOKEN_KEY } from '../../constants/constants';
import { DateTime } from 'luxon';

const ExpensesList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
`;

const ExpensesListItem = styled.li`
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 5px 7px -1px rgb(51 51 51 / 23%);
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
`;

const ExpenseAmount = styled.span`
    color: #35d8ac;
    font-size: 34px;
    font-weight: 700;
`;

const ExpenseType = styled.span`
    color: #979cb0;
    font-size: 20px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

export const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/expenses?userId=${user.id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN_KEY)
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setExpenses(data);
                }
                setIsLoading(false);
            });
    }, [user.id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleExpenseAdd = () => {
        fetch(`${process.env.REACT_APP_API_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN_KEY)
            },
            body: JSON.stringify({
                type, 
                amount,
                userId: user.id,
                timestamp: date
            })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (!data.error) {
                setExpenses(data);
                setType('');
                setAmount('');
            }
        });
    }

    const totalSum = expenses.reduce((totalSum, expense) => totalSum += parseInt(expense.amount), 0);

    return (
        <ExpensesList>
            <Form onSubmit={handleExpenseAdd}>
                <Input 
                    placeholder="Type" 
                    required 
                    onChange={(e) => setType(e.target.value)}
                    value={type}
                />
                <Input 
                    placeholder="Amount" 
                    type="number" 
                    required 
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                />
                <Input 
                    placeholder="Date"
                    type="datetime-local"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                />
                <Button>Add</Button>
            </Form>
            <h2>Total spent: €{totalSum}</h2>
            {expenses.map((exp) => (
                <ExpensesListItem key={exp.id}>
                    <ExpenseType>
                        {exp.type} ({DateTime.fromISO(exp.timestamp).toFormat('yyyy-LL-dd HH:mm')})
                    </ExpenseType>
                    <ExpenseAmount>€{exp.amount}</ExpenseAmount>
                </ExpensesListItem>
            ))}
        </ExpensesList>
    );
}