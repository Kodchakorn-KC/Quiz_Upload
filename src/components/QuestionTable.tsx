import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
} from '@mui/material'

import { Question } from '../types/types'
import { escapeHTMLForXML } from '../utils/escapeHTML'

interface Props {
  questions: Question[]
}

const QuestionTable: React.FC<Props> = ({ questions }) => {
  const [selectedCards, setSelectedCards] = useState<number[]>([])

  const handleCardSelect = (index: number) => {
    setSelectedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const exportToXML = () => {
    const selectedQuestions = questions.filter((_, i) =>
      selectedCards.includes(i)
    )

    const xmlQuestions = selectedQuestions
      .map((q) => buildQuestionXML(q))
      .join('\n')
    console.log(xmlQuestions)

    const blob = new Blob([`<quiz>\n${xmlQuestions}\n</quiz>`], {
      type: 'application/xml',
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'QuizDownload.xml'
    link.click()
  }

  const buildQuestionXML = (q: Question): string => {
    let xml = `<question type="${q.type}">\n`
    xml += `  <name><text>${escapeHTMLForXML(q.name.text)}</text></name>\n`
    xml += `  <questiontext><text>${escapeHTMLForXML(
      q.questiontext.text
    )}</text></questiontext>\n`

    if (q.type === 'matching' && q.subquestions) {
      q.subquestions.forEach((sub) => {
        xml += `  <subquestion>\n`
        xml += `    <text>${escapeHTMLForXML(sub.text)}</text>\n`
        xml += `    <answer><text>${escapeHTMLForXML(
          sub.answer.text
        )}</text></answer>\n`
        xml += `  </subquestion>\n`
      })
    }

    if (
      ['multichoice', 'truefalse', 'shortanswer', 'numerical'].includes(
        q.type
      ) &&
      q.answers
    ) {
      q.answers.forEach((ans) => {
        xml += `  <answer fraction="${ans.fraction}"><text>${escapeHTMLForXML(
          ans.text
        )}</text></answer>\n`
      })
    }

    xml += `</question>`
    return xml
  }

  return (
    <main className="QuestionList">
      <Button
        variant="contained"
        color="primary"
        onClick={exportToXML}
        disabled={selectedCards.length === 0}
        style={{ marginBottom: '1rem' }}
      >
        Exportiere ausgewählte Fragen als XML
      </Button>

      {questions.map((q, index) => (
        <Card
          key={index}
          style={{
            cursor: 'pointer',
            padding: '16px',
            border: selectedCards.includes(index)
              ? '2px solid blue'
              : '1px solid #ccc',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <Checkbox
              checked={selectedCards.includes(index)}
              onChange={() => handleCardSelect(index)}
            />
          </div>

          {q.name?.text?.trim() && <CardHeader title={q.name.text.trim()} />}

          <div
            dangerouslySetInnerHTML={{ __html: q.questiontext?.text || '' }}
          />

          {q.type === 'matching' && q.subquestions && (
            <MatchingDisplay subquestions={q.subquestions} />
          )}

          {['multichoice', 'truefalse'].includes(q.type) && q.answers && (
            <AnswerCheckboxList answers={q.answers} />
          )}

          {['shortanswer', 'numerical'].includes(q.type) && q.answers && (
            <AnswerTextFieldList answers={q.answers} />
          )}
        </Card>
      ))}
    </main>
  )
}

const MatchingDisplay: React.FC<{
  subquestions: Question['subquestions']
}> = ({ subquestions }) => {
  const uniqueAnswers = Array.from(
    new Set(subquestions?.map((s) => s.answer.text) ?? [])
  )

  return (
    <div>
      {subquestions?.map((subq, i) => (
        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '8px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: subq.text }} />
          <select>
            <option value="">-- Wähle eine Antwort --</option>
            {uniqueAnswers.map((answer, index) => (
              <option key={index} value={answer}>
                {answer}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

const AnswerCheckboxList: React.FC<{
  answers: Question['answers']
}> = ({ answers }) => (
  <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', listStyle: 'none' }}>
    {answers?.map((ans, i) => (
      <li key={i}>
        <FormControlLabel
          control={<Checkbox />}
          label={<span dangerouslySetInnerHTML={{ __html: ans.text }} />}
        />
      </li>
    ))}
  </ul>
)

const AnswerTextFieldList: React.FC<{
  answers: Question['answers']
}> = () => {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <TextField fullWidth variant="outlined" label="Deine Antwort" />
    </div>
  )
}

export default QuestionTable
