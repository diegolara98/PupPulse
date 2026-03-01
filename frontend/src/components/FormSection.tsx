import { Card, CardContent, Typography } from '@mui/material'
import { formSectionStyles as s } from './FormSection.styles'

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <Card sx={s.card} elevation={2}>
      <CardContent sx={s.content}>
        <Typography variant="subtitle1" sx={s.title}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}
