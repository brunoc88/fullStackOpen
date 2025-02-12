import { useState } from "react"

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{text === "Positive" ? `${value} %` : value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad, all }) => {
  const average = all > 0 ? (good - bad) / all : 0;
  const positivePercent = all > 0 ? (good * 100) / all : 0;
  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={all} />
          <StatisticLine text="Average" value={average} />
          <StatisticLine text="Positive" value={positivePercent} />
        </tbody>
      </table>
    </div>
  );
}

const Button = ({ clickGood, clickNeutral, clickBad }) => {
  return (
    <div>
      <button onClick={clickGood}>good</button>
      <button onClick={clickNeutral}>neutral</button>
      <button onClick={clickBad}>bad</button>
    </div>
  )
}

const App = () => {

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [allClicks, setClick] = useState(0);


  const handlerClickGood = () => {
    setGood(good + 1);
    setClick(prev => prev + 1)
  }


  const handlerClickNeutral = () => {
    setNeutral(neutral + 1);
    setClick(prev => prev + 1)
  }

  const handlerClickBad = () => {
    setBad(bad + 1);
    setClick(prev => prev + 1)
  }



  return (
    <div>
      <h1>give feedback</h1>
      <Button clickGood={handlerClickGood} clickNeutral={handlerClickNeutral} clickBad={handlerClickBad} />
      <Statistics good={good} neutral={neutral} bad={bad} all={allClicks} />
    </div>
  )
}

export default App;


