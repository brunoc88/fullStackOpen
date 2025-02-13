const Header = ({ title }) => {
    return (
        <h2>{title}</h2>
    )
}

const Part = ({ name, exercises }) => {
    return (
        <p>{name} {exercises}</p>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(value => {
                return (
                    <Part key={value.id} name={value.name} exercises={value.exercises} />
                )
            })}
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <p><strong>Total of {total} exercises</strong></p>
    )
}

const Course = ({ courses }) => {
    return (
        <div>
            <h1>Web development curriculum</h1>
            {courses.map(value => {
                return (
                    <div key={value.id}>
                        <Header title={value.name} />
                        <Content parts={value.parts} />
                        <Total parts={value.parts} />
                    </div>
                )
            })}
        </div>
    )
}


export default Course