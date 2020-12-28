// choose if you want to see the dte or day only

exports.getDate = () => {
    const day = new Date();
    // const options = {
    //   weekday: "long",
    //   day: "numeric",
    //   month: "long"
    // };
    // const day = today.toLocaleDateString("en-US", options);
    const year = day.getFullYear();
    const month = (day.getMonth() + 1);
    const dayNumber = day.getDate();
    const today =  year + "-" + month + "-" + dayNumber;
    return today;
};


//
// exports.getDay = () => {
//   const today = new Date();
//   const dayNum = today.getDay();
//   const options = {
//     weekday: "long",
//   };
//   const day = today.toLocaleDateString("en-US", options);
//   return day;
// };
