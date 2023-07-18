
const TaskInstance = (props) => {
    const handleCheck = () => {
        props.toggleTask(props.id)
    }

    return(
        <div className="task-cont">
            <div style={{textAlign: "right"}}>
                <small>story_id: {props.story_id}</small>
            </div>
            <p className="task-title">{props.title}</p>
            <b>Desde {String(new Date(props.start_date).toLocaleDateString() + ", "+ new Date(props.start_date).toLocaleTimeString() )}, 
            Hasta el {String(new Date(props.end_date).toLocaleDateString() + ", "+ new Date(props.end_date).toLocaleTimeString() )}</b>
            <p className="task-description">{props.description}</p>
            <p className="task-stage">Etapa: {props.stage}</p>
            {!props.completed && <div><i>Completada: </i><input type="checkbox" onClick={handleCheck}></input></div>}
            {props.completed && <b>{props.score} / 10</b>}
        </div>
    )
}

export default TaskInstance