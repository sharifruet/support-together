import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import GlobalContext from '../../GlobalContext';
import moment from 'moment';

const Comment = ({comment}) => {
    const {users} = useContext(GlobalContext);

    const getCommenter = () => users?.find(u=>u.id===comment.createdBy)?.name;

    return (
        <Card>
            <Card.Body>{comment.content}</Card.Body>
            <Card.Footer className='text-end'>{getCommenter()} on {moment(comment.createdAt||'2024').format('ddd, D MMMM, YYYY hh:mm A')}</Card.Footer>
        </Card>
    );
};

export default Comment;
