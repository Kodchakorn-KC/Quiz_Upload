import { XMLParser } from 'fast-xml-parser'
import { Question } from '../types/types'

export const parseXMLFile = (file: File): Promise<Question[]> => {
  return new Promise((resolve) => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      allowBooleanAttributes: true,
      trimValues: false,
      preserveOrder: false,
      parseTagValue: true,
      parseAttributeValue: true,
    })

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (!content || typeof content !== 'string') return resolve([])

      const json = parser.parse(content)
      const rawQuestions = json.quiz?.question ?? []
      const normalized = Array.isArray(rawQuestions)
        ? rawQuestions
        : [rawQuestions]

      const allFileTags: any[] = []
      normalized.forEach((q: any) => {
        if (q.questiontext?.file) {
          const files = Array.isArray(q.questiontext.file)
            ? q.questiontext.file
            : [q.questiontext.file]
          allFileTags.push(...files)
        }
      })

      const fileMap: Record<string, string> = {}
      allFileTags.forEach((f) => {
        if (f['@_name'] && f['#text']) {
          fileMap[f['@_name']] = `data:image/png;base64,${f['#text']}`
        }
      })

      const parsedQuestions: Question[] = normalized
        .filter((q) => q['@_type'])
        .filter((q) => {
  const nameText = q.name?.text
  return typeof nameText === 'string' && nameText.trim().length > 0
})

        .map((q): Question => {
          const type = q['@_type']
          const nameText = typeof q.name?.text === 'string' ? q.name.text : ''
            const name = { text: nameText.trim() }


          let questiontext = q.questiontext?.text ?? ''
          Object.entries(fileMap).forEach(([fname, uri]) => {
            questiontext = questiontext.replace(
              new RegExp(`@@PLUGINFILE@@/${fname}`, 'g'),
              uri
            )
          })
          if ((type === 'shortanswer' || type === 'numerical') && q.answer) {
  const answers = Array.isArray(q.answer) ? q.answer : [q.answer]
  return {
    type,
    name,
    questiontext: { text: questiontext },
    answers: answers.map((a: any) => ({
      text: a.text ?? '',
      fraction: parseFloat(a['@_fraction'] ?? '0'),
    })),
  }
}


          if (type === 'matching' && q.subquestion) {
            const subs = Array.isArray(q.subquestion)
              ? q.subquestion
              : [q.subquestion]
            const subquestions = subs.map((sub: any) => ({
              text: sub.text ?? '',
              answer: { text: sub.answer?.text ?? '' },
            }))
            return { type, name, questiontext: { text: questiontext }, subquestions }
          }

          if (
            (type === 'multichoice' || type === 'truefalse') &&
            q.answer
          ) {
            const answers = Array.isArray(q.answer) ? q.answer : [q.answer]
            return {
              type,
              name,
              questiontext: { text: questiontext },
              answers: answers.map((a: any) => ({
                text: a.text ?? '',
                fraction: parseFloat(a['@_fraction'] ?? '0'),
              })),
            }
          }

          return { type, name, questiontext: { text: questiontext } }
        })

      resolve(parsedQuestions)
    }

    reader.readAsText(file)
  })
}
