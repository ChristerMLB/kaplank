import React from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'

export default function BoardPlusCard(props) {

  return (
    <Card className='myCard plusCard' >
        <Button 
        onClick={props.flipToEdit}
        variant="outlined" 
        fullWidth
        id="newBoard"
        size='large'
        >
        Legg til tavle
        </Button>
    </Card>
  )
}