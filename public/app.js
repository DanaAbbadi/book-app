function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  for(let i=0 ; i<10 ; i++){
  $(`#${i}`).on('click', function(){
    $(`.${i}`).css("display", "inline");
  })
}






