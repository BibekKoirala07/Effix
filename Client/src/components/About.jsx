import React from "react";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <div>
      <div className="container py-5 my-4">
        <div className="row">
          <div className="col-md-6">
            <h1 className="fw-bold mb-3">About Us</h1>
            <p className="lead">
              Efix is a startup idea which emerged due to the crisis of time and
              knowledge for maintenance of home appliances and in today's world.
              We as IT students and innovation enthusiasts began to find the
              solution for the particular problem and an idea of a company which
              will bring ease in repairing home appliances by connecting
              technicians with people and making appointments with proper
              details so that people can get the services according to their
              time at their doorstep. And we named the company as "Efix" since
              it is all about electronic fixing services. We are very hopeful
              that Efix will bring a huge impact on people's lives by saving
              their time, preventing them from many scams in this particular
              field and many more.
            </p>
            <NavLink to="/contact" className="btn btn-outline-primary px-3">
              Contact Us
            </NavLink>
          </div>
          <div className="logophoto">
            <img
              src="photos/contact.png"
              alt="About Us"
              height="200px"
              width="600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
