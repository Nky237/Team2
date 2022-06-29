let navLinks = document.querySelector('.mobile-nav-links')
let burgerBtn = document.querySelector('.burger')
let mainContent = document.querySelector('main')
burgerBtn.addEventListener('click',function(){
    navLinks.classList.toggle('active')
    mainContent.classList.toggle('main-drop')
})