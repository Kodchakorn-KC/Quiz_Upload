import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

type SubQuestion = {
  text: string;
  answer: { text: string };
};

type Answer = {
  text: string;
  fraction: number;
};

type Question = {
  name: { text: string };
  type: string;
  questiontext: { text: string };
  subquestions?: SubQuestion[];
  answers?: Answer[];
};

const QuestionTable: React.FC<{ questions: Question[]; onSelect: (q: Question) => void }> = ({ questions, onSelect }) => {
  return (
    <div>
      <h2>Frage-Liste</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions
          .filter(q => q.type === 'matching' || q.type === 'multichoice' || q.type === 'truefalse')
          .map((q, index) => (
            <div key={index} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
              <h3>{q.name?.text || "Unbekannte Frage"}</h3>
              <div dangerouslySetInnerHTML={{ __html: q.questiontext?.text || "" }} />
              
              {/* Matching-Fragen */}
              {q.type === "matching" && q.subquestions && (
                <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  {q.subquestions.map((subq, subIndex) => (
                    <div key={subIndex} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0' }}>
                      {/* Frage anzeigen */}
                      <div dangerouslySetInnerHTML={{ __html: subq.text }} />

                      {/* Dropdown mit nur eindeutigen Antwortkategorien */}
                      <select>
                        <option value="">-- Wähle eine Antwort --</option>
                        {Array.from(new Set(q.subquestions.map(sub => sub.answer.text))) // Entfernt doppelte Antworten
                          .map((answer, index) => (
                            <option key={index} value={answer}>{answer}</option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Multiple-Choice-Fragen */}
              {q.type === "multichoice" && q.answers && (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  {q.answers.map((answer, ansIndex) => (
                    <li key={ansIndex}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={<span dangerouslySetInnerHTML={{ __html: answer.text }} />}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {/* True-False-Fragen */}
              {q.type === "truefalse" && q.answers && (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  {q.answers.map((answer, ansIndex) => (
                    <li key={ansIndex} style={{ color: answer.fraction > 0 ? "green" : "red" }}>
                      <span dangerouslySetInnerHTML={{ __html: answer.text }} />
                    </li>
                  ))}
                </ul>
              )}

            </div>
          ))}
      </div>
    </div>
  );
};

export default QuestionTable;