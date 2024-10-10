// import React, { useState, useEffect } from "react";
// import style from "./MainBanner.module.css";
// const MainBanner = () => {
//   const [image, setimage] = useState([
//     {
//       src: "https://media.istockphoto.com/photos/electrician-engineer-work-tester-measuring-voltage-and-current-of-picture-id1284506686?b=1&k=20&m=1284506686&s=170667a&w=0&h=6zPc-aWuOB2XBxVpcN3ddyirJGS60Y3gmaUuDae_jDM=",
//       desc: "Repair with Ease",
//     },
//     {
//       src: "https://wallpaperaccess.com/full/2491148.jpg",
//       desc: "Your Problem our solution",
//     },
//   ]);
//   const [image2, setimage2] = useState([
//     { src: "https://golimitless.com.np/uploads/square.jpg" },
//   ]);

//   var myIndex = 0;

//   var myIndex2 = 0;
//   useEffect(() => {
//     carosal();
//     banner2();
//     const timer = setInterval(() => {
//       carosal();
//       banner2();
//     }, 4000);
//     return () => clearTimeout(timer);
//   }, []);
//   const carosal = () => {
//     var i;
//     const x = document.getElementsByClassName("slides");
//     const z = document.getElementsByClassName("slidesid");
//     for (i = 0; i < x.length; i++) {
//       x[i].style.display = "none";
//       z[i].style.backgroundColor = "white";
//     }
//     myIndex++;
//     if (myIndex > x.length) {
//       myIndex = 1;
//     }
//     x[myIndex - 1].style.display = "block";
//     z[myIndex - 1].style.backgroundColor = "black";
//   };
//   const carosalsider = (a) => {
//     myIndex = a;
//     var i;
//     const x = document.getElementsByClassName("slides");
//     const z = document.getElementsByClassName("slidesid");
//     for (i = 0; i < x.length; i++) {
//       x[i].style.display = "none";
//       z[i].style.backgroundColor = "white";
//     }
//     myIndex++;
//     if (myIndex > x.length) {
//       myIndex = 1;
//     }
//     x[myIndex - 1].style.display = "block";
//     z[myIndex - 1].style.backgroundColor = "black";
//   };

//   const banner2 = () => {
//     var i;
//     const x = document.getElementsByClassName("banner2");

//     for (i = 0; i < x.length; i++) {
//       x[i].style.display = "none";
//     }
//     myIndex2++;
//     if (myIndex2 > x.length) {
//       myIndex2 = 1;
//     }
//     x[myIndex2 - 1].style.display = "block";
//   };
//   const currentDiv = (a) => {
//     return (
//       <div
//         className="slidesid"
//         style={{
//           width: "100px",
//           height: "5px",
//           backgroundColor: "white",
//           marginRight: "2px",
//         }}
//         id={a}
//         onClick={() => {
//           carosalsider(a);
//         }}
//       />
//     );
//   };

//   return (
//     <div className={style.container}>
//       <div className={style.container2}>
//         <div className={style.w3section}>
//           {image.map((imgsrc) => (
//             <div
//               className="slides"
//               key={Math.random}
//               style={{
//                 height: "100%",
//                 width: "100%",
//                 zIndex: 1200,
//                 display: "none",
//                 objectFit: "cover",
//                 position: "relative",
//               }}
//             >
//               <img
//                 src={imgsrc.src}
//                 style={{
//                   height: "100%",
//                   width: "100%",
//                   zIndex: 1200,
//                   objectFit: "cover",
//                 }}
//                 alt="banner"
//               ></img>
//               <div className={style.hoverText}>
//                 <div>{imgsrc.desc}</div>
//               </div>
//             </div>
//           ))}
//           <div className={style.slider}>
//             {image.map((imgsrc, index) => currentDiv(index))}
//           </div>
//         </div>

