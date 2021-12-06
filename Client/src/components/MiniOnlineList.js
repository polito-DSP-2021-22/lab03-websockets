import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import {PersonBoundingBox} from  'react-bootstrap-icons';

const MiniOnlineList = (props) => {
    const {onlineList} = props;

    const createUserItem = (user) => {
        return (
            <ListGroup.Item><img src={require("../world.png").default} alt={"Eagle"} width="20" height="20"  />{ " User: "+user.userName}</ListGroup.Item>
        );
    }
        
    
    return (
        <>
           <ListGroup  variant="flush">
                <ListGroup.Item className="p-3 mt-5 list-title">Online Users</ListGroup.Item>
                {onlineList.map(user => createUserItem(user)) }
            </ListGroup>
        </>
    );
}



export default MiniOnlineList;
