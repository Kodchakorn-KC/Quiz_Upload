import React, { useState } from 'react'
import { Button } from '@mui/material'
import { parseXMLFile } from '../utils/parseXMLFile'
import { Question } from '../types/types'

const XMLUploader: React.FC<{ onUpload: (questions: Question[]) => void }> = ({
  onUpload,
}) => {
  const [fileNames, setFileNames] = useState<string[]>([])

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setFileNames(Array.from(files).map((file) => file.name))

    const allParsed = await Promise.all(Array.from(files).map(parseXMLFile))
    const flatQuestions = allParsed.flat()
    onUpload(flatQuestions)
  }

  return (
    <div>
      <input
        type="file"
        accept=".xml"
        id="file-upload"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" color="primary" component="span">
          XML-Dateien hochladen
        </Button>
      </label>

      <ul>
        {fileNames.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
    </div>
  )
}

export default XMLUploader
