//export const BASE_URL = "https://support.i2gether.com/api";
export const BASE_URL = "http://localhost:5000/api";
export const TICKET_STATUS_LIST = ['Created', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export const PRIORITY_LIST = {
    P1: 'Critical',
    P2: 'Major',
    P3: 'Minor',
}

export const PRIORITY_COLOR = {
    P1: 'text-bg-danger',
    P2: 'text-bg-warning',
    P3: 'text-bg-primary',
}

// Priority AutoComplete's or select  options
export const PRIORITY_OPTIONS = [
    { id: 3, name: "Minor", value: "P3" },
    { id: 2, name: "Major", value: "P2" },
    { id: 1, name: "Critical", value: "P1" },
];