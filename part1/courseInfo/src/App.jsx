const Header = ({name}) =>{
  return(<div><h1>{name}</h1></div>)
}

const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>;
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.name} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};


const Total = ({parts})=>{
  return(
    <div>
      <p>Total of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
    </div>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return(
    <div>
      <Header name = {course.name}/>
      <Content parts = {course.parts}/>
      <Total parts = {course.parts}/>
    </div>
  )  

}

export default App
