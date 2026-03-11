import React from 'react';
import { cn } from '../../lib/utils';

interface UserAvatarProps {
    src?: string | null;
    firstName?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'circle' | 'square';
    className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    src,
    firstName = 'U',
    size = 'md',
    variant = 'circle',
    className
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
    };

    const shapeClass = variant === 'circle' ? 'rounded-full' : 'rounded-xl';
    const initial = firstName.charAt(0).toUpperCase();

    return (
        <div className={cn(
            "flex items-center justify-center overflow-hidden bg-gray-100 text-gray-600 font-bold",
            sizeClasses[size],
            shapeClass,
            className
        )}>
            {src ? (
                <img
                    src={src}
                    alt={firstName}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span>{initial}</span>
            )}
        </div>
    );
};

export default UserAvatar;
