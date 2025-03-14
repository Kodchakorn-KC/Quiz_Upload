import React from "react";

const XMLUploader: React.FC<{ onUpload: (questions: any[]) => void }> = ({ onUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(e.target.result as string, "text/xml");

      const questionNodes = Array.from(xmlDoc.getElementsByTagName("question"));
      const parsedQuestions = questionNodes.map((qNode) => {
        const type = qNode.getAttribute("type") || "";
        const name = qNode.getElementsByTagName("name")[0]?.textContent || "Unbenannte Frage";
        const questiontext = qNode.getElementsByTagName("questiontext")[0]?.textContent || "";

        // Matching-Fragen
        if (type === "matching") {
          const subquestions = Array.from(qNode.getElementsByTagName("subquestion")).map((sub) => ({
            text: sub.getElementsByTagName("text")[0]?.textContent || "",
            answer: { text: sub.getElementsByTagName("answer")[0]?.textContent || "" }
          }));
          return { type, name: { text: name }, questiontext: { text: questiontext }, subquestions };
        }

        // Multiple-Choice-Fragen
        if (type === "multichoice") {
          const answers = Array.from(qNode.getElementsByTagName("answer")).map((ans) => ({
            text: ans.getElementsByTagName("text")[0]?.textContent || "",
            fraction: parseFloat(ans.getAttribute("fraction") || "0"),
          }));
          return { type, name: { text: name }, questiontext: { text: questiontext }, answers };
        }

        // True-False-Fragen
        if (type === "truefalse") {
          const answers = Array.from(qNode.getElementsByTagName("answer")).map((ans) => ({
            text: ans.getElementsByTagName("text")[0]?.textContent || "",
            fraction: parseFloat(ans.getAttribute("fraction") || "0"),
          }));
          return { type, name: { text: name }, questiontext: { text: questiontext }, answers };
        }

        return { type, name: { text: name }, questiontext: { text: questiontext } };
      });

      onUpload(parsedQuestions);
    };

    reader.readAsText(file);
  };

  return <input type="file" accept=".xml" onChange={handleFileUpload} />;
};

export default XMLUploader;
