import React, { useState } from "react";
import XMLUploader from "./XMLUploader";
import QuestionTable from "./QuestionTable";
//import ExportButton from "./ExportButton";
//<ExportButton questions={questions} />

const App: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

  return (
    <div>
      <h1>XML Frage-Manager</h1>
      <XMLUploader onUpload={setQuestions} />
      
      <QuestionTable questions={questions} onSelect={setSelectedQuestion} />
    </div>
  );
};

export default App;
