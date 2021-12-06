class WSMessage {    
    constructor(type, userId, userName, taskId, taskName) {

        this.typeMessage = type;
        this.userId = userId;
        if(userName) this.userName = userName;
        if(taskId) this.taskId = taskId;
        if(taskName) this.taskName = taskName;
    }
}

module.exports = WSMessage;


