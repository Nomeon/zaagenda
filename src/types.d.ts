type User = {
    _id: string;
    name: string;
    email: string;
}

type Group = {
    _id?: string;
    group_name?: string;
    user_ids?: Array<string>;
    rave_ids?: Array<string>;
}

type Grouplist = {
    name?: string;
    id?: string;
    users: string[];
}[]

type Rave = {
    _id?: string;
    event?: string;
    date?: Date;
    attendees?: Array<User>
    tickets?: Array<User>
}