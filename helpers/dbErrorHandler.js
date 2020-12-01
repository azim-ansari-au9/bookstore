/**
* Get unique error fields name
*/
// const uniqueMesssage = error => {
//     let output;
//     try{
//         let fieldName = error.message.substring(
//             error.message.lastIndexOf(".$") + 2,
//             error.message.lastIndexOf("_1")
//         );
//         output = fieldName.chartAt(0).toUpperCase()+
//                 fieldName.slice(1)+
//                 "Already exists";
//     } catch (ex) {
//         output = "Unique field Already exists";
//     }
    
//     return output;
// }
/**
 * Get the Errorors message from error object
 */
const uniqueMessage = function(){
    let output;
    try{
        let fieldName = error.message.substring(
            error.message.lastIndexOf(".$") + 2,
            error.message.lastIndexOf("_1")
        );
        output = fieldName.chartAt(0).toUpperCase()+
                fieldName.slice(1)+ "Already exists";
    } 
    catch (ex) 
        {
            output = "Unique field Already exists";
        }
    return output;
}

exports.errorHandler = error =>{
  let message = "";
  if (error.code) {
      switch (error.code) {
          case 11000:
          case 11001:
              message = uniqueMessage(error);
              break;
          default:
              message = "Something Went Wrong";
      }
  } else {
      for (let errorName in error.errorors) {
          if (error.errorrors[errorName].message)
          message = error.errorors[errorName].message;
      }
  } 

  return message;
};