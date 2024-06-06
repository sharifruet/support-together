import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import GlobalContext from '../../GlobalContext';
import { format } from 'date-fns';

const Comment = ({comment}) => {
    const {users} = useContext(GlobalContext);

    const getCommenter = () => users?.find(u=>u.id===comment.createdBy)?.name;

    return (
        <Card>
            <Card.Body>{comment.content}</Card.Body>
            <Card.Footer className='text-end'>{getCommenter()} on {format(new Date(comment.createdAt||'2024'),'yyyy-MM-dd hh:mm aaa')}</Card.Footer>
        </Card>
    );
};

export default Comment;
