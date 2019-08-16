/*Code taken from Lab 5 Tutorial and Modified for this Final Project. CST 336 Summer 2019*/


$(document).ready(function() {
var result1;
var result2;
var result3;
  
  $.when(
     $.ajax({
                    method:"get",
                    url: "/getPetTypes",
                  data: {
                          //"" : ,
                        },
                    success: function(result,status){
                      //console.dir(result);
                       result1 = result;
                        
                    }
                }),//ajax
    
    
             $.ajax({
                    method:"get",
                    url: "/getPetLocation",
                  data: {
                          //"" : ,
                        },
                    success: function(result,status){
                      result2 = result;  
                      
                    }
                }),//ajax

                    $.ajax({
                    method:"get",
                    url: "/getAdoptionFee",
                  data: {
                          //"" : ,
                        },
                    success: function(result,status){
                      //console.dir(result);
                      result3 = result;
                        
                    }
                })//ajax
    
).then(function() {
    //console.dir(result1);
    for(let i=0; i < result1.length; i++)
                        {
                            $("#animal").append("<option value= " + result1[i].animal_type + ">" + result1[i].animal_type  + "</option>");
                            //$("#location").append("<option value= " + result[i].location + ">" + "</option>");
                            
                        }
    for(let i=0; i < result2.length; i++)
                        {
                            //$("#animal").append("<option value= " + result[i].animal_type + ">" + "</option>");
                            $("#location").append("<option value= " + result2[i].location + ">" + result2[i].location + "</option>");
                            
                        }
    for(let i=0; i < result3.length; i++)
                        {
                            $("#adoptionFee").append("<option value= " + result3[i].adoption_fee +">" + result3[i].adoption_fee + "</option>");
                            //$("#location").append("<option value= " + result[i].location + ">" + "</option>");
                            
                        }
});
  
/*  
getAnimalType();
for(i=0;i<999;i++)
  {
    //do nothing
  }  
  
getAnimalLocation();
for(i=0;i<999;i++)
  {
    //do nothing
  }
getAnimalPrice();
 */
                 
   $(".petLink").on("click", function() {
    $.ajax({
      method: "get",
      url: "/api/getimage",
      data: {

        "animal_type" : $(this).text().trim(),
      },
      success: function(rows, status) {
        
        $("#animalResult").html("");
        rows.forEach(function(row) {
        $("#animalResult").append("<img id='image' src='" + row.image + "' width='200' height='200'/>");

        })
      }
    }) //ajax
  }); //petLink
  //});
  
  
  
 //save the pet name in a session variable when adopt button is clicked
  $(document).on("click", ".adoptButton", function(){
    var petName = $(this).attr("value"); 
    $.ajax({
      method: "get",
      url: "/storeInfo",
      data: {
            "pet_name" : petName
            },
      success: function(rows, status){
        
        //put the pet in the adpoted pets table
        $.ajax({
    
        method: "post",
        url: "/insertAdoptedPet",
        data: {
              "pet_name" : petName,
        },
        success: function(result, status){
        },//success  
        error: function(err, status) {
        console.log(err);
      }
    });//ajax
      
      }//end of store info success
});//end of ajax
  });//end of adopt button
 
    

  //button to display cart/session variable contents
  $("#showCart").click(function() {
    $.ajax({
    
      method: "get",
      url: "/retrieveInfo",
      data: {
       
      },
      success: function(result, status){
        $("#cartContainer").html("")
        for(i=0;i<result.pets.length;i++)
          {
            $("#cartContainer").append(result.pets[i]);
            $("#cartContainer").append("<br>");
          }
        $("#cartContainer").append("Cart total: " + result.cartTotal);
      },//success  
      error: function(err, status) {
        console.log(err);
      }
    });//ajax
    });
    
       //Action listener for adpot search button
$("#search").click(function() {
  var animalType = $("#animal").val();
  var physicalLocation = $("#location option:selected").text();//prevents issue with only getting first word of name
  var adoptionFee = $("#adoptionFee").val();
  
  /*
  if(physicalLocation == "Union")
  {
    physicalLocation += " City";
  } else if(physicalLocation == "Santa") {
    physicalLocation += " Clara";
  } else if(physicalLocation == "Los") {
    physicalLocation += " Angeles";          
  } else if(physicalLocation == "San"){
    physicalLocation += " Francisco";        
  }else if(physicalLocation == "Menlo"){
    physicalLocation += " Park";
  }else if(physicalLocation == "Orange"){
    physicalLocation += " County";
  }
  */
  
  $.ajax({
    
      method: "get",
      url: "/adoptSearch",
      data: {
        "animal" : animalType, "location" : physicalLocation, "adoption_fee" : adoptionFee,
      },
      success: function(result, status){
        $("#animalResult").html("");
        for(i=0;i<result.length;i++)
          {
            $("#animalResult").append(`
                                      ${result[i].pet_name} ${result[i].animal_type} 
                                      ${result[i].adoption_fee}  
                                      ${result[i].location} 
                                      <img class='image' src='${result[i].image}' width='75'> ${result[i].description} 
                                      <button class='adoptButton' value='${result[i].pet_name} ${result[i].adoption_fee}'>Adopt</button> <br>
                                      
                                     `);  
            $("#animalResult").append("<br>");
          }
      },//success  
      error: function(err, status) {
        console.log(err);
      }
    });//ajax
    
});

 $("#searchAll").on("click", function() {
 $.ajax({
      method: "get",
      url: "/getAllPets",
      data: {
            
            },
      success: function(result, status){
         $("#animalResult").html("");
        for(i=0;i<result.length;i++)
          {
            $("#animalResult").append(`
                                      ${result[i].pet_name} ${result[i].animal_type} 
                                      ${result[i].adoption_fee}  
                                      ${result[i].location} 
                                      <img class='image' src='${result[i].image}' width='75'> ${result[i].description} 
                                      <button class='adoptButton' value='${result[i].pet_name} ${result[i].adoption_fee}'>Adopt</button> <br>
                                      
                                     `);  
            $("#animalResult").append("<br>");
          }
      },//success  
      error: function(err, status) {
        console.log(err);
      }
    });//ajax
});
  
   $("#petNames").on("change",function(){
     var petName = $("#petNames").val();
     //console.log("petnames state change detected")
                $.ajax({
                    method:"get",
                    url:"/getPetInfo",
                    
                    data:{"pet_name": petName},
                    success: function(result,status){
                        $("#updatePetCurrentValuesDisplay").html(result[0].pet_name + " " + result[0].animal_type + " " + result[0].adoption_fee + " " + result[0].location + " " + result[0].image + " " + result[0].description);
                        
                    }
                });//ajax
            });//state 
  
  }) //ready document
  
