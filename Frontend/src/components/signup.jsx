import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ error, setError ] = useState()
    const {register, handleSibmit } = useForm
  return (
    <div>
      
    </div>
  )
}

export default Signup
