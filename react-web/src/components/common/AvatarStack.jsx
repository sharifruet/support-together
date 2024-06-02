import React from 'react';
import Avatar from './Avatar'; 

const AvatarStack = ({ avatarData }) => {
    return (
        <div className="avatar-stack">
            {avatarData.map((avatar, index) => (
                <Avatar
                    key={index}
                    src={avatar.src}
                    alt={avatar.alt}
                    size={avatar.size}
                    initials={avatar.initials}
                    name={avatar.name}
                />
            ))}
        </div>
    );
};

export default AvatarStack;