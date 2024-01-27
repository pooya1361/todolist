import { Task } from "./model";
const url = 'http://37.153.139.149:8080/api/v1/';

const getHeaders = (authorizationToken?: string) => new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36',
    'Vary': 'Origin,Access-Control-Request-Method,Access-Control-Request-Headers'
})


const APICall = async (url: string, method: "POST" | "GET" | "DELETE" | "PUT", headers: Headers, body?: BodyInit, success?: (response: any) => void, failure?: (err: any) => void) => fetch(url, {
    method,
    headers,
    body
}).then(response => {
    if (response.ok) {
        if (method !== "DELETE") {
            const res_json = response.json();
            return res_json.then(response => {
                if (response) {
                    success && success(response);
                }
                return response;
            })
        } else {
            if (response) {
                success && success(response);
            }
        }
    } else {
        if (method !== "DELETE") {
            const res_json = response.json();
            res_json.then(err => {
                failure && failure(err);
                console.log(`💥 in APICall(${url}) `, err)
            });
        } else {
            //failure && failure(err);
        }
        return Promise.reject();
    }
})

export const getTasks = async (): Promise<Array<Task>> => APICall(url + "tasks/", 'GET', getHeaders(), undefined,
    (response => {
        return Array<Task>(response)
    }), ((err) => {
        console.log('💥 in getTasks() ', err);
        return []
    })
)

export const updateTask = async (task: Task): Promise<Array<Task>> => APICall(url + "tasks/" + task.id.toString(), 'PUT', getHeaders(),
    JSON.stringify(task),
    (response => {
        return <Task>(response)
    }), ((err) => {
        console.log('💥 in updateTask() ', err);
        return []
    })
)

export const deleteTask = async (task: Task): Promise<Boolean> => APICall(url + "tasks/" + task.id.toString(), 'DELETE', getHeaders(),
    JSON.stringify(task),
    (response => <Boolean>(response)), ((err) => {
        console.log('💥 in deleteTask() ', err);
        return []
    })
)
