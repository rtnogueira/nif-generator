import * as FileSaver from 'file-saver'
import React from 'react'
import * as XLSX from 'xlsx'
import Button from '@mui/material/Button'

interface ExportCSVProps {
  csvData: string[]
  fileName: string
}

const ExportCSV: React.FC<ExportCSVProps> = ({ csvData, fileName }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSVFn = (csvData: string[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData.map(value => ({ NIF: value })))
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  return (
    <Button
      fullWidth
      variant="contained"
      color="secondary"
      onClick={() => exportToCSVFn(csvData, fileName)}
    >
      Export to .XLSX
    </Button>
  )
}

export default ExportCSV
