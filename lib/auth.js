export const canRead = (resource, user) => {
    if(!resource){
        return false;
    }
    if (!user) {
        return resource.permissions.allWrite || resource.permissions.allRead;
    }
    if (canEdit(resource, user)) {
        return true;
    }

    return (
        resource.permissions.allRead ||
        (resource.permissions.usersRead &&
            resource.permissions.usersRead.includes(user._id)) ||
        hasCommonItem(resource.permissions.groupsRead, user.groups)
    );
};

export const canEdit = (resource, user) => {
    if(!resource){
        return false;
    }
    if (!user) {
        return resource.permissions.allWrite;
    }

    return (
        resource.createdBy.toString() === user._id.toString() ||
        resource.permissions == undefined ||
        resource.permissions?.allWrite ||
        (resource.permissions?.usersWrite &&
            resource.permissions?.usersWrite.includes(user._id)) ||
        hasCommonItem(resource.permissions.groupsWrite, user.groups)
    );
};