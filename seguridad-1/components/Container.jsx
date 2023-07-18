import TaskInstance from "./TaskInstance"

const Container = (props) => {

    const taskslist = props.tasks.map((task) => {
        return <TaskInstance key={task.id} toggleTask={props.toggleTask} {...task} />
    })

    const handleComplete = () => {
        props.completeTasks()
    }

    return(
        <div className="cont-cont">
            <div className="cont-upper-cont">   
                <p className="cont-title">{props.title}</p>
                {props.title === "Tareas por hacer" && <button className="cont-complete-btn" onClick={handleComplete}>Completar tareas</button>}
            </div>
            {taskslist}
        </div>
    )
}

export default Container