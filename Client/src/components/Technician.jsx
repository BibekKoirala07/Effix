import React from "react";



const Technician = () => {
  return (
    <>
      <div className="container emp-profile">
        <form method="">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img">
                <img src="photos/ram.jpg" alt="ram" />
              </div>
            </div>

            <div className="col-md-6">
              <div className="profile-head">
                <h5>Ram Sharma</h5>
                <h6>Technician</h6>
                <p className="profile-rating mt-3 mb-5">RANKING <span>1/10</span></p>

                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab">About</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" id="profile-tab" data-toggle="tab" href="#profile" role="tab">Timeline</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-2">
              <input type="submit" className="profile-edit-btn" name="btnAddMore" vlaue="Edit Profile" />

            </div>

          </div>
          <div className="row">
            {/*left side url*/}
            <div className="cold-md-4">
              <div className="profile-work"><p>WORK LINK</p>
                <a href="https://www.linkedin.com/in/manasi-khanal-86054521b/" target="_ram">LinkedIn</a><br />
              </div>
            </div>

            {/*right side data toggle*/}
            <div className="cold-md-8 pl-5 technician info">
              <div className="tab-content profile-tab" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                  <div className="row">
                    <div className="col-md-6">
                      <label>User ID</label>

                    </div>
                    <div className="col-md-6">
                      <p>1234</p>

                    </div>
                  </div>


                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Name</label>

                    </div>
                    <div className="col-md-6">
                      <p>Ram Sharma</p>

                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Name</label>

                    </div>
                    <div className="col-md-6">
                      <p>Ram Sharma</p>

                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Name</label>

                    </div>
                    <div className="col-md-6">
                      <p>Ram Sharma</p>

                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Name</label>

                    </div>
                    <div className="col-md-6">
                      <p>Ram Sharma</p>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
export default Technician