import React from 'react'
import { useParams } from 'react-router'
import { useState } from 'react';
import {DATA} from '../Data';
import { useDispatch } from 'react-redux';
import {addItem, delItem} from '../redux/actions/index'

const ServicesDetail = () => {
  const [cartBtn, setCartBtn]=useState("Add to Cart")

  /*Now we need a service id which is pass from service page.*/

  const serid = useParams();
  const serDetail =DATA.filter(x=>x.id == serid.id)
  const services = serDetail[0];
  console.log(services);

  //We need to store useDispatch in a variable
  const dispatch = useDispatch()

  const handleCart =(services)=>{
    if (cartBtn === "Add to Cart"){
      dispatch(addItem(services))
    setCartBtn("Remove from Cart")
  }
  else{
    dispatch(delItem(services))
    setCartBtn("Add to Cart")
  }
}


  return (
    <>
    <div className="container  my-5 py-3">
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center mx-auto services">
          <img src={services.img} alt={services.title} height="400px" />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="display-5 fw-bold">{services.title}</h1>
          <hr/>
          <h2 className="my-4">$ as per case</h2>
          <p className="lead">{services.desc}</p>
          <button onClick={()=>handleCart(services)} className="btn btn-outline-primary my-5">{cartBtn}</button>
        </div>
      </div>
    </div>


    </>
  )
}

export default ServicesDetail
