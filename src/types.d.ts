type User = {
    _id: string;
    name: string;
    email: string;
    image: string;
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
    _id: string;
    event: string;
    date: string;
    attendees?: Array<User>
    tickets?: Array<User>
}

type RaveList = {
    name: string;
    raves: Rave[];
    group_members: string[];
}[]