/*
async function getAnimalType(){
  //Execute automatically when page is loaded, this will prevent double click problem
                $.ajax({
                    method:"get",
                    url: "/getPetTypes",
                  data: {
                          //"" : ,
                        },
                    success: function(result,status){
                      console.dir(result);
                        for(let i=0; i < result.length; i++)
                        {
                            $("#animal").append("<option value= " + result[i].animal_type + ">" + result[i].animal_type  + "</option>");
                            //$("#location").append("<option value= " + result[i].location + ">" + "</option>");
                            
                        }
                    }
                });//ajax
}

async function getAnimalLocation(){
  //Execute automatically when page is loaded, this will prevent double click problem
                $.ajax({
                    method:"get",
                    url: "/getPetLocation",
                  data: {
                          //"" : ,
                        },
                    success: function(result,status){
                        for(let i=0; i < result.length; i++)
                        {
                            //$("#animal").append("<option value= " + result[i].animal_type + ">" + "</option>");
                            $("#location").append("<option value= " + result[i].location + ">" + result[i].location + "</option>");
                            
                        }
                    }
                });//ajax

}


async function getAnimalPrice(){
   //Execute automatically when page is loaded, this will prevent double click problem
                $.ajax({
                    method:"get",
                    url: "/getAdoptionFee",
                  data: {
                          //"" : ,
                        },
                    success: function(result,status){
                      console.dir(result);
                        for(let i=0; i < result.length; i++)
                        {
                            $("#adoptionFee").append("<option value= " + result[i].adoption_fee +">" + result[i].adoption_fee + "</option>");
                            //$("#location").append("<option value= " + result[i].location + ">" + "</option>");
                            
                        }
                    }
                });//ajax
}
*/

// Action Listener for when the shopping cart is clicked on
$("#cartContainer").on("click", function() {
  $("#cartContainer").html("");
  $("#cartContainer").append('<i class="fas fa-cart-arrow-down"></i>');
});

// Action listener for when an already clicked cart is clicked
$("#cartContainer").on("click", function() {
  $("#cartContainer").html("");
  $("#cartContainer").append('<i class="fas fa-shopping-cart"></i>');
});