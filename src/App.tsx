import React, { useState } from 'react'
import XMLUploader from './components/XMLUploader'
import QuestionTable from './components/QuestionTable'
import { Question } from './types/types'

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])

  return (
    <div className="AppStyled">
      <header>
        <h1>XML Frage-Manager</h1>
        <h2>Fragen hochladen</h2>
        <XMLUploader onUpload={setQuestions} />
      </header>
      <QuestionTable questions={questions} />
    </div>
  )
}

export default App
