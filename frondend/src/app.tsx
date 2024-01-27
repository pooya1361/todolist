import React, { useEffect, useState } from 'react';
import './app.css';
import * as API from './api';
import { Task } from './model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faEdit, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const [tasks, setTasks] = useState<Array<Task>>();
    const [allTasks, setAllTasks] = useState<Array<Task>>();
    const [selectedTask, setSelectedTask] = useState<Task>();
    const [deletingTask, setDeletingTask] = useState<Task>();
    const [filterMode, setFilterMode] = useState<"all" | "completed" | "not-completed">("all");

    const getFilteredTasks = (tasks?: Task[]): Task[] | undefined => {
        switch (filterMode) {
            case "completed":
                return tasks?.filter(t => t.completed)

            case "not-completed":
                return tasks?.filter(t => !t.completed)

            default:
                return tasks
        }
    }

    const loadAllTasks = () => API.getTasks().then(data => {
        setTasks(data)
        setAllTasks(data)
        setDeletingTask(undefined)
        setSelectedTask(undefined)
    })

    useEffect(() => { loadAllTasks() }, [])


    const toggleCompleted = (updatedTask: Task): void => {
        if (!selectedTask) {
            updatedTask.completed = !updatedTask.completed
            updateTask(updatedTask)
        }
    }


    const updateTask = (task: Task) => {
        API.updateTask(selectedTask ?? task).then(loadAllTasks)
    }

    const handleKeyPress = (e: any) => {
        switch (e.key) {
            case 'Enter':
                updateTask(selectedTask!)
                break;
            case 'Escape':
                setSelectedTask(undefined)
                break;

            default:
                break;
        }
    }

    const handleDeleteTask = () => {
        API.deleteTask(deletingTask!).then(loadAllTasks)
    }

    const handleAddTask = () => {
        const emptyTask: Task = {
            id: -1,
            task: "",
            completed: false
        }
        let _tasks: Task[] = tasks || [];
        _tasks.unshift(emptyTask)
        setTasks(_tasks)
        setAllTasks(_tasks)
        setSelectedTask(emptyTask)
    }

    // const handleFilterMode = (mode: ) => 

    return (
        <div className='flex flex-col p-2 min-h-screen max-w-xl max-h-full mx-auto gap-4'>
            <img className='max-w-xs mx-auto' src="https://valueguard.se/static/media/valueguardlogo_black.f3a4c174.png" />
            <h2 className='text-3xl font-extrabold text-center'>Todolist</h2>
            <div className='flex -mb-4'>
                <div className="flex flex-1 md:flex-none -space-x-0 divide-x divide-gray-300 overflow-hidden rounded-md rounded-b-none border border-gray-300 border-b-0 shadow-sm">
                    <button type="button" className={(filterMode === "all" ? "bg-primary text-white font-bold" : "bg-white text-secondary-700") + " flex-1 px-4 py-2.5 text-center text-sm whitespace-nowrap"} onClick={() => setFilterMode("all")}>
                        {`Alla (${(tasks?.length) || 0})`}
                    </button>
                    <button type="button" className={(filterMode === "completed" ? "bg-primary text-white font-bold" : "bg-white") + " flex-1 px-4 py-2.5 text-center text-sm text-secondary-700 whitespace-nowrap"} onClick={() => setFilterMode("completed")}>
                        {`Färdiga (${tasks?.filter(t => t.completed).length || 0})`}
                    </button>
                    <button type="button" className={(filterMode === "not-completed" ? "bg-primary text-white font-bold" : "bg-white") + " flex-1 px-4 py-2.5 text-center text-sm text-secondary-700 whitespace-nowrap"} onClick={() => setFilterMode("not-completed")}>
                        {`Ofärdiga (${tasks?.filter(t => !t.completed).length || 0})`}
                    </button>
                </div>
            </div>
            <div className='flex flex-col flex-1 text-xl md:text-lg min-h-full max-h-full bg-gray-50 dark:bg-gray-100 rounded-md rounded-t-none md:rounded-tr-md relative border border-gray-300'>
                {Number(tasks?.length) > 0 && getFilteredTasks(tasks)?.map(task => {
                    return (
                        <div key={task.id} className='flex group relative gap-1 border-b border-b-gray-300 p-2'>
                            {selectedTask?.id === task.id ?
                                <div className=' flex bg-gray-100 gap-1 w-full'>
                                    <div className='flex w-full'>
                                        <input autoFocus value={selectedTask.task} onChange={(val) => {
                                            const _selectedTask = { ...selectedTask }
                                            _selectedTask.task = val.target.value
                                            setSelectedTask(_selectedTask)
                                        }} className={'w-full pl-2 py-2 bg-gray-100'} onKeyUp={handleKeyPress} />
                                    </div>

                                    <button disabled={selectedTask?.task.length === 0} className='disabled:text-gray-400 rounded-full'>
                                        <FontAwesomeIcon className='p-2 self-center' icon={selectedTask?.task.length ? faCheck : faBan} onClick={() => updateTask(selectedTask)} />
                                    </button>

                                    <button className='disabled:text-gray-400 rounded-full'>
                                        <FontAwesomeIcon className='p-2 self-center' icon={faXmark} onClick={() => setSelectedTask(undefined)} />
                                    </button>
                                </div>
                                :
                                <>
                                    <div className='flex w-full'>
                                        <span className={'w-full p-2 select-none cursor-pointer' + (task.completed ? ' line-through' : '')} onClick={() => toggleCompleted(task)}>{task.task}</span>
                                    </div>
                                    <button className='disabled:text-gray-400 rounded-full'>
                                        <FontAwesomeIcon className='p-2 self-center' icon={faEdit} onClick={() => setSelectedTask(task)} />
                                    </button>
                                    <button disabled={!!selectedTask} className='disabled:text-gray-400 rounded-full'>
                                        <FontAwesomeIcon className='p-2 self-center' icon={faTrash} onClick={() => setDeletingTask(task)} />
                                    </button>
                                </>
                            }

                        </div>
                    )
                }) || <div className='flex flex-col flex-1 min-h-full justify-center text-center'>
                        <span>Inga uppgifter hittades <br /> Lägg till en ny uppgift</span>
                    </div>}

                <button type="button"
                    className="absolute bottom-4 right-4 rounded-full border border-primary-500 bg-green-500 p-3 text-center text-base font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
                    onClick={handleAddTask}>
                    <FontAwesomeIcon className='text-3xl w-8' icon={faPlus} />
                </button>
            </div>
            {deletingTask ?
                <div className="z-[100]">
                    <div>
                        <div className="fixed inset-0 z-10 bg-secondary-700/50"></div>
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-secondary-700/50">
                            <div className="mx-auto overflow-hidden rounded-lg bg-white shadow-xl sm:w-full sm:max-w-lg border border-gray-300">
                                <div className="relative p-6">
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-secondary-900">Ta bort</h3>
                                            <div className="mt-2 text-sm text-secondary-500">Är du säker?</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button type="button" onClick={() => setDeletingTask(undefined)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400">Cancel</button>
                                        <button type="button" onClick={handleDeleteTask} className="rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : undefined}
            <div className='text-center'>Powerd by: Pouya</div>
        </div>
    )
}

export default App;