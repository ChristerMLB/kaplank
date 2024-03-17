import React from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'

export default function ItemPlusCard(props) {

  return (
    <Card className='myCard plusCard' >
        <Button 
        onClick={props.flipToEdit}
        variant="standard" 
        fullWidth
        id="newCard" 
        >
        Legg til lapp
        </Button>
    </Card>
  )
}