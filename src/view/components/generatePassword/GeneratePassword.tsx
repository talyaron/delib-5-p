import React from 'react';
import Button from '../buttons/button/Button';

interface GeneratePasswordProps {
    statementId: string;
}

function GeneratePassword({ statementId }: GeneratePasswordProps) {
    async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        try {
            const plainPassword = Math.floor(1000 + Math.random() * 9000);

            const response = await fetch('http://localhost:5001/synthesistalyaron/us-central1/hashPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    statementId: statementId,
                    plainPassword: plainPassword
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Server response:', responseData);
            } else {
                console.error('Error posting to server:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error in HTTP request:', error);
        }
    }
    return (
        <Button
            text={"Generate Password"}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e)}
            className='btn btn--affirmation'
        />
    )
}

// const newDocRef = await addDoc(collection(DB, Collections.statementsPasswords), {
//     statementId: statementId,
//     hashedPassword: hashedPassword
// });
export default GeneratePassword