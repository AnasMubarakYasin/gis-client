import { newEnforcer } from 'casbin';

const e = await newEnforcer('path/to/model.conf', 'path/to/policy.csv');

const sub = 'alice'; // the user that wants to access a resource.
const obj = 'data1'; // the resource that is going to be accessed.
const act = 'read'; // the operation that the user performs on the resource.

if ((await e.enforce(sub, obj, act)) === true) {
    // permit alice to read data1
} else {
    // deny the request, show an error
}

const roles = await e.getRolesForUser('alice');
