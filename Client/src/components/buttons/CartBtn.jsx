import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Cartbtn = () => {
  //We get a state of addItems.
  const state = useSelector((state)=>state.addItem)
  return (
    <>
    <NavLink to="/cart" className="btn btn-outline-primary ms-2" id="headerbtn">
        <span className="fa fa-shopping-cart me-1"></span> Cart({state?state.data.items.length:0})
    </NavLink>
      
    </>
  )
}

export default Cartbtn
