class User{    

    constructor(id, name, email) {
        this.userId = id;
        this.userName = name;
        this.userEmail = email;
    }

    /**
     * Construct a User from a plain object
     * @param {{}} json 
     * @return {User} the newly created User object
     */
    static from(json) {
        const u =  Object.assign(new User(), json);
        return u;
    }

}

export default User;

