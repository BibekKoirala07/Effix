import React from 'react'
import { NavLink } from 'react-router-dom';
import { DATA } from '../Data'


const Services = () => {

  const cardItem = (item) => {
    return (
      <div className="card my-5 py-4" key={item.id} style={{ width: "18rem" }}>
        <div className="servicephoto"><img src={item.img} height="100%" width="50%" className="card-img-top" alt={item.title} /></div>
        <div className="card-body text-center">
          <h5 className="card-title">{item.title}</h5>
          <p className="lead">$ as per case</p>
          <NavLink to={`/services/${item.id}`} className="btn btn-outline-primary">Take service</NavLink>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center">
            <h1>Services</h1>
            <hr />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-around">
          {DATA.map(d => {
            console.log(d)
            return cardItem(d)
          })}
        </div>
      </div>
    </div>

  )
}

export default Services