//         <div
//           className={style.w3content}
//           style={{
//             flex: 3,
//             height: "80%",
//             width: "100%",
//             marginTop: "0.8%",
//             marginBottom: "0.8%",
//             marginLeft: "0.1%",
//           }}
//         >
//           {image2.map((imgsrc) => (
//             <img
//               className="banner2"
//               src={imgsrc.src}
//               alt="none"
//               style={{ height: "100%", width: "100%", objectFit: "contain" }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default MainBanner;

import React, { useState, useEffect } from "react";
import style from "./MainBanner.module.css";

const MainBanner = () => {
  const [image, setimage] = useState([
    {
      src: "https://media.istockphoto.com/photos/electrician-engineer-work-tester-measuring-voltage-and-current-of-picture-id1284506686?b=1&k=20&m=1284506686&s=170667a&w=0&h=6zPc-aWuOB2XBxVpcN3ddyirJGS60Y3gmaUuDae_jDM=",
      desc: "Repair with Ease",
    },
    {
      src: "https://wallpaperaccess.com/full/2491148.jpg",
      desc: "Your Problem our solution",
    },
  ]);

  const [image2, setimage2] = useState([
    { src: "https://golimitless.com.np/uploads/square.jpg" },
  ]);

  var myIndex = 0;
  var myIndex2 = 0;

  useEffect(() => {
    carosal();
    banner2();
    const timer = setInterval(() => {
      carosal();
      banner2();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const carosal = () => {
    var i;
    const x = document.getElementsByClassName("slides");
    const z = document.getElementsByClassName("slidesid");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
      z[i].style.backgroundColor = "white";
    }
    myIndex++;
    if (myIndex > x.length) {
      myIndex = 1;
    }
    x[myIndex - 1].style.display = "block";
    z[myIndex - 1].style.backgroundColor = "black";
  };

  const carosalsider = (a) => {
    myIndex = a;
    var i;
    const x = document.getElementsByClassName("slides");
    const z = document.getElementsByClassName("slidesid");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
      z[i].style.backgroundColor = "white";
    }
    myIndex++;
    if (myIndex > x.length) {
      myIndex = 1;
    }
    x[myIndex - 1].style.display = "block";
    z[myIndex - 1].style.backgroundColor = "black";
  };

  const banner2 = () => {
    var i;
    const x = document.getElementsByClassName("banner2");

    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    myIndex2++;
    if (myIndex2 > x.length) {
      myIndex2 = 1;
    }
    x[myIndex2 - 1].style.display = "block";
  };

  const currentDiv = (a) => {
    return (
      <div
        className="slidesid"
        style={{
          width: "100px",
          height: "5px",
          backgroundColor: "white",
          marginRight: "2px",
        }}
        id={a}
        key={a} // Added the key prop here
        onClick={() => {
          carosalsider(a);
        }}
      />
    );
  };

  return (
    <div className={style.container}>
      <div className={style.container2}>
        <div className={style.w3section}>
          {image.map((imgsrc, index) => (
            <div
              className="slides"
              key={index} // Added the key prop here
              style={{
                height: "100%",
                width: "100%",
                zIndex: 1200,
                display: "none",
                objectFit: "cover",
                position: "relative",
              }}
            >
              <img
                src={imgsrc.src}
                style={{
                  height: "100%",
                  width: "100%",
                  zIndex: 1200,
                  objectFit: "cover",
                }}
                alt="banner"
              ></img>
              <div className={style.hoverText}>
                <div>{imgsrc.desc}</div>
              </div>
            </div>
          ))}
          <div className={style.slider}>
            {image.map((imgsrc, index) => currentDiv(index))}
          </div>
        </div>

        <div
          className={style.w3content}
          style={{
            flex: 3,
            height: "80%",
            width: "100%",
            marginTop: "0.8%",
            marginBottom: "0.8%",
            marginLeft: "0.1%",
          }}
        >
          {image2.map((imgsrc, index) => (
            <img
              className="banner2"
              alt="read"
              key={index} // Added the key prop here
              src={imgsrc.src}
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
