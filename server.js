import express from 'express'
import connectBusboy from 'connect-busboy'
import Excel from 'exceljs'

const app = express()
const port = 3000

// app.use(express.json())
app.use(connectBusboy({
  highWaterMark: 10 * 1024,
}))

app.post('/upload', (req, res) => {
  req.pipe(req.busboy)

  req.busboy.on('file', async (fieldname, file, filename) => {
    console.log('upload file:', filename)
    const workbook = new Excel.stream.xlsx.WorkbookReader(file)
    console.time('workbook')
    for await (const sheet of workbook) {
      for await (const row of sheet) {
        const a = row.actualCellCount
        // let's say a first row is a header
        if (row.number == 1) continue
        // do something with an excel row from stream!
        console.log(row.number)
      }
    }
    console.timeEnd('workbook')
    res.status(200).send({ ok: 'ok' })

  })
})

app.post('/uploadFull', (req, res) => {
  req.pipe(req.busboy)

  req.busboy.on('file', async (fieldname, file, filename) => {
    console.log('upload file:', filename)
    const workbook = new Excel.Workbook()
    const excel = await workbook.xlsx.read(file)
    res.status(200).send({ ok: 'ok' })

  })
})

app.listen(port, () => {
  console.log(`App listening on localhost:${port}`)

})
