photoCollection = [
    {
    photo: 'images/lachlan-gowen-PjEGHyLTngc-unsplash.jpg',
    title: 'Green mountain and small island',
    description: 'Photo by <a href="https://unsplash.com/@lachlangowen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Lachlan Gowen</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
  },

  {
    photo: 'images/hans-isaacson-gWsvWQaYexo-unsplash.jpg',
    title: 'Sunflower',
    description: 'Photo by <a href="https://unsplash.com/@hans_isaacson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Hans Isaacson</a> on <a href="https://unsplash.com/t/nature?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
  },

  {
    photo: 'images/matt-drenth-rOe1zlccwsg-unsplash.jpg',
    title: 'Trees',
    description: 'Photo by <a href="https://unsplash.com/@mattdren?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matt Drenth</a> on <a href="https://unsplash.com/t/nature?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
  },

  {
    photo: 'images/laura-nyhuis-tkWJxlKNlfk-unsplash.jpg',
    title: 'Underwater',
    description: 'Photo by <a href="https://unsplash.com/@lauraintacoma?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Laura Nyhuis</a> on <a href="https://unsplash.com/t/nature?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
  },

  {
    photo: 'images/david-clode-vGcwrUJ9xhc-unsplash.jpg',
    title: 'Bird',
    description: 'Photo by <a href="https://unsplash.com/@davidclode?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">David Clode</a> on <a href="https://unsplash.com/t/nature?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
  },
]

function addPhotos() {
    photoCollection.forEach((photo, idx) => {
        $("#thumbnails").append(`<img data-num="${idx}" src="${photo.photo}"/>`)        
    });

    $("#thumbnails img").click(setPhoto)
}

function showPhoto(id) {

    if (id >= photoCollection.length) {
        id = 0;
    }

    if (id < 0) {
        id = photoCollection.length - 1;
    }
    activePhotoId = id
    photo = photoCollection[activePhotoId]

    $("#photo-img").attr('src', photo.photo)
    $("#photo-label").html(photo.title)
    $("#photo-description").html(photo.description)
    
    $("#thumbnails img").css("background-color", "#ddd")
    $(`#thumbnails img:nth-of-type(${id+1})`).css("background-color", "greenyellow")

}

function setPhoto() {

    id = parseInt($(this).attr('data-num'))
    showPhoto(id)
}


function showNext() {
    showPhoto(activePhotoId+1)
}

function showPrev() {
    showPhoto(activePhotoId-1)
}

$("#left-arr").click(showPrev)
$("#right-arr").click(showNext)

activePhotoId = 0

addPhotos()
showPhoto(0)