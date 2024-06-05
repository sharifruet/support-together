import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import GlobalContext from '../../GlobalContext';

const Comment = ({comment}) => {
    const {users} = useContext(GlobalContext);

    const getCommenter = () => users?.find(u=>u.id===comment.createdBy)?.name;
    const getCommentAt = () => users?.find(u=>u.id===comment.createdBy)?.createdAt;

    const getCommentTime = () => {
        const commentDate = new Date (getCommentAt());

        return commentDate.toLocaleDateString() + ' ' + commentDate.toLocaleTimeString();
    }

    return (
        <Card>
            <Card.Body>{comment.content}</Card.Body>
            <Card.Footer className='text-end'>{getCommenter()} on {getCommentTime()}</Card.Footer>
        </Card>
    );
};

export default Comment;
