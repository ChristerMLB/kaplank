import React from 'react'
import { useAuth } from '../contexts/AuthContext';
import Button from '@mui/material/Button';

export default function SettingsMenu(props) {
    const {username} = props;
    const {logout} = useAuth();

    async function signoutButton(){
        try{
          await logout();
        }catch(err){
          console.error(err);
        }
      }

    return (
        <div className='settingsMenuOpen'>
            <p>Logget inn som {username}</p>
            <Button onClick={signoutButton} >Logg ut</Button>
        </div>
    )
